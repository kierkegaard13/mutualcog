var mysql = require('mysql-activerecord'),
	marked = require('marked'),
	conn = new mysql.Adapter({
		server: 'localhost',
		username: 'root',
		password: 'snareline1',
		database: 'test'
	}),
	moment = require('moment');

marked.setOptions({
	sanitize:true,
	breaks:true,
	highlight:function (code) {
		return require('highlight.js').highlightAuto(code).value;
	}
});

process.env.TZ = 'UTC';
var clients = new Array();
var banned = new Array();
var authorized = new Array();

function hashHtml(text){
	return text.replace(/#/,'&#035;');
}

function sanitize(text) {
	return text.replace(/&/g, '&amp;').
		replace(/</g, '&lt;').  // it's not neccessary to escape >
		replace(/"/g, '&quot;').
		replace(/'/g, '&#039;');
}

function processMessage(message){
	var url_reg = /(\s)(https?:\/\/)?([\da-z-]+)\.([a-z]{2,6})([\/\w\.-]*)*\/?/g;
	var url_reg2 = /^(https?:\/\/)?([\da-z-]+)\.([a-z]{2,6})([\/\w\.-]*)*\/?/g;
	var url_reg3 = /(img)(\s)(src\=)/g;
	var t_reg = /\/t\/([^\s]*)(\s*)/g; 
	var p_reg = /\/p\/([^\s]*)(\s*)/g; 
	var re1 = new RegExp('^<p>','g');
	var re2 = new RegExp('</p>$','g');
	message = hashHtml(message);
	message = marked(message);
	if(message.length){
		message = message.replace(/^\s+|\s+$/g,'');
		message = message.replace(re1,'');
		message = message.replace(re2,'');
		message = message.replace(p_reg,"<a class='chat_link' href='\/\/mutualcog.com/p/$1'>\/p\/$1</a>$2");
		message = message.replace(t_reg,"<a class='chat_link' href='\/\/mutualcog.com/t/$1'>\/t\/$1</a>$2");
		message = message.replace(url_reg,"$1<a class='chat_link' href='\/\/$3\.$4$5'>$3\.$4$5</a>");
		message = message.replace(url_reg2,"<a class='chat_link' href='\/\/$2\.$3$4'>$2\.$3$4</a>");
		message = message.replace(url_reg3,"$1$2style='max-width:300px;max-height:200px;margin-bottom:5px;' $3");
	}
	return message;
}

function repeatString(x,n){
	var s = '';
	for(;;){
		if(n & 1) s += x;
		n >>= 1;
		if(n) x += x;
		else break;
	}
	return s;
}

var io = require('socket.io').listen(3000);

io.set('authorization',function(handshake,cb){
	handshake.sid = handshake.query.sid;
	if(handshake.sid in authorized){
		var user_data = authorized[handshake.sid];
		handshake.authorized = 1;
		handshake.user = user_data.user;
		handshake.user_id = user_data.id;
		handshake.memb_id = user_data.id;
		handshake.serial = user_data.serial;
		handshake.serial_id = user_data.serial_id;
		delete authorized[handshake.sid];
	}else{
		handshake.authorized = 0;
	}
	cb(null,true);
});

io.sockets.on('connection', function(client) {

	var handshake = client.handshake;
	client.sid = handshake.sid;

	if(handshake.authorized){
		client.authorized = handshake.authorized;
		client.user = handshake.user;
		client.user_id = handshake.user_id;
		client.memb_id = handshake.memb_id;
		client.serial = handshake.serial;
		client.serial_id = handshake.serial_id;
	}else{
		client.authorized = handshake.authorized;
	}

	client.on('login',function(message){
		message = JSON.parse(message);
		if(message.key == 'pyWTPC2pqMCsmTEy'){
			authorized[message.sid] = message.user_data;
		}
	});

	client.on('logoff',function(message){
		message = JSON.parse(message);
		if(message.key == 'pyWTPC2pqMCsmTEy'){
			delete authorized[message.sid];
		}
	});

	//client variable unique to user but globals apply to all
	client.on('room',function(room){
		var channel_var = this.manager.transports[this.id].socket;
		client.room = 'chat_' + sanitize(room);  //sanitize
		client.chat_id = sanitize(room);  //sanitize
		client.join(client.room);
		var rooms_joined = io.sockets.manager.roomClients[client.id];
		client.rooms = new Array();
		for(var prop in rooms_joined){
			prop = prop.substr(1);
			client.rooms.push(prop);
		}
		conn.where({id:client.chat_id}).get('chats',function(err,rows){
			if(err)console.log(err);
			channel_var.live = rows[0].live;
			client.emit('check_live',rows[0].live);
		});
	});

	client.on('add_member',function(info){
		var members = new Array();
		if(!client.authorized){
			client.user = sanitize(info.new_member);  //sanitize
		}
		client.join(client.room + '_member_' + client.user);
		clients.push(info.new_member); //is aware of all chat members 
		console.log(client.user + ' has connected');
		conn.where({id:client.chat_id}).get('chats',function(err,rows){
			if(err)console.log(err);
			client.admin = rows[0].admin;
			client.is_admin = 0;
			client.is_mod = 0;
			if(client.authorized){
				if((client.user == client.admin || client.serial == client.admin) && (client.user_id == rows[0].admin_id || client.serial_id == rows[0].admin_id)){  //added in case a user logs in after creating a chat
					client.is_admin = 1;
				}
			}else{  //if not logged in
				client.serial = client.user;
				client.serial_id = sanitize(info.serial_id);  //sanitize
				client.memb_id = client.serial_id;
				if(client.user == client.admin && client.serial_id == rows[0].admin_id){  //added in case a user logs in after creating a chat
					client.is_admin = 1;
				}
			}
			conn.where({chat_id:client.chat_id,user:client.user}).update('members_to_chats',{active:1},function(err,info){
				if(err)console.log(err);
				conn.where({chat_id:client.chat_id,active:1}).get('members_to_chats',function(err,rows){
					if(err)console.log(err);
					io.sockets.in(client.room).emit('displayMembers',rows);
				});
			});
		});
	});

	client.on('pause_all',function(){
		if(client.is_admin){
			this.manager.transports[this.id].socket.live = 0;
			conn.where({id:client.chat_id}).update('chats',{live:0},function(err,info){
				if(err)console.log(err);
				io.sockets.in(client.room).emit('pause',{hash:'QcWd9JN5Wv7R3CB2'});
			});
		}
	});

	client.on('play_all',function(){
		if(client.is_admin){
			this.manager.transports[this.id].socket.live = 1;
			conn.where({id:client.chat_id}).update('chats',{live:1},function(err,info){
				if(err)console.log(err);
				io.sockets.in(client.room).emit('play',{hash:'b7vNPSsxNBCzJHAY'});
			});
		}
	});

	client.on('make_mod',function(info){  //is mod isn't actually set here
		var user = info.user;
		if(client.is_admin){
			conn.where({user:info.user,chat_id:info.chat_id}).update('members_to_chats',{is_mod:1},function(err,info){
				if(err)console.log(err);
				conn.where({chat_id:client.chat_id,active:1}).get('members_to_chats',function(err,rows){
					if(err)console.log(err);
					io.sockets.in(client.room).emit('displayMembers',rows);
					io.sockets.in(client.room + '_member_' + user).emit('add_mod_funcs');
				});
			});
		}
	});

	client.on('remove_mod',function(info){
		var user = info.user;
		if(client.is_admin){
			conn.where({user:info.user,chat_id:info.chat_id}).update('members_to_chats',{is_mod:0},function(err,info){
				if(err)console.log(err);
				conn.where({chat_id:client.chat_id,active:1}).get('members_to_chats',function(err,rows){
					if(err)console.log(err);
					io.sockets.in(client.room).emit('displayMembers',rows);
					io.sockets.in(client.room + '_member_' + user).emit('remove_mod_funcs');
				});
			});
		}
	});

	client.on('warn',function(info){
		if(client.is_admin || client.is_mod){
			io.sockets.in(client.room + '_member_' + info.member).emit('warn');
		}
	});

	client.on('kick',function(info){ //banned array applies to all chats
		if(client.is_admin || client.is_mod){
			if(banned.indexOf(info.member) == -1){
				banned.push(info.member);
			}
			io.sockets.in(client.room + '_member_' + info.member).emit('kick');
		}
	});

	client.on('update_votes',function(info){
		if(info.responseto == 'global'){
			io.sockets.in(client.room).emit('updateVotes',{message_id:info.id,response:info.response});
		}else{
			io.sockets.in(client.room + '_response_' + info.responseto).emit('updateVotes',{message_id:info.id,response:info.response});
		}
	});

	client.on('update_details',function(info){
		io.sockets.in(client.room).emit('display_details',info);
	});

	// Success!  Now listen to messages to be received
	client.on('message_sent',function(event){ 
		console.log('hello world');
		if(this.manager.transports[this.id].socket.live && banned.indexOf(client.user) == -1 && event.message.replace(/^\s+|\s+$/g,'') != ''){
			event.message = processMessage(event.message);
			conn.insert('messages',{message:event.message,chat_id:client.chat_id,member_id:client.memb_id,created_at:moment.utc().format(),updated_at:moment.utc().format(),responseto:event.responseto,level:event.level,parent:event.parent,author:client.user,serial:client.serial},function(err,info){
				if(err) console.log(err);
				io.sockets.in(client.room).emit('publishMessage',{id:info.insertId,message:event.message,chat_id:client.chat_id,member_id:client.memb_id,created_at:moment.utc().format(),responseto:event.responseto,author:client.user,serial:client.serial,level:event.level,parent:event.parent});
				var insert_id = info.insertId;
				if(event.responseto == 0){
					conn.where({id:info.insertId}).update('messages',{path:"0" + "." + repeatString("0", 8 - insert_id.toString().length) + insert_id,readable:1},function(err,info){
						if(err)console.log(err);
					});
				}else{
					conn.where({id:event.responseto}).get('messages',function(err,rows){
						if(err)console.log(err);
						conn.where({id:insert_id}).update('messages',{path:rows[0].path + "." + repeatString("0", 8 - insert_id.toString().length) + insert_id,readable:1},function(err,info){
							if(err)console.log(err);
						});
					});
					conn.where({id:event.responseto}).get('messages',function(err,rows){
						if(err)console.log(err);
						conn.where({id:event.responseto}).update('messages',{responses:rows[0].responses + 1},function(err,info){
							if(err)console.log(err);
							io.sockets.in(client.room).emit('updateResponseCount',{count:rows[0].responses + 1,id:event.responseto,serial:rows[0].serial});
							if(rows[0].author != client.serial || rows[0].author != client.user){
								io.sockets.in(client.room + '_member_' + rows[0].author).emit('alertUserToResponse',{mssg_id:event.responseto,resp_id:insert_id,parent:event.parent});
							}
						});
					});
				}
				conn.where({serial_id:client.serial}).update('serials',{updated_at:moment.utc().format()},function(err,info){
					if(err) console.log(err);
				});
			});
		}
	});

	client.on('delete_message',function(mssg_info){
		var replace = '<em>This message has been deleted</em>';
		conn.where({id:mssg_info.id}).get('messages',function(err,rows){
			if(err)console.log(err);
			if(rows[0].member_id == client.memb_id){
				conn.where({id:mssg_info.id}).update('messages',{message:replace},function(err){
					if(err)console.log(err);
					io.sockets.in(client.room).emit('softDelete',{id:mssg_info.id,user:mssg_info.user,serial:mssg_info.serial,responses:mssg_info.responses});
				});
			}
		});
	});

	client.on('disconnect',function(){
		clients.splice(clients.indexOf(client.user),1);
		if(clients.indexOf(client.user) == -1){
			//conn.where({member_id:client.memb_id,chat_id:client.chat_id}).delete('members_to_chats',function(err,info){
			//	if(err)console.log(err);
			//	conn.where({chat_id:client.chat_id}).get('members_to_chats',function(err,rows){
			//		if(err)console.log(err);
					conn.where({chat_id:client.chat_id,user:client.user}).update('members_to_chats',{active:0},function(err,info){
						if(err)console.log(err);
					});
					conn.where({serial_id:client.user}).update('serials',{reserved:0},function(err,info){
						if(err) console.log(err);
					});
			//		io.sockets.in(client.room).emit('displayMembers',rows);
			//	});
			//	console.log(client.user + ' has been deleted');
			//});
		}
		console.log(client.user + ' has disconnected');
	});
});
