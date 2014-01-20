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
var live = 1;

function hashHtml(text){
	return text.replace(/#/,'&#035;');
}

function sanitize(text) {
	return text.replace(/&/g, '&amp;').
		replace(/</g, '&lt;').  // it's not neccessary to escape >
		replace(/"/g, '&quot;').
		replace(/'/g, '&#039;');
}

var io = require('socket.io').listen(3000);
var prospect = io.on('connection', function(client) {

	//client variable unique to user but globals apply to all
	client.on('room',function(room){
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
			live = rows[0].live;
			client.emit('check_live',live);
		});
	});

	client.on('add_member',function(info){
		var members = new Array();
		client.user = sanitize(info.new_member);  //sanitize
		client.join(client.room + '_member_' + client.user);
		clients.push(info.new_member); //is aware of all chat members 
		console.log(client.user + ' has connected');
		conn.where({id:client.chat_id}).get('chats',function(err,rows){
			if(err)console.log(err);
			client.admin = rows[0].admin;
			client.is_admin = 0;
			client.is_mod = 0;
			if(info.logged_in == 1){
				client.serial = sanitize(info.serial);  //sanitize
				client.serial_id = sanitize(info.serial_id);  //sanitize
				client.user_id = sanitize(info.user_id);  //sanitize
				if((client.user == client.admin || client.serial == client.admin) && (client.user_id == rows[0].admin_id || client.serial_id == rows[0].admin_id)){  //added in case a user logs in after creating a chat
					client.is_admin = 1;
				}
				client.memb_id = client.user_id;
				conn.where({chat_id:client.chat_id}).get('members_to_chats',function(err,rows){
					if(err)console.log(err);
					io.sockets.in(client.room).emit('displayMembers',rows);
				});
			}else{
				client.serial = client.user;
				client.serial_id = sanitize(info.serial_id);  //sanitize
				if(client.user == client.admin && client.serial_id == rows[0].admin_id){  //added in case a user logs in after creating a chat
					client.is_admin = 1;
				}
				client.memb_id = client.serial_id;
				conn.where({chat_id:client.chat_id}).get('members_to_chats',function(err,rows){
					if(err)console.log(err);
					io.sockets.in(client.room).emit('displayMembers',rows);
				});
			}
		});
	});

	client.on('leave_last_room',function(){
		if(client.rooms.length > 2){
			client.leave(client.rooms[client.rooms.length - 1]);
			var rooms_joined = io.sockets.manager.roomClients[client.id];
			client.rooms = new Array();
			for(var prop in rooms_joined){
				prop = prop.substr(1);
				client.rooms.push(prop);
			}
		}
	});

	client.on('show_responses',function(mssg_id){
		if(client.rooms.length > 3){
			client.leave(client.rooms[client.rooms.length - 1]);
		}
		client.join(client.room + '_response_' + mssg_id);
		var rooms_joined = io.sockets.manager.roomClients[client.id];
		client.rooms = new Array();
		for(var prop in rooms_joined){
			prop = prop.substr(1);
			client.rooms.push(prop);
		}
		conn.where({chat_id:client.chat_id,responseto:mssg_id}).order_by('messages.id asc').get('messages',function(err,rows){
			if(err)console.log(err);
			client.emit('openResponses',rows);
		});
	});

	client.on('pause_all',function(){
		if(client.is_admin){
			conn.where({id:client.chat_id}).update('chats',{live:0},function(err,info){
				if(err)console.log(err);
					io.sockets.in(client.room).emit('pause',{hash:'QcWd9JN5Wv7R3CB2'});
			});
		}
	});

	client.on('play_all',function(){
		if(client.is_admin){
			conn.where({id:client.chat_id}).update('chats',{live:1},function(err,info){
				if(err)console.log(err);
					io.sockets.in(client.room).emit('play',{hash:'b7vNPSsxNBCzJHAY'});
			});
		}
	});

	client.on('pause',function(security){
		if(security.hash == 'QcWd9JN5Wv7R3CB2'){
			live = 0;
		}
	});

	client.on('play',function(security){
		if(security.hash == 'b7vNPSsxNBCzJHAY'){
			live = 1;
		}
	});

	client.on('make_mod',function(info){
		var user = info.user;
		if(client.is_admin){
			conn.where({user:info.user,chat_id:info.chat_id}).update('members_to_chats',{is_mod:1},function(err,info){
				if(err)console.log(err);
				conn.where({chat_id:client.chat_id}).get('members_to_chats',function(err,rows){
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
				conn.where({chat_id:client.chat_id}).get('members_to_chats',function(err,rows){
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

	client.on('kick',function(info){
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
		if(live && banned.indexOf(client.user) == -1 && event.message.replace(/^\s+|\s+$/g,'') != ''){
			var url_reg = /(\s)(https?:\/\/)?([\da-z-]+)\.([a-z]{2,6})([\/\w\.-]*)*\/?/g;
			var url_reg2 = /^(https?:\/\/)?([\da-z-]+)\.([a-z]{2,6})([\/\w\.-]*)*\/?/g;
			var url_reg3 = /(img)(\s)(src\=)/g;
			event.message = hashHtml(event.message);
			event.message = marked(event.message);
			event.message = event.message.replace(/^\<p\>/,'');
			event.message = event.message.replace(/<\/p\>$/,'');
			if(event.message){
				event.message = event.message.replace(url_reg,"$1<a class='chat_link' href='\/\/$3\.$4$5'>$3\.$4$5</a>");
				event.message = event.message.replace(url_reg2,"<a class='chat_link' href='\/\/$2\.$3$4'>$2\.$3$4</a>");
				event.message = event.message.replace(url_reg3,"$1$2style='max-width:300px;max-height:200px;margin-bottom:5px;' $3");
			}
			conn.insert('messages',{message:event.message,chat_id:client.chat_id,member_id:client.memb_id,created_at:moment.utc().format(),updated_at:moment.utc().format(),responseto:"0",author:client.user,serial:client.serial},function(err,info){
				if(err) console.log(err);
				io.sockets.in(client.room).emit('openChat',{id:info.insertId,message:event.message,chat_id:client.chat_id,member_id:client.memb_id,created_at:moment.utc().format(),updated_at:moment.utc().format(),responseto:"0",author:client.user,serial:client.serial,clicked:"-1"});
				conn.where({id:info.insertId}).update('messages',{rank:info.insertId*1000000 + moment.utc().valueOf()/100000000000,readable:1},function(err,info){
					if(err)console.log(err);
				});
				conn.where({serial_id:client.serial}).update('serials',{updated_at:moment.utc().format()},function(err,info){
					if(err) console.log(err);
				});
			});
		}
	});

	client.on('response_sent',function(event){ 
		if(live && banned.indexOf(client.user) == -1 && event.message.replace(/^\s+|\s+$/g,'') != ''){
			var url_reg = /(\s)(https?:\/\/)?([\da-z-]+)\.([a-z]{2,6})([\/\w\.-]*)*\/?/g;
			var url_reg2 = /^(https?:\/\/)?([\da-z-]+)\.([a-z]{2,6})([\/\w\.-]*)*\/?/g;
			var url_reg3 = /(img)(\s)(src\=)/g;
			event.message = hashHtml(event.message);
			event.message = marked(event.message);
			event.message = event.message.replace(/^\<p\>/,'');
			event.message = event.message.replace(/\<\/p\>$/,'');
			if(event.message){
				event.message = event.message.replace(url_reg,"$1<a class='chat_link' href='\/\/$3\.$4$5'>$3\.$4$5</a>");
				event.message = event.message.replace(url_reg2,"<a class='chat_link' href='\/\/$2\.$3$4'>$2\.$3$4</a>");
				event.message = event.message.replace(url_reg3,"$1$2style='max-width:300px;max-height:200px;margin-bottom:5px;' $3");
			}
			conn.insert('messages',{message:event.message,chat_id:client.chat_id,member_id:client.memb_id,created_at:moment.utc().format(),updated_at:moment.utc().format(),responseto:event.responseto,level:event.level,parent:event.parent,author:client.user,serial:client.serial,rank:event.parent*1000000 + moment.utc().valueOf()/100000000000,readable:1},function(err,info){
				if(err) console.log(err);
				conn.where({chat_id:client.chat_id,responseto:event.responseto}).order_by('messages.id asc').get('messages',function(err,rows){
					if(err)console.log(err);
					io.sockets.in(client.room + '_response_' + event.responseto).emit('openResponses',rows);
				});
				var insert_id = info.insertId;
				conn.where({id:event.responseto}).get('messages',function(err,rows){
					if(err)console.log(err);
					conn.where({id:event.responseto}).update('messages',{responses:rows[0].responses + 1},function(err,info){
						if(err)console.log(err);
						io.sockets.in(client.room).emit('updateResponseCount',{count:rows[0].responses + 1,id:event.responseto});
						if(rows[0].author != rows[0].serial){
							conn.where({id:rows[0].member_id}).get('users',function(err,rows){
								if(err)console.log(err);
								if(client.user != rows[0].name){
									io.sockets.in(client.room + '_member_' + rows[0].name).emit('alertUserToResponse',{mssg_id:event.responseto,resp_id:insert_id});
								}
							});
						}else{
							conn.where({id:rows[0].member_id}).get('serials',function(err,rows){
								if(err)console.log(err);
								if(client.user != rows[0].serial_id){
									io.sockets.in(client.room + '_member_' + rows[0].serial_id).emit('alertUserToResponse',{mssg_id:event.responseto,resp_id:insert_id});
								}
							});
						}
					});
				});
				conn.where({serial_id:client.serial}).update('serials',{updated_at:moment.utc().format()},function(err,info){
					if(err) console.log(err);
				});
			});
		}
	});

	client.on('delete_message',function(mssg_info){
		var replace = '<i>This message has been deleted</i>';
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
					conn.where({serial_id:client.user}).update('serials',{reserved:"0"},function(err,info){
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
