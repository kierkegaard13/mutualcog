var mysql = require('mysql-activerecord'),
    sanitize = require('validator').sanitize,
    check = require('validator').check,
    marked = require('marked'),
    conn = new mysql.Adapter({
	server: 'localhost',
	username: 'root',
	password: 'snareline1',
	database: 'test'
    }),
    moment = require('moment');

var clients = new Array();

var io = require('socket.io').listen(3000);
var prospect = io.on('connection', function(client) {

	client.on('room',function(room){
		client.room = 'chat_' + room;
		client.chat_id = sanitize(room).xss();
		client.join(client.room);
		var rooms_joined = io.sockets.manager.roomClients[client.id];
		client.rooms = new Array();
		for(var prop in rooms_joined){
			prop = prop.substr(1);
			client.rooms.push(prop);
		}
		conn.where({chat_id:client.chat_id,responseto:"-1"}).order_by('messages.id asc').get('messages',function(err,rows){
			if(err) console.log(err);
			client.emit('openChat',{rows:rows,clicked:"-1"});
		});
	});

	client.on('add_member',function(info){
		var members = new Array();
		client.user = sanitize(info.new_member).xss();
		client.join(client.room + '_member_' + client.user);
		clients.push(info.new_member);
		console.log(client.user + ' has connected');
		conn.where({id:client.chat_id}).get('chats',function(err,rows){
			if(err)console.log(err);
			client.admin = rows[0].admin;
			client.is_admin = 0;
			if(info.new_member == client.admin || info.serial == client.admin){
				client.is_admin = 1;
			}
			if(info.logged_in == 1){
				client.serial = sanitize(info.serial).xss();
				conn.where({name:client.user}).get('users',function(err,rows){
					if(err)console.log(err);
					client.memb_id = rows[0].id;
					conn.where({member_id:client.memb_id,chat_id:client.chat_id}).get('members_to_chats',function(err,rows){
						if(err)console.log(err);
						if(rows.length == 0){
							conn.insert('members_to_chats',{member_id:client.memb_id,chat_id:client.chat_id,is_mod:"0",is_admin:client.is_admin,user:client.user},function(err,info){
								if(err)console.log(err);
								conn.where({chat_id:client.chat_id}).get('members_to_chats',function(err,rows){
									if(err)console.log(err);
									io.sockets.in(client.room).emit('displayMembers',rows);
								});
							});
						}else{
							conn.where({chat_id:client.chat_id}).get('members_to_chats',function(err,rows){
								if(err)console.log(err);
								io.sockets.in(client.room).emit('displayMembers',rows);
							});
						}
					});
				});
			}else{
				client.serial = sanitize(client.user).xss();
				conn.where({serial_id:client.user}).get('serials',function(err,rows){
					if(err)console.log(err);
					client.memb_id = rows[0].id;
					conn.where({member_id:client.memb_id,chat_id:client.chat_id}).get('members_to_chats',function(err,rows){
						if(err)console.log(err);
						if(rows.length == 0){
							conn.insert('members_to_chats',{member_id:client.memb_id,chat_id:client.chat_id,is_mod:"0",is_admin:client.is_admin,user:client.user},function(err,info){
								if(err)console.log(err);
								conn.where({chat_id:client.chat_id}).get('members_to_chats',function(err,rows){
									if(err)console.log(err);
									io.sockets.in(client.room).emit('displayMembers',rows);
								});
							});
						}else{
							conn.where({chat_id:client.chat_id}).get('members_to_chats',function(err,rows){
								if(err)console.log(err);
								io.sockets.in(client.room).emit('displayMembers',rows);
							});
						}
					});
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

	// Success!  Now listen to messages to be received
	client.on('message_sent',function(event){ 
		var url_reg = /(\s)(https?:\/\/)?([\da-z-]+)\.([a-z]{2,6})([\/\w\.-]*)*\/?/g;
		var url_reg2 = /^(https?:\/\/)?([\da-z-]+)\.([a-z]{2,6})([\/\w\.-]*)*\/?/g;
		var url_reg3 = /(img)(\s)(src\=)/g;
		event.message = marked(event.message);
		event.message = event.message.slice(3,event.message.length - 5);
		event.message = sanitize(event.message).xss();
		if(event.message){
			event.message = event.message.replace(url_reg,"$1<a class='chat_link' href='\/\/$3\.$4$5'>$3\.$4$5</a>");
			event.message = event.message.replace(url_reg2,"<a class='chat_link' href='\/\/$2\.$3$4'>$2\.$3$4</a>");
			event.message = event.message.replace(url_reg3,"$1$2style='max-width:300px;max-height:200px;margin-bottom:5px;' $3");
		}
		conn.insert('messages',{message:event.message,chat_id:client.chat_id,member_id:client.memb_id,inception:moment.utc().format(),responseto:"-1",author:client.user,serial:client.serial},function(err,info){
			if(err) console.log(err);
			conn.where({chat_id:client.chat_id,responseto:"-1"}).order_by('messages.id asc').get('messages',function(err,rows){
				if(err)console.log(err);
				io.sockets.in(client.room).emit('openChat',{rows:rows,clicked:"-1"});
			});
			conn.where({serial_id:client.serial}).update('serials',{inception:moment.utc().format()},function(err,info){
				if(err) console.log(err);
			});
		});
	});

	client.on('response_sent',function(event){ 
		var url_reg = /(\s)(https?:\/\/)?([\da-z-]+)\.([a-z]{2,6})([\/\w\.-]*)*\/?/g;
		var url_reg2 = /^(https?:\/\/)?([\da-z-]+)\.([a-z]{2,6})([\/\w\.-]*)*\/?/g;
		var url_reg3 = /(img)(\s)(src\=)/g;
		event.message = marked(event.message);
		event.message = event.message.slice(3,event.message.length - 5);
		event.message = sanitize(event.message).xss();
		if(event.message){
			event.message = event.message.replace(url_reg,"$1<a class='chat_link' href='\/\/$3\.$4$5'>$3\.$4$5</a>");
			event.message = event.message.replace(url_reg2,"<a class='chat_link' href='\/\/$2\.$3$4'>$2\.$3$4</a>");
			event.message = event.message.replace(url_reg3,"$1$2style='max-width:300px;max-height:200px;margin-bottom:5px;' $3");
		}
		conn.insert('messages',{message:event.message,chat_id:client.chat_id,member_id:client.memb_id,inception:moment.utc().format(),responseto:event.responseto,level:event.level,parent:event.parent,author:client.user,serial:client.serial},function(err,info){
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
			conn.where({serial_id:client.serial}).update('serials',{inception:moment.utc().format()},function(err,info){
				if(err) console.log(err);
			});
		});
	});

	client.on('delete_message',function(mssg_info){
		var replace = '<i>This message has been deleted</i>';
		if(client.is_admin || mssg_info.member_id == client.memb_id){
			conn.where({id:mssg_info.id}).update('messages',{message:replace},function(err){
				if(err)console.log(err);
				io.sockets.in(client.room).emit('softDelete',{id:mssg_info.id,user:mssg_info.user,responses:mssg_info.responses});
			});
		}
	});

	client.on('disconnect',function(){
		clients.splice(clients.indexOf(client.user),1);
		if(clients.indexOf(client.user) == -1){
			conn.where({member_id:client.memb_id,chat_id:client.chat_id}).delete('members_to_chats',function(err,info){
				if(err)console.log(err);
				conn.where({chat_id:client.chat_id}).get('members_to_chats',function(err,rows){
					if(err)console.log(err);
					conn.where({serial_id:client.user}).update('serials',{reserved:"0"},function(err,info){
						if(err) console.log(err);
					});
					io.sockets.in(client.room).emit('displayMembers',rows);
				});
				console.log(client.user + ' has been deleted');
			});
		}
		console.log(client.user + ' has disconnected');
	});
});
