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

function sanitize(text) {
	return text.replace(/&/g, '&amp;').
		replace(/</g, '&lt;').  // it's not neccessary to escape >
		replace(/"/g, '&quot;').
		replace(/'/g, '&#039;');
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

io.on('connection', function(client) {

	client.authorized = 0;

	client.on('authorize',function(info,fn){
		client.sid = info.sid;
		conn.where({sid:info.sid,serial:info.serial,authorized:1}).get('node_auth',function(err,rows){
			if(err)console.log(err);
			if(rows.length > 0){
				client.authorized = 1;
				client.user = rows[0].user;
				client.user_id = rows[0].user_id;
				client.memb_id = rows[0].user_id;
				client.serial = rows[0].serial;
				client.serial_id = rows[0].serial_id;
				client.join('user_' + client.user_id);
				console.log(client.user + ' has connected');
			}else{
				client.authorized = 0;
			}
			if(info.room){
				client.room = 'chat_' + sanitize(info.room);  //sanitize
				client.chat_id = sanitize(info.room);  //sanitize
				client.join(client.room);
				conn.where({id:client.chat_id}).get('chats',function(err,rows){
					if(err)console.log(err);
					client.emit('check_live',rows[0].live);
					fn();
				});
			}
		});
	});

	client.on('add_user',function(info){
		var users = new Array();
		if(!client.authorized){
			client.user = sanitize(info.new_user);  //sanitize
			console.log(client.user + ' has connected');
		}
		client.join(client.room + '_user_' + client.user);
		conn.where({id:client.chat_id}).get('chats',function(err,rows){
			if(err)console.log(err);
			client.admin = rows[0].admin;
			if(!client.authorized){
				client.serial = client.user;
				client.serial_id = sanitize(info.serial_id);  //sanitize
				client.memb_id = client.serial_id;
			}
			conn.where({chat_id:client.chat_id,user:client.user}).update('users_to_chats',{active:1},function(err,info){
				if(err)console.log(err);
			});
			conn.where({user_id:client.memb_id,chat_id:client.chat_id,user:client.user}).get('users_to_chats',function(err,rows){
				if(err)console.log(err);
				if(rows.length > 0){
					client.is_mod = rows[0].is_mod;
					client.is_admin = rows[0].is_admin;
					client.banned = rows[0].banned;
				}else{
					client.is_mod = 0;
					client.is_admin = 0;
					client.banned = 0;
				}
			});
		});
	});

	client.on('leave_room',function(room){
		client.leave(room);
	});

	client.on('join_pm',function(pm_info,fn){
		if(client.authorized){
			conn.where({id:pm_info.friend_id}).get('users',function(err,rows){
				if(rows[0].disconnecting){
					conn.where({id:pm_info.friend_id}).update('users',{online:0,disconnecting:0},function(err,info){
						if(err)console.log(err);
					});
				}
			});
			if(pm_info.pm_id != 0){
				conn.where({user_id:client.user_id,entity_id:pm_info.friend_id,entity_type:0}).update('users_to_private_chats',{visible:1},function(err,info){
					if(err)console.log(err);
					conn.where({id:pm_info.pm_id}).get('private_chats',function(err,rows){
						if(err)console.log(err);
						fn({pm_id:pm_info.pm_id,friend_name:pm_info.friend_name,friend_id:pm_info.friend_id});
					});
				});
			}else{
				conn.insert('private_chats',{created_at:moment.utc().format(),updated_at:moment.utc().format()},function(err,info){
					if(err)console.log(err);
					fn({pm_id:info.insertId,friend_name:pm_info.friend_name,friend_id:pm_info.friend_id});
					conn.insert('users_to_private_chats',{chat_id:info.insertId,user_id:client.user_id,entity_id:pm_info.friend_id},function(err,info){
						if(err)console.log(err);
					});
					conn.insert('users_to_private_chats',{chat_id:info.insertId,user_id:pm_info.friend_id,entity_id:client.user_id,visible:0},function(err,info){
						if(err)console.log(err);
					});
				});
			}
		}
	});

	client.on('leave_pm',function(pm_info){
		if(client.authorized){
			conn.where({user_id:client.user_id,entity_id:pm_info.friend_id,chat_id:pm_info.pm_id,entity_type:0}).update('users_to_private_chats',{visible:0},function(err,rows){
				if(err)console.log(err);
			});	
		}
	});

	client.on('minimize_pm',function(pm_info){
		if(client.authorized){
			conn.where({user_id:client.user_id,entity_id:pm_info.friend_id,chat_id:pm_info.pm_id,entity_type:0}).update('users_to_private_chats',{visible:2},function(err,rows){
				if(err)console.log(err);
			});	
		}
	});

	client.on('maximize_pm',function(pm_info){
		if(client.authorized){
			conn.where({user_id:client.user_id,entity_id:pm_info.friend_id,chat_id:pm_info.pm_id,entity_type:0}).update('users_to_private_chats',{visible:1},function(err,rows){
				if(err)console.log(err);
			});	
		}
	});

	client.on('send_pm',function(pm_info,fn){
		console.log(pm_info);
		if(client.authorized && pm_info.message.length < 10000){
			var mssg_id = 0;
			/* Figure out if recipient has disconnected */
			conn.where({id:pm_info.friend_id}).get('users',function(err,rows){
				if(rows[0].disconnecting){
					conn.where({id:pm_info.friend_id}).update('users',{online:0,disconnecting:0},function(err,info){
						if(err)console.log(err);
					});
				}
			});
			conn.where({user_id:client.user_id,entity_id:pm_info.friend_id,type:0}).get('interaction_users',function(err,rows){
				if(err)console.log(err);
				//TODO: Need to come up with bond function
				if(rows.length > 0){
					var new_bond = rows[0].bond;
					if(new_bond < 1.05){
						new_bond = new_bond + .01;
					}
					conn.where({user_id:client.user_id,entity_id:pm_info.friend_id,type:0}).update('interaction_users',{bond:new_bond,updated_at:moment.utc().format()},function(err,rows){
						if(err)console.log(err);
					});
				}
			});
			/* Find out if recipient has chat maximized, minimized, or closed */
			conn.where({user_id:pm_info.friend_id,entity_id:client.user_id,entity_type:0}).get('users_to_private_chats',function(err,rows){
				if(err)console.log(err);
				var visibility = rows[0].visible;
				conn.where({id:pm_info.friend_id}).get('users',function(err,rows){
					if(err)console.log(err);
					var friend_online = rows[0].online;
					conn.insert('private_messages',{message:pm_info.message,author:client.user,author_id:client.user_id,chat_id:pm_info.pm_id,created_at:moment.utc().format(),updated_at:moment.utc().format()},function(err,info){
						if(err)console.log(err);
						mssg_id = info.insertId;
						/* Check whether recipient is online */
						if(friend_online){
							io.in('user_' + pm_info.friend_id).emit('receive_pm',{message:pm_info.message,pm_id:pm_info.pm_id,user_id:pm_info.friend_id,friend_id:pm_info.user_id,friend_name:client.user,state:visibility,time:moment.utc().format(),mssg_id:mssg_id});
							fn({message:pm_info.message,unseen:0,pm_id:pm_info.pm_id,friend_id:pm_info.friend_id,tmp_mssg_cnt:pm_info.tmp_mssg_cnt});
						}else{
							io.in('user_' + pm_info.friend_id).emit('receive_pm',{message:pm_info.message,pm_id:pm_info.pm_id,user_id:pm_info.friend_id,friend_id:pm_info.user_id,friend_name:client.user,state:visibility,time:moment.utc().format(),mssg_id:mssg_id});
							fn({message:pm_info.message,unseen:1,pm_id:pm_info.pm_id,friend_id:pm_info.friend_id,tmp_mssg_cnt:pm_info.tmp_mssg_cnt});
							/* You need to set unseen for the recipient for when they come back online and need to emit chats seen */
							conn.where({user_id:client.user_id,entity_id:pm_info.friend_id,entity_type:0}).update('users_to_private_chats',{unseen:1,visible:1},function(err,rows){
								if(err)console.log(err);
							});
							conn.where({id:pm_info.pm_id}).update('private_chats',{seen:0},function(err,info){
								if(err)console.log(err);
							});
						}
					});
				});
			});
		}
	});

	client.on('seen_chats',function(){
		if(client.authorized){
			conn.where({entity_id:client.user_id,unseen:1}).get('users_to_private_chats',function(err,rows){
				if(err)console.log(err);
				for(var i = 0; i < rows.length; i++){
					io.in('user_' + rows[i].user_id).emit('chat_seen',{pm_id:rows[i].chat_id,friend_id:client.user_id});
					conn.where({id:rows[i].chat_id}).update('private_chats',{seen:1},function(err,info){
						if(err)console.log(err);
					});
				}
				conn.where({entity_id:client.user_id,unseen:1}).update('users_to_private_chats',{unseen:0},function(err,info){
					if(err)console.log(err);
				});
			});
			conn.where({id:client.user_id}).update('users',{online:1},function(err,info){
				if(err)console.log(err);
			})
		}
	});

	client.on('is_typing',function(info){
		io.in('user_' + info.friend_id).emit('is_typing',{pm_id:info.pm_id,friend_id:info.user_id});
	});

	client.on('not_typing',function(info){
		io.in('user_' + info.friend_id).emit('not_typing',{pm_id:info.pm_id,friend_id:info.user_id});
	});

	client.on('change_stealth',function(info){
		if(client.authorized){
			conn.where({id:client.user_id}).update('users',{stealth:info.stealth},function(err,info){
				if(err)console.log(err);
			});
		}
	});

	client.on('request_answered',function(info){
		if(client.authorized){
			var request_info = info;
			var type = 0;
			if(info.type == 'friendship'){
				type = 2;
			}
			conn.insert('notifications',{type:type,user_id:info.user_id,sender:client.user,sender_id:client.user_id,created_at:moment.utc().format(),updated_at:moment.utc().format()},function(err,info){
				if(err)console.log(err);
				var message = "<div class='request_cont'><div class='request_text'><a class='chat_link' href='//mutualcog.com/u/" + client.user_id + "'>" + client.user + "</a> has ";
				var request_id = info.insertId;
				if(request_info.accepted){
					message += "accepted your ";
				}else{
					message += "declined your ";
				}
				if(request_info.type == 'friendship'){
						message += "friend request</div><div class='request_text'><a class='chat_link' href='//mutualcog.com/profile/dismiss/" + info.insertId + "'>Dismiss</a></div></div>";
				}else if(request_info.type == 'mod'){
						message += "mod request</div><div class='request_text'><a class='chat_link' href='//mutualcog.com/profile/dismiss/" + info.insertId + "'>Dismiss</a></div></div>";
				}else{
						message += "admin request</div><div class='request_text'><a class='chat_link' href='//mutualcog.com/profile/dismiss/" + info.insertId + "'>Dismiss</a></div></div>";
				}
				conn.where({id:info.insertId}).update('notifications',{message:message},function(err,info){
					if(err)console.log(err);
					if(type == 2){
						io.in('user_' + request_info.user_id).emit('displayFriendRequests',{id:request_id,sender:client.user,sender_id:client.user_id,message:message});
					}else{
						io.in('user_' + request_info.user_id).emit('displayGlobalRequests',{id:request_id,sender:client.user,sender_id:client.user_id,message:message,type:request_info.type});
					}
				});
			});
		}
	});

	client.on('request_friend',function(info){  //type: 2 is friend, 1 is mssg, 0 is global
		if(client.authorized){
			var request_info = info;
			conn.insert('notifications',{type:2,user_id:info.user_id,sender_id:client.user_id,sender:client.user,created_at:moment.utc().format(),updated_at:moment.utc().format()},function(err,info){
				if(err)console.log(err);
				var request_id = info.insertId;
				var message = "<div class='request_cont'> <div class='request_text'> <a class='chat_link' href='//mutualcog.com/u/" + client.user + "'>" + client.user + "</a> has requested your friendship </div> <div class='request_text'> <a class='chat_link accept_request' id='accept_friendship_" + client.user_id + "' href='//mutualcog.com/profile/accept/" + request_id + "'>Accept</a> / <a class='chat_link decline_request' id='decline_friendship_" + client.user_id + "' href='//mutualcog.com/profile/decline/" + request_id + "'>Decline</a> </div> </div>";
				conn.where({id:info.insertId}).update('notifications',{message:message},function(err,info){
					if(err)console.log(err);
					io.in('user_' + request_info.user_id).emit('displayFriendRequests',{id:request_id,sender:client.user,sender_id:client.user_id,message:message});
				});
			});
		}
	});

	client.on('request_mod',function(info,fn){
		if(client.authorized){
			var request_info = info;
			conn.where({community_id:info.community_id,is_mod:1}).get('users_to_communities',function(err,rows){  //check for mod limit
				if(err)console.log(err);
				if(rows.length <= 20){  //mod count must be max of 20
					conn.where({user_id:client.user_id,community_id:request_info.community_id}).get('users_to_communities',function(err,rows){  //check if sender is admin
						if(err)console.log(err);
						if(rows[0].is_admin){
							conn.where({type:0,global_type:'mod',user_id:info.user_id,sender_id:client.user_id}).get('notifications',function(err,rows){  
								if(err)console.log(err);
								if(rows.length == 0){  //check if request already exists
									conn.insert('notifications',{type:0,global_type:'mod',user_id:info.user_id,sender_id:client.user_id,sender:client.user,created_at:moment.utc().format(),updated_at:moment.utc().format()},function(err,info){
										if(err)console.log(err);
										var message = "<div class='request_cont'> <div class='request_text'> <a class='chat_link' href='//mutualcog.com/u/" + client.user + "'>" + client.user + "</a> has requested you as a mod for <a class='chat_link' href='//mutualcog.com/c/" + request_info.community_name + "'>/c/"  + request_info.community_name + "</a> </div> <div class='request_text'> <a class='chat_link accept_request' id='accept_mod_" + client.user_id + "' href='//mutualcog.com/communities/accept-mod/" + info.insertId + "/" + request_info.community_id + "'>Accept</a> / <a class='chat_link decline_request' id='decline_mod_" + client.user_id + "' href='//mutualcog.com/communities/decline-mod/" + info.insertId + "/" + request_info.community_id + "'>Decline</a> </div> </div>";
										var request_id = info.insertId;
										conn.where({id:request_id}).update('notifications',{message:message},function(err,info){
											if(err)console.log(err);
											io.in('user_' + request_info.user_id).emit('displayGlobalRequests',{id:request_id,sender:client.user,sender_id:client.user_id,message:message,type:'mod'});
											fn(1);
										});
									});
								}else{
									fn(1)
								}
							});
						}
					});
				}else{
					fn(0);
				}
			});
		}
	});

	client.on('request_admin',function(info,fn){
		if(client.authorized){
			var request_info = info;
			conn.where({community_id:info.community_id,is_mod:1}).get('users_to_communities',function(err,rows){  //check for mod limit
				if(err)console.log(err);
				if(rows.length <= 20){  //mod count must be max of 20
					conn.where({user_id:client.user_id,community_id:request_info.community_id}).get('users_to_communities',function(err,rows){  //check if sender is admin
						if(err)console.log(err);
						if(rows[0].is_admin){
							conn.where({type:0,global_type:'admin',user_id:info.user_id,sender_id:client.user_id}).get('notifications',function(err,rows){  
								if(err)console.log(err);
								if(rows.length == 0){  //check if request already exists
									conn.insert('notifications',{type:0,global_type:'admin',user_id:info.user_id,sender_id:client.user_id,sender:client.user,created_at:moment.utc().format(),updated_at:moment.utc().format()},function(err,info){
										if(err)console.log(err);
										var message = "<div class='request_cont'> <div class='request_text'> <a class='chat_link' href='//mutualcog.com/u/" + client.user + "'>" + client.user + "</a> has requested you as an admin for <a class='chat_link' href='//mutualcog.com/c/" + request_info.community_name + "'>/c/"  + request_info.community_name + "</a> </div> <div class='request_text'> <a class='chat_link accept_request' id='accept_admin_" + client.user_id + "' href='//mutualcog.com/communities/accept-admin/" + info.insertId + "/" + request_info.community_id + "'>Accept</a> / <a class='chat_link decline_request' id='decline_admin_" + client.user_id + "' href='//mutualcog.com/communities/decline-admin/" + info.insertId + "/" + request_info.community_id + "'>Decline</a> </div> </div>";
										var request_id = info.insertId;
										conn.where({id:request_id}).update('notifications',{message:message},function(err,info){
											if(err)console.log(err);
											io.in('user_' + request_info.user_id).emit('displayGlobalRequests',{id:request_id,sender:client.user,sender_id:client.user_id,message:message,type:'admin'});
											fn(1);
										});
									});
								}else{
									fn(1)
								}
							});
						}
					});
				}else{
					fn(0);
				}
			});
		}
	});

	client.on('pause_all',function(){
		if(client.is_admin){
			conn.where({id:client.chat_id}).update('chats',{live:0},function(err,info){
				if(err)console.log(err);
				io.in(client.room).emit('pause');
			});
			conn.where({chat_id:client.chat_id}).update('users_to_chats',{live:0},function(err,info){
				if(err)console.log(err);
			});
		}
	});

	client.on('play_all',function(){
		if(client.is_admin){
			conn.where({id:client.chat_id}).update('chats',{live:1},function(err,info){
				if(err)console.log(err);
				io.in(client.room).emit('play');
			});
			conn.where({chat_id:client.chat_id}).update('users_to_chats',{live:1},function(err,info){
				if(err)console.log(err);
			});
		}
	});

	client.on('mod_user',function(info,fn){  //is mod isn't actually set here
		var name = info.name;
		var user_id = info.id;
		var is_mod = info.is_mod;
		var chat_id = info.chat_id;
		if(is_mod == '1'){
			var insert_mod = 0;
		}else{
			var insert_mod = 1;
		}
		if(client.is_admin){
			conn.where({user_id:user_id,chat_id:chat_id}).update('users_to_chats',{is_mod:insert_mod},function(err,info){
				if(err)console.log(err);
				console.log(info);
				io.in(client.room + '_user_' + name).emit('add_mod_funcs');
				fn({user_id:user_id,is_mod:is_mod});
			});
		}
	});

	client.on('warn',function(info){
		if(client.is_admin || client.is_mod){
			io.in(client.room + '_user_' + info.user).emit('warn');
			client.emit('warn_confirm',info.user);
		}
	});

	client.on('kick',function(info){ //banned array applies to all chats
		var user = info.user;
		if(client.is_admin || client.is_mod){
			conn.where({chat_id:client.chat_id,user:user}).update('users_to_chats',{banned:1},function(err,info){
				if(err)console.log(err);
				io.in(client.room + '_user_' + user).emit('kick');
				client.emit('kick_confirm',user);
			});
		}
	});

	client.on('update_votes',function(info){
		io.in(client.room).emit('updateVotes',{message_id:info.id,response:info.response});
	});

	// Success!  Now listen to messages to be received
	client.on('message_sent',function(mssg_info,fn){ 
		conn.where({chat_id:client.chat_id,user:client.user}).get('users_to_chats',function(err,rows){
			if(err)console.log(err);
			if(rows.length > 0){
				if(rows[0].live && !rows[0].banned && mssg_info.message.replace(/^\s+|\s+$/g,'') != '' && mssg_info.message.length < 2500){
					conn.insert('messages',{message:mssg_info.message,chat_id:client.chat_id,user_id:client.memb_id,created_at:moment.utc().format(),updated_at:moment.utc().format(),responseto:mssg_info.responseto,y_dim:mssg_info.y_dim,parent:mssg_info.parent,author:client.user,serial:client.serial},function(err,info){
						if(err) console.log(err);
						var insert_id = info.insertId;
						io.in(client.room).emit('publishMessage',{id:insert_id,message:mssg_info.message,chat_id:client.chat_id,user_id:client.memb_id,created_at:moment.utc().format(),responseto:mssg_info.responseto,author:client.user,serial:client.serial,y_dim:mssg_info.y_dim,parent:mssg_info.parent,tmp_mssg_cnt:mssg_info.tmp_mssg_cnt});
						fn();
						if(mssg_info.responseto == 0){
							conn.where({id:insert_id}).update('messages',{path:"0" + "." + repeatString("0", 8 - insert_id.toString().length) + insert_id,readable:1},function(err,info){
								if(err)console.log(err);
							});
						}else{  //if it is a response
							conn.where({id:mssg_info.responseto}).get('messages',function(err,rows){  //update response count, message path, and he_level and alert user to response
								if(err)console.log(err);
								if(rows[0].author.match(/\D/g)){
									conn.where({id:rows[0].user_id}).get('users',function(err,rows){
										if(err)console.log(err);
										if(rows[0].chat_id != client.chat_id){
											conn.insert('notifications',{type:0,user_id:rows[0].id,sender_id:client.user_id,sender:client.user,global_type:'response',created_at:moment.utc().format(),updated_at:moment.utc().format()},function(err,info){
												if(err)console.log(err);
												if(client.authorized){
													var message = "<div class='request_cont request_link' data-request-link='//mutualcog.com/chat/static/" + client.chat_id + "/" + mssg_info.responseto + "' data-request-id='" + info.insertId + "'><div class='request_text'><a class='chat_link' href='//mutualcog.com/u/" + client.user + "'>" + client.user + "</a> has responded to your message</div></div>";
												}else{
													var message = "<div class='request_cont request_link' data-request-link='//mutualcog.com/chat/static/" + client.chat_id + "/" + mssg_info.responseto + "' data-request-id='" + info.insertId + "'><div class='request_text'>" + client.user + " has responded to your message</div></div>";
												}
												io.in('user_' + rows[0].id).emit('displayGlobalRequests',{id:info.insertId,sender:client.user,sender_id:client.user_id,message:message,type:'response'});
												conn.where({id:info.insertId}).update('notifications',{message:message},function(err,info){
													if(err)console.log(err);
												});
											});
										}
									});
								}
								conn.where({id:insert_id}).update('messages',{path:rows[0].path + "." + repeatString("0", 8 - insert_id.toString().length) + insert_id,res_num:rows[0].responses + 1,readable:1},function(err,info){
									if(err)console.log(err);
								});
								conn.where({id:mssg_info.responseto}).update('messages',{responses:rows[0].responses + 1},function(err,info){
									if(err)console.log(err);
									if(rows[0].author != client.serial || rows[0].author != client.user){
										io.in(client.room + '_user_' + rows[0].author).emit('alertUserToResponse',{mssg_id:mssg_info.responseto,resp_id:insert_id,parent:mssg_info.parent});
									}
								});
							});
						}
						if(client.authorized){
							conn.insert('messages_voted',{message_id:insert_id,user_id:client.memb_id,status:1,updated_at:moment.utc().format(),created_at:moment.utc().format()},function(err,info){
								if(err)console.log(err);
							});
						}
						conn.where({serial_id:client.serial}).update('serials',{updated_at:moment.utc().format()},function(err,info){
							if(err) console.log(err);
						});
					});
				}
			}
		});
	});

	client.on('notify_response',function(mssg_id){
		conn.where({id:mssg_id}).get('messages',function(err,rows){
			if(err)console.log(err);
			var user = rows[0].author;
			var user_id = rows[0].user_id;
			if(user.match(/\D/g)){
				conn.insert('notifications',{type:0,user_id:user_id,sender_id:client.user_id,sender:client.user,global_type:'response',created_at:moment.utc().format(),updated_at:moment.utc().format()},function(err,info){
					if(err)console.log(err);
					if(client.authorized){
						var message = "<div class='request_cont request_link' data-request-link='//mutualcog.com/chat/static/" + client.chat_id + "/" + mssg_id + "' data-request-id='" + info.insertId + "'><div class='request_text'><a class='chat_link' href='//mutualcog.com/u/" + client.user + "'>" + client.user + "</a> has responded to your message</div></div>";
					}else{
						var message = "<div class='request_cont request_link' data-request-link='//mutualcog.com/chat/static/" + client.chat_id + "/" + mssg_id + "' data-request-id='" + info.insertId + "'><div class='request_text'>" + client.user + " has responded to your message</div></div>";
					}
					io.in('user_' + user_id).emit('displayGlobalRequests',{id:info.insertId,sender:client.user,sender_id:client.user_id,message:message,type:'response'});
					conn.where({id:info.insertId}).update('notifications',{message:message},function(err,info){
						if(err)console.log(err);
					});
				});
			}
		});
	});

	client.on('delete_message',function(mssg_info){
		var replace = '<em>This message has been deleted</em>';
		conn.where({id:mssg_info.id}).get('messages',function(err,rows){
			if(err)console.log(err);
			var message = rows[0];
			if(rows[0].user_id == client.memb_id){
				conn.where({id:mssg_info.id}).update('messages',{message:replace},function(err,info){
					if(err)console.log(err);
					io.in(client.room).emit('softDelete',{id:mssg_info.id,user:mssg_info.user,mssg_serial:message.serial,serial:mssg_info.serial,responses:mssg_info.responses});
				});
			}
		});
	});

	client.on('disconnect',function(){
		conn.where({chat_id:client.chat_id,user:client.user}).update('users_to_chats',{active:0},function(err,info){
			if(err)console.log(err);
		});
		conn.where({id:client.user_id}).update('users',{disconnecting:1,disconnect_time:moment.utc().format()},function(err,info){
			if(err)console.log(err);
		});
		console.log(client.user + ' has disconnected');
	});
});
