$(window).on('click',function(e){
	$('#community_dropdown').hide();
	$('#users_box').hide('blind');
	$('#show_users').removeClass('highlighted_dark');
});

$(document).ready(function(){
	$('.chat_main').mCustomScrollbar({theme:'minimal',scrollInertia:100,callbacks:{onScroll:function(){
		module.scroll_top = this.mcs.draggerTop;
		var scrollBottom = this.mcs.draggerTop + $('.chat_main').find('.mCSB_dragger').height();
		if(scrollBottom == $('.chat_main').height() - 4){
			module.stop_scroll = 0;
			module.scroll_mod_active = 1;
			$('#stop_scroll').removeClass('highlight_red');	
			$('#stop_scroll').attr('data-original-title','Stop scrollbar');
		}else if(scroll_mod_active){
			module.stop_scroll = 1;
			module.chat_scroll_timer = 10;
			if($('#stop_scroll').hasClass('highlight_red')){
			}else{
				$('#stop_scroll').addClass('highlight_red');
				$('#stop_scroll').attr('data-original-title','Resume scrolling');
			}	
		}
	}}});	
	window.setInterval(function(){
		if(module.chat_scroll_timer == 0){
			if(module.scroll_button_clicked == 0 && module.stop_scroll){
				$('#stop_scroll').removeClass('highlight_red');	
				$('#stop_scroll').attr('data-original-title','Stop scrollbar');
				module.stop_scroll = 0;
			}
		}else{
			module.chat_scroll_timer--;
		}
	},1000);
	$('.mssg_cont').show();
	$('#chat_messages').click(function(){
		if(module.scroll_mod_active == 0){
			if(module.stop_scroll == 1){
				$('#stop_scroll').removeClass('highlight_red');	
				$('#stop_scroll').attr('data-original-title','Stop scrollbar');
			}
			module.scroll_mod_active = 1;
			module.scroll_button_clicked = 0;
			module.stop_scroll = 0;
		}
		$('#message').attr('class','global');
		$('.chat_mssg').removeClass('bright_blue_background');;
		$('.chat_mssg').find('.reply_link').find('strong').text('Reply');
		var permalink = $('#permalink').attr('data-page-link');
		if(permalink.split('/').length - 1 == 5){
		}else{
			permalink = permalink.substring(0,permalink.lastIndexOf('/'));
			$('#permalink').attr('data-page-link',permalink);
		}
		module.clicked_on = -1;
		if($('#message').text() != ""){
			$('#message').text("Press enter to send a message to all");
		}else{
			$('#message').val("Press enter to send a message to all");
			$('#message').on('click',function(){
				$(this).val("");
				$(this).off('click');
			});
		}
	});
	$('a#continue_description').click(function(e){
		$('#continue_modal').modal();
		return false;
	});
	$('button#save_details').click(function(){
		$('#description_modal').modal('hide');
		$.ajax({
			type:'POST',
			data: {details:$('#detail_text').val(),id:module.chat_id},
			url:'//mutualcog.com/chat/details',
			success:function(hresp){
				$('#curr_details').html(hresp);
				module.socket.emit('update_details',hresp);
			},
			error:function(){
			}
		});
	});
	var showing = 0;
	var hovering = 0;
	$('#permalink').tooltip();
	$('#show_users').tooltip();
	$('#stop_scroll').tooltip();
	$('#pause_chat').tooltip();
	$('#mod_user').tooltip();
	$('#warn_user').tooltip();
	$('#kick_user').tooltip();
	$('#permalink').click(function(e){
		window.location.href = $(this).attr('data-page-link'); 
	});
	$('#show_users').click(function(e){
		var chat_id = $(this).attr('data-chat-id');
		$.ajax({
			type:'GET',
			url:'//mutualcog.com/chat/chat-users',
			data:{chat_id:chat_id},
			success:function(hresp){
				var members = '';
				$.each(hresp,function(index,val){
					members += '<div class="chat_member light_divider_bottom">';
					if(val.pivot.active){
						members += '<a class="dark_link" href="//mutualcog.com/u/' + val.name + '">' + val.name + '</a>';
					}else{
						members += '<a class="grey_link" href="//mutualcog.com/u/' + val.name + '">' + val.name + '</a>';
					}
					if(val.id != module.user_id){
						members += '<button class="btn btn-primary pull-right" style="margin-top:-6px;" id="request_friend" data-user-id="' + val.id + '" data-user-name="' + val.name + '"><div class="glyphicon glyphicon-plus" id="request_glyph"> </div> Friend</button>';
					}
					if(val.id != module.user_id && (module.user_tracker == $('#chat_admin').attr('data-admin-name') || module.serial_tracker == $('#chat_admin').attr('data-admin-name'))){
						members += '<button class="btn btn-default pull-right" style="margin-top:-6px;margin-right:5px;" id="mod_user" data-user-id="' + val.id + '" data-user-name="' + val.name + '"><div class="glyphicon glyphicon-tower"> </div> Mod</button>';
					} 
					members += '</div>';
				});
				$('.chat_member_cont').html(members);
				$('#members_modal').modal();
			},
			error:function(){
				$('.chat_member_cont').html("Couldn't retrieve chat members");
				$('#members_modal').modal();
			}
		});
	});
	$('#pause_chat').click(function(){
		if($(this).hasClass('pause')){  /*if chat is not paused*/
			module.socket.emit('pause_all');
			$(this).removeClass('pause');
			$(this).removeClass('glyphicon-pause');
			$(this).addClass('glyphicon-play');	
			$(this).addClass('play');
			$(this).attr('data-original-title','Play chat');
		}else{  /*if chat is already paused*/
			module.socket.emit('play_all');
			$(this).removeClass('play');
			$(this).removeClass('glyphicon-play');	
			$(this).addClass('glyphicon-pause');
			$(this).addClass('pause');
			$(this).attr('data-original-title','Pause chat');
		}
	});
	$('#mod_user').click(function(){
		var user = $('#mssg_cont_' + module.clicked_on).find('.mssg_op').attr('data-author');
		if(user == module.user_tracker || module.clicked_on == -1){
			return false;
		}else{
			$.ajax({
				type:'GET',
				url:'//mutualcog.com/chat/check-mod',
				data:{user:user,chat_id:module.chat_id},
				success:function(hresp){
					if(hresp == 0){
						module.socket.emit('make_mod',{user:user,chat_id:module.chat_id});
					}else{
						module.socket.emit('remove_mod',{user:user,chat_id:module.chat_id});
					}
				},
				error:function(){
				}
			});
		}
	});
	$('#warn_user').click(function(){
		var user = $('#mssg_cont_' + module.clicked_on).find('.mssg_op').attr('data-author');
		if(user == module.user_tracker || module.clicked_on == -1){
			return false;
		}else{
			module.socket.emit('warn',{user:user});
		}
	});
	$('#kick_user').click(function(){
		var user = $('#mssg_cont_' + module.clicked_on).find('.mssg_op').attr('data-author');
		if(user == module.user_tracker || module.clicked_on == -1){
			return false;
		}else{
			module.socket.emit('kick',{user:user});
		}
	});
	$('#stop_scroll').click(function(){
		if($(this).hasClass('highlight_red')){
			module.stop_scroll = 0;
			module.scroll_button_clicked = 0;
			module.scroll_mod_active = 1;
			$(this).removeClass('highlight_red');	
			$(this).attr('data-original-title','Stop scrollbar');
		}else{
			module.stop_scroll = 1;
			module.scroll_button_clicked = 1;
			module.scroll_mod_active = 0;
			$(this).addClass('highlight_red');
			$(this).attr('data-original-title','Resume scrolling');
		}	
	});
});

setClicked = function(e){
	e.stopPropagation();
	module.clicked_on = $(this).attr('id').replace('message_','');
	var permalink = $('#permalink').attr('data-page-link');
	if(permalink.split('/').length - 1 == 5){
		$('#permalink').attr('data-page-link',permalink + '/' + module.clicked_on);
	}else{
		permalink = permalink.substring(0,permalink.lastIndexOf('/'));
		$('#permalink').attr('data-page-link',permalink + '/' + module.clicked_on);
	}
	$('.chat_mssg').removeClass('bright_blue_background');;
	$('.chat_mssg').find('.reply_link').find('strong').text('Reply');
	$(this).addClass('bright_blue_background');
	$(this).find('.reply_link').find('strong').text('Replying');
	$('#message').attr('class',$(this).attr('id').replace('message_',''));
	if(module.stop_scroll == 0){
		$('#stop_scroll').addClass('highlight_red');
		$('#stop_scroll').attr('data-original-title','Resume scrolling');
	}
	module.scroll_mod_active = 0;
	module.scroll_button_clicked = 1;
	module.stop_scroll = 1;
	if($('#message').text() != ""){
		$('#message').text("Press enter to respond to " + $(this).find('.mssg_op').attr('data-author') + "\'s message");
	}else{
		$('#message').val("Press enter to respond to " + $(this).find('.mssg_op').attr('data-author') + "\'s message");
		$('#message').on('click',function(){
			$(this).val("");
			$(this).off('click');
		});
	}
};

find_top_notifications = function(){
	var min = Math.min.apply(Math,module.notifications_top_positions);
	var min_id = module.notifications_top_ids[module.notifications_top_positions.indexOf(min)];
	module.notifications_top_ids.splice(module.notifications_top_positions.indexOf(min),1);
	module.notifications_top_positions.splice(module.notifications_top_positions.indexOf(min),1);
	$('.chat_main').mCustomScrollbar('scrollTo',min,{scrollInertia:0});	
	setTimeout(function(){
		$('#message_' + min_id).addClass('highlight_background','800');
	},100);
	setTimeout(function(){
		$('#message_' + min_id).removeClass('highlight_background','slow');
	},800);
	var text_top = parseInt($('#notify_text_top').text());
	if(text_top > 1){
		$('#notify_text_top').text(text_top - 1);
	}else{
		$('#notify_text_top').text(0);
		$('#notify_cont_top').hide('blind');
	}
}

find_bottom_notifications = function(){
	var min = Math.min.apply(Math,module.notifications_bottom_positions);
	var min_id = module.notifications_bottom_ids[module.notifications_bottom_positions.indexOf(min)];
	module.notifications_bottom_ids.splice(module.notifications_bottom_positions.indexOf(min),1);
	module.notifications_bottom_positions.splice(module.notifications_bottom_positions.indexOf(min),1);
	$('.chat_main').mCustomScrollbar('scrollTo',min);	
	setTimeout(function(){
		$('#message_' + min_id).addClass('highlight_background','800');
	},100);
	setTimeout(function(){
		$('#message_' + min_id).removeClass('highlight_background','slow');
	},800);
	var text_bottom = parseInt($('#notify_text_bottom').text());
	if(text_bottom > 1){
		$('#notify_text_bottom').text(text_bottom - 1);
	}else{
		$('#notify_text_bottom').text(0);
		$('#notify_cont_bottom').hide('blind');
	}
}

notifyMessage = function(){
	module.title_blinking = 1;
	setTimeout(function(){
		if(module.focused){
			$('title').html('Mutual Cognizance');
			module.title_blinking = 0;
		}else{
			if($('title').html() == 'Mutual Cognizance (1)'){
				$('title').html('New Message');
			}else{
				$('title').html('Mutual Cognizance (1)');
			}
			notifyMessage();
		}
	},800);
}

module.socket.on('connect',function() {
	console.log('Client has connected');
	module.connected = 1;
	module.socket.emit('room',module.chat_id);
	if($('.enter_hint').text() == 'You are disconnected'){
		$('.enter_hint').text("Press Shift+Enter for new line");
		$('.response_hint').text("Click on a message to respond to it");
		$('.pm_unseen').text("");
		$('.pm_unseen').hide();
	}
	if($('#logged_in').text() == 1){
		module.socket.emit('add_user',{new_user:module.user_tracker,serial_id:module.serial_id});
	}else{
		module.socket.emit('add_user',{new_user:module.serial_tracker,serial_id:module.serial_id});
	}
});

module.socket.on('alertUserToResponse',function(info){
	if($('#mssg_cont_' + info.mssg_id).parent().css('display') == 'none'){
		var resp_pos = $('#mssg_cont_' + info.parent).position().top;
	}else{
		var resp_pos = $('#mssg_cont_' + info.resp_id).position().top;
	}
	var scaling = $('#chat_display').height()/$('.chat_main').height();
	var result_top = resp_pos - (module.scroll_top * scaling) + 12;
	if(result_top > 0){}else{
		module.notifications_top_positions.push(resp_pos);
		module.notifications_top_ids.push(info.resp_id);
		var text_top = parseInt($('#notify_text_top').text());
		if(text_top == 9){}else{
			text_top += 1;
		}
		$('#notify_text_top').text(text_top);
		if($('#notify_cont_top').css('display') == 'none'){
			$('#notify_cont_top').show('blind');	
		}
	}
	var result_bottom = resp_pos - (module.scroll_top * scaling) - $('#chat_messages').height();
	if(result_bottom > 0){
		module.notifications_bottom_positions.push(resp_pos);
		module.notifications_bottom_ids.push(info.resp_id);
		var text_bottom = parseInt($('#notify_text_bottom').text());
		if(text_bottom == 9){}else{
			text_bottom += 1;
		}
		$('#notify_text_bottom').text(text_bottom);
		if($('#notify_cont_bottom').css('display') == 'none'){
			$('#notify_cont_bottom').show('blind');
		}
	}
});

module.socket.on('display_details',function(info){
	$('#curr_details').html(info);
});

module.socket.on('updateResponseCount',function(info){
	$('#' + info.id + '.response_count').animate({color:module.color_arr[info.serial % 7]},'slow');	
	$('#' + info.id + '.response_count').animate({color:'black'},'slow');	
	$('#' + info.id + '.response_count').text(info.count);
});

module.socket.on('add_mod_funcs',function(){
	$('#user_toolbox').append('<span class="glyphicon glyphicon-warning-sign mod_power" id="warn_user" data-toggle="tooltip" data-container="body" data-placement="top" data-original-title="Warn user"></span> <span class="glyphicon glyphicon-remove mod_power" id="kick_user" data-toggle="tooltip" data-container="body" data-placement="top" data-original-title="Kick user"></span> ');
	$('#warn_user').tooltip();
	$('#kick_user').tooltip();
});

module.socket.on('remove_mod_funcs',function(){
	$('.mod_power').remove();
});

module.socket.on('add_mod_confirm',function(user){
	$('#modified_ident').text(user);
	$('#modified_message').text('is now a mod');
	$('#action_confirmed').show('blind',function(){	
		window.setTimeout(function(){
			$('#action_confirmed').hide('blind');
		},1500);
	});
});

module.socket.on('remove_mod_confirm',function(user){
	$('#modified_ident').text(user);
	$('#modified_message').text('is no longer a mod');
	$('#action_confirmed').show('blind',function(){	
		window.setTimeout(function(){
			$('#action_confirmed').hide('blind');
		},1500);
	});
});

module.socket.on('pause',function(){
	module.live = 0;	
	$('.chat_paused').remove();
	$('#main').append('<div class="chat_paused" id="paused_message">Chat has been paused</div>');
	$('#paused_message').show('fade','slow');
});

module.socket.on('play',function(){
	module.live = 1;
	$('#paused_message').hide('fade','slow',function(){
		$('#paused_message').remove();
	});
});

module.socket.on('warn',function(){
	$('.chat_paused').remove();
	$('#main').append('<div class="chat_paused" id="warned_user">You have been warned</div>');
	$('#warned_user').show('fade','slow',function(){
		window.setTimeout(function(){
			$('#warned_user').hide('fade','slow');	
		},1500);	
	});
});

module.socket.on('warn_confirm',function(user){
	$('#modified_ident').text(user);
	$('#modified_message').text('has been warned');
	$('#action_confirmed').show('blind',function(){	
		window.setTimeout(function(){
			$('#action_confirmed').hide('blind');
		},1500);
	});
});

module.socket.on('kick',function(){
	module.banned = 1;
	$('.chat_paused').remove();
	$('#main').append('<div class="chat_paused" id="banned_user">You have been banned</div>');
	$('#banned_user').show('fade','slow');
});

module.socket.on('kick_confirm',function(user){
	$('#modified_ident').text(user);
	$('#modified_message').text('is now banned');
	$('#action_confirmed').show('blind',function(){	
		window.setTimeout(function(){
			$('#action_confirmed').hide('blind');
		},1500);
	});
});

module.socket.on('check_live',function(live){
	if(live == '1'){
		$('#paused_message').hide('fade','show',function(){
			$('#paused_message').remove();
		});
	}else{
		module.live = 0;
		$('#main').append('<div class="chat_paused" id="paused_message">Chat has been paused</div>');
		$('#paused_message').show('fade','show');
	}
	$('.mssg_icon').tooltip();
	$('#notify_cont_top').on('click',find_top_notifications);
	$('#notify_cont_bottom').on('click',find_bottom_notifications);
	$('#chat_display').on('click','.mssg_icon',deleteIt);
	$('#chat_display').on('click','.mssg_upvote',upvoteMssg);
	$('#chat_display').on('click','.mssg_downvote',downvoteMssg);
	$('#chat_display').on('click','.chat_mssg',setClicked);
	$('#chat_display').on('click','.chat_link',function(e){e.stopPropagation();});
});

generateMssg = function(info,is_mssg,tmp){
	if(is_mssg){
		if(tmp){
			var tmp = "<div class='tmp_chat_mssg response_to_0 mssg_cont y_0 parent_0' id='mssg_cont_" + info.id + "'><div class='chat_mssg' id='message_" + info.id + "'>";
		}else{
			var tmp = "<div class='response_to_0 mssg_cont y_0 parent_0' id='mssg_cont_" + info.id + "'><div class='chat_mssg' id='message_" + info.id + "'>";
		}
	}else{
		if(tmp){
			var tmp = "<div class='tmp_chat_mssg response_to_" + info.responseto + " mssg_cont y_" + info.y_dim + " parent_" + info.parent + " marg_l_20' id='mssg_cont_" + info.id + "'><div class='chat_mssg' id='message_" + info.id + "'>";
		}else{
			var tmp = "<div class='response_to_" + info.responseto + " mssg_cont y_" + info.y_dim + " parent_" + info.parent + " marg_l_20' id='mssg_cont_" + info.id + "'><div class='chat_mssg' id='message_" + info.id + "'>";
		}
	}
	tmp += "<div class='row' style='margin:0;'> <div class='mssg_body_cont'><div class='vote_box'>";
	if(module.user_tracker == info.author || module.serial_tracker == info.author){
		tmp += '<span class="glyphicon glyphicon-chevron-up mssg_upvote" style="color:#57bf4b;" id="mssg_upvote_' + info.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="top"></span> <div class="upvote_count" id="mssg_votes_' + info.id + '">0</div> <span class="glyphicon glyphicon-chevron-down mssg_downvote" id="mssg_downvote_' + info.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="bottom"></span>';
	}else{
		tmp += '<span class="glyphicon glyphicon-chevron-up mssg_upvote" id="mssg_upvote_' + info.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="top"></span> <div class="upvote_count" id="mssg_votes_' + info.id + '">0</div> <span class="glyphicon glyphicon-chevron-down mssg_downvote" id="mssg_downvote_' + info.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="bottom"></span>';
	}
	tmp += '</div><div class="mssg_body author_' + info.author + '"><div id="toggle_' + info.id + '" class="toggle_responses"> <span class="caret caret_tooltip" id="caret_' + info.id + '" data-toggle="tooltip" data-original-title="Hide Responses" data-container="body" data-placement="top"></span> </div> ';
	if((module.serial_tracker == info.author || module.user_tracker == info.author) && info.message != '<i>This message has been deleted</i>'){
		tmp += "<span id='remove_" + info.id + "' style='margin-right:4px;' class='glyphicon glyphicon-remove mssg_icon' data-mssg-serial='" + info.serial + "' data-toggle='tooltip' title='Delete post' data-container='body' data-placement='top'></span>";
	}
	tmp += "<strong class='mssg_op' data-author='" + info.author + "' style='color:" + module.color_arr[info.serial % 7] + ";'> " + info.author + " (<span class='response_count' id='" + info.id + "'>0</span>)</strong> : " + info.message + "<div class='time_box'><div class='reply'><a href='#' class='reply_link' data-mssg-id='" + info.id + "'><strong>Reply</strong></a></div><div class='time' id='" + info.created_at + "'>" + moment.utc(info.created_at).fromNow() + "</div></div></div></div></div></div></div>"	
	return tmp;
}

module.socket.on('publishMessage',function(chat_info){
	if(chat_info.responseto == 0){
		var tmp = generateMssg(chat_info,1,0);
		$('.tmp_chat_mssg').remove();
		$('#chat_display').append(tmp);
	}else{
		var tmp = generateMssg(chat_info,0,0);
		$('.tmp_chat_mssg').remove();
		$('#mssg_cont_' + chat_info.responseto).append(tmp);
	}
	$('.mssg_icon').tooltip();
	$('.caret_tooltip').tooltip();
	if(!module.focused && !module.title_blinking){
		notifyMessage();
	}
	if(!module.stop_scroll){
		module.scroll_mod_active = 0;
		$('.chat_main').mCustomScrollbar('scrollTo','bottom',{scrollInertia:0});	
		window.setTimeout(function(){
			module.scroll_mod_active = 1;
		},100);
	}
});

/* Add a disconnect listener*/
module.socket.on('disconnect',function() {
	module.connected = 0;
	$('.enter_hint').text("");
	$('.response_hint').text("");
	$('.enter_hint').text('You are disconnected');
	$('.pm_unseen').text('You are disconnected');
	$('.pm_unseen').show();
	console.log('The client has disconnected!');
});

/* Sends a message to the server via module.sockets*/
$('#message').click(function(){
	$('.enter_hint').text("");
	$('.response_hint').text("");
	$(this).text("");
});

var keys = new Array();

$('#message').keydown(function(e){
	keys.push(e.which);
	if(e.which == 13){  /*enter key*/
		if(keys.indexOf(16) == -1){  /*shift key not pressed*/
			return false;
		}
	}
});

$('#message').keyup(function(e){
	if(module.live && module.banned == 0){
		$('.enter_hint').text("");
		if(e.which == 13){  /*enter key*/
			if(keys.indexOf(16) == -1){  /*shift key not pressed*/
				keys.splice(keys.indexOf(e.which),1);
				var mssg_sent = processMessage($('#message').val());
				if(mssg_sent.trim() != ""){
					if(module.connected){
						$('#message').val("");
						if($('#message').attr('class') == 'global'){
							var tmp = generateMssg({id:0,author:module.user_tracker,responseto:0,y_dim:0,serial:module.serial_tracker,created_at:moment.utc(moment.utc().format()).fromNow(),message:mssg_sent},1,1);
							$('.tmp_message').remove();
							$('#chat_display').append(tmp);
							$('.mssg_icon').tooltip();
							$('.caret_tooltip').tooltip();
							$('.enter_hint').text('Sending...');
							module.socket.emit('message_sent',{message:mssg_sent,responseto:0,y_dim:0,parent:0},function(){
								$('.enter_hint').text('Sent');
							});
						}else{
							var responseto = $('#message').attr('class').replace('message_','');
							var y_dim = parseInt($('#mssg_cont_' + responseto).attr('class').split(" ")[2].replace('y_','')) + 1;
							if($('#mssg_cont_' + responseto).attr('class').split(" ")[3].replace('parent_','') == 0){
								var resp_parent = responseto;
							}else{
								var resp_parent = $('#mssg_cont_' + responseto).parents('.mssg_cont').last().attr('id').replace('mssg_cont_','');
							}
							var tmp = generateMssg({id:0,author:module.user_tracker,responseto:responseto,y_dim:y_dim,serial:module.serial_tracker,created_at:moment.utc(moment.utc().format()).fromNow(),message:mssg_sent},0,1);
							$('.tmp_message').remove();
							$('#mssg_cont_' + responseto).append(tmp);
							$('.mssg_icon').tooltip();
							$('.caret_tooltip').tooltip();
							$('.enter_hint').text('Sending...');
							module.socket.emit('message_sent',{message:mssg_sent,responseto:responseto,y_dim:y_dim,parent:resp_parent},function(){
								$('.enter_hint').text('Sent');
							});	
						}
					}else{
						$('.enter_hint').text('You are disconnected');
					}
				}
			}else{
				keys.splice(keys.indexOf(e.which),1);
			}
		}else{
			keys.splice(keys.indexOf(e.which),1);
		}
	}else{
		keys.splice(keys.indexOf(e.which),1);
	}
});

