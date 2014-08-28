module = function(){
	var focused = live = scroll_mod_active = 1;
	var pm_info = '';
	var pm_scroll_inactive = {};
	var title_blinking = chat_scroll_timer = typ_cnt = connected = recent = banned = stop_scroll = scroll_button_clicked = scroll_top = 0;
	var clicked_on = -1;
	if($('.chat_id').length){
		var chat_id = $('.chat_id').attr('id').replace('chat_','');
	}else{
		var chat_id = '';
	}
	if($('#up_arr').length){
		var upvoted = jQuery.parseJSON($('#up_arr').text());
		var downvoted = jQuery.parseJSON($('#down_arr').text());
	}
	if(typeof io !== 'undefined'){
		var socket = io.connect('http://localhost:3000/',{query:"sid=" + $('#sid').attr('data-sid') + "&serial=" + $('#serial_tracker').text()});
	}else{
		var socket = $('body');
	}
	var color_arr = new Array('#228d49','#f52103','#2532f2','#f94f06','#5a24d9','#f8b92d','#38cedb','#050a57');
	var mems = new Array();
	var mods = new Array();
	var admin = new Array();
	var notifications_top_positions = new Array();
	var notifications_bottom_positions = new Array();
	var notifications_top_ids = new Array();
	var notifications_bottom_ids = new Array();
	var serial_id = $('#serial_id').text();
	var serial_tracker = $('#serial_tracker').text();
	var user_id = $('#user_id').text();
	var user_tracker = $('#user_tracker').text();
	var max_user_length = 20;
	var max_title_length = 300;
	var max_static_length = 10000;
	var max_chat_mssg_length = 2500;
	var max_description_length = 100;
	var max_info_length = 10000;

	return {chat_scroll_timer:chat_scroll_timer,max_title_length:max_title_length,max_user_length:max_user_length,max_static_length:max_static_length,max_chat_mssg_length:max_chat_mssg_length,max_description_length:max_description_length,max_info_length:max_info_length,pm_scroll_inactive:pm_scroll_inactive,connected:connected,recent:recent,typ_cnt:typ_cnt,pm_info:pm_info,focused:focused,live:live,title_blinking:title_blinking,banned:banned,stop_scroll:stop_scroll,scroll_mod_active:scroll_mod_active,scroll_button_clicked:scroll_button_clicked,scroll_top:scroll_top,clicked_on:clicked_on,chat_id:chat_id,upvoted:upvoted,downvoted:downvoted,socket:socket,color_arr:color_arr,mems:mems,mods:mods,admin:admin,notifications_top_positions:notifications_top_positions,notifications_bottom_positions:notifications_bottom_positions,notifications_top_ids:notifications_top_ids,notifications_bottom_ids:notifications_bottom_ids,serial_id:serial_id,serial_tracker:serial_tracker,user_id:user_id,user_tracker:user_tracker};
}();

updateChatTimes = function(){
	$.each($('.chat_time'),function(index,value){
		$(this).text(moment.utc($(this).attr('id')).fromNow());
	});
	if($('.last_login').length){
		$('.last_login').html('<strong>Last login: </strong>' + moment.utc($('.last_login').attr('id')).fromNow());
	}
}();

updateTimes = function(){
	$.each($('.time'),function(index,value){
		$(this).text(moment.utc($(this).attr('id')).fromNow());
	});
}();

$(document).ready(function(){
	if(module.user_id.length){
		window.setInterval(function(){
			if(module.typ_cnt > 1){
				module.typ_cnt--;
			}else if(module.typ_cnt == 1){
				module.typ_cnt--;
				module.socket.emit('not_typing',{pm_id:module.pm_info[2],friend_id:module.pm_info[1],user_id:module.user_id});
			}
			if(module.recent > 120){
				$.ajax({
					type:'POST',
					data:{user_id:module.user_id},
					url:'//mutualcog.com/profile/update-online-status',
					success:function(){},
					error:function(){}	
				});
			}else{
				module.recent++;	
			}	
		},1000);
		$(window).on('mousemove',function(){
			if(module.recent > 120){
				module.socket.emit('seen_chats');
			}
			module.recent = 0;
		});
	}
	if($('.pm_body').length){
		$('.pm_body').mCustomScrollbar({theme:'light-2',callbacks:{onScroll:function(){
			var $this = $(this);
			var par_id = $this.parent().attr('id');
			var scrollBottom = this.mcs.draggerTop + $this.find('.mCSB_dragger').height();
			if(scrollBottom == $this.height()){
				module.pm_scroll_inactive[par_id] = 0;
			}else{
				module.pm_scroll_inactive[par_id] = 1;
			}
		}}});	
		$('.pm_body').mCustomScrollbar('scrollTo','bottom',{scrollInertia:0});	
		window.setTimeout(function(){
			$('.pm_visible').css('visibility','');	
		},50);
	}
	updateChatTimes;
	updateTimes;
	setInterval(updateTimes,60000);
	setInterval(updateChatTimes,60000);
	$.each($('.pm_message'),function(index,val){
		$('.pm_message').eq(index).attr('title',moment.utc($('.pm_message').eq(index).attr('title')).local().format('hh:mma'));
	});
	$('#mssg_requests').popover({html:true});
	$('#global_requests').popover({html:true});
	$('#friend_requests').popover({html:true});
	$('#mssg_requests').blur(function(){
		$(this).popover('hide');
	});
	$('#global_requests').blur(function(){
		$(this).popover('hide');
	});
	$('#friend_requests').blur(function(){
		$(this).popover('hide');
	});
	$('body').on('click','.mssg_upvote',upvoteMssg);
	$('body').on('click','.mssg_downvote',downvoteMssg);
	$('#chat_display').on('click','.toggle_responses',getResponses);
	$('body').on('click','.accept_request',function(){
		var info = $(this).attr('id').split('_');
		var type = info[1];
		var user_id = info[2];
		module.socket.emit('request_answered',{type:type,user_id:user_id,accepted:1});
	});	
	$('body').on('click','.decline_request',function(){
		var info = $(this).attr('id').split('_');
		var type = info[1];
		var user_id = info[2];
		module.socket.emit('request_answered',{type:type,user_id:user_id,accepted:0});
	});
	$('body').on('click','.pm_remove',function(){
		$(this).parent().parent().remove();
		var pm_info = $(this).parent().parent().attr('id').split('_');
		module.socket.emit('leave_pm',{pm_id:pm_info[2],friend_id:pm_info[1]});
		return false;
	});
	$('body').on('click','.friend_box',function(){
		var friend_name = $(this).attr('id').replace('friend_box_for_','');
		var friend_id = $(this).attr('data-friend-id');
		var pm_id = $(this).attr('data-pm-chat-id');
		var friend_status_class = $(this).find('#friend_' + friend_id + '_status').attr('class').replace('friend_status','');
		console.log($(window).width());
		if($('.pm_bar').width() < $(window).width() - 500 && $('#pm_' + friend_id + '_' + pm_id).length == 0){
			module.socket.emit('join_pm',{friend_id:friend_id,friend_name:friend_name,pm_id:pm_id},function(info){
				$('#pm_' + info.friend_name).attr('id','pm_' + info.friend_id + '_' + info.pm_id);
			});
			$.ajax({
				type:'GET',
				data:{pm_id:pm_id},
				url:'//mutualcog.com/chat/pm-log',
				success:function(hresp){	
					var chat_box = '<div class="pm_cont pm_visible" id="pm_' + friend_id + '_' + pm_id + '" style="visibility:hidden;">';
					chat_box += '<div class="pm_header"><div class="' + friend_status_class + ' pm_status"></div><div class="glyphicon glyphicon-remove pm_remove"></div><div class="pm_name">' + friend_name + '</div></div>';
					chat_box += '<div class="pm_body"><div class="pm_body_mssgs">'
					$.each(hresp,function(index,val){
						if(val.author_id == module.user_id){
							chat_box += '<div class="pm_mssg_cont"> <div class="pm_message pull-right" style="background-color:#eee;margin-left:30px;margin-right:5px;" title="' + moment.utc(val.created_at).local().format('hh:mma') + '"> ' + val.message + ' </div> </div>';
						}else{
							chat_box += '<div class="pm_mssg_cont"> <div class="pm_message pull-left" style="background-color:#7badfc;margin-right:30px;margin-left:5px;" title="' + moment.utc(val.created_at).local().format('hh:mma') + '"> ' + val.message + ' </div> </div>';
						}
					});
					chat_box += '</div><div class="pm_body_alerts"> <div class="pm_mssg_alert pm_unseen" style="display:none;">Not seen</div> <div class="pm_mssg_alert pm_typing" style="display:none;">' + friend_name + ' is typing...</div> </div></div>';
					chat_box += '<textarea rows=1 class="pm_text"></textarea>';
					chat_box += '</div>'; 
					$('.pm_bar').prepend(chat_box);
					$('.pm_body').eq(0).mCustomScrollbar({theme:'light-2',callbacks:{onScroll:function(){
						var $this = $(this);
						var par_id = $this.parent().attr('id');
						var scrollBottom = this.mcs.draggerTop + $this.find('.mCSB_dragger').height();
						if(scrollBottom == $this.height()){
							module.pm_scroll_inactive[par_id] = 0;
						}else{
							module.pm_scroll_inactive[par_id] = 1;
						}
					}}});	
					$('.pm_body').eq(0).mCustomScrollbar('scrollTo','bottom',{scrollInertia:0});	
					window.setTimeout(function(){
						$('.pm_visible').css('visibility','');	
					},50);
					$('.pm_cont').eq(0).resizable({handles:"nw",ghost:false,maxHeight:450,maxWidth:400,minHeight:330,minWidth:240,resize:function(e,ui){
						var ui_height = ui.size.height;
						var ui_width = ui.size.width - 10;
						$(this).css('left','0');
						$(this).css('top','0');
						$(this).find('.pm_header').width(ui_width);
						$(this).find('.pm_body').height(ui_height - 64);
						$(this).find('.pm_body').width($(this).find('.pm_header').width() + 6);
						$(this).find('.pm_text').width($(this).find('.pm_header').width() - 2);
					}});
					var chat_cont = $('#pm_' + friend_id + '_' + pm_id);
					if(module.pm_scroll_inactive[chat_cont.attr('id')] == 0 || !(chat_cont.attr('id') in module.pm_scroll_inactive)){
						var pm_body = chat_cont.find('.pm_body');
						window.setTimeout(function(){
							pm_body.mCustomScrollbar('scrollTo','bottom',{scrollInertia:0});	
						},20);
					}
				},
				error:function(){}	
			});
		}
	});
	$('.pm_cont').resizable({handles:"nw",ghost:false,maxHeight:450,maxWidth:400,minHeight:330,minWidth:240,resize:function(e,ui){
		var ui_height = ui.size.height;
		var ui_width = ui.size.width - 10;
		$(this).css('left','0');
		$(this).css('top','0');
		$(this).find('.pm_header').width(ui_width);
		$(this).find('.pm_body').height(ui_height - 64);
		$(this).find('.pm_body').width($(this).find('.pm_header').width() + 6);
		$(this).find('.pm_text').width($(this).find('.pm_header').width() - 2);
	}});
	$('body').on('click','.pm_header',function(){
		var pm_info = $(this).parent().attr('id').split('_');
		if($(this).parent().find('.pm_body').css('display') == 'none'){
			module.socket.emit('maximize_pm',{friend_id:pm_info[1],pm_id:pm_info[2]});
			$(this).parent().resizable('enable');
			$(this).parent().find('.pm_body').css('display','');
			$(this).parent().find('.pm_text').css('display','');
			$(this).parent().find('.pm_body').css('visibility','hidden');
			$('.pm_body').mCustomScrollbar('scrollTo','bottom',{scrollInertia:0});	
			window.setTimeout(function(){
				$('.pm_body').css('visibility','');	
			},50);
		}else{
			module.socket.emit('minimize_pm',{friend_id:pm_info[1],pm_id:pm_info[2]});
			if($(this).parent().css('height') != ''){
				$(this).parent().attr('data-expanded-height',$(this).parent().css('height'));
				$(this).parent().css('height','');
			}
			$(this).parent().resizable('disable');
			$(this).parent().find('.pm_body').css('display','none');
			$(this).parent().find('.pm_text').css('display','none');
		}
	});
});

upvoteMssg = function(e){
	e.stopPropagation();
	var message_id = $(this).attr('id').replace('mssg_upvote_','');
	var url = '//mutualcog.com/chat/message-upvote';
	$.ajax({
		type:'POST',
		data:{id:message_id},
		url:url,
		success:function(hresp){
			if(hresp.status == 1 || hresp.status == 3){
				if(hresp.status == 1){
					module.downvoted.splice(module.downvoted.indexOf(message_id.toString()),1);						
					module.upvoted.push(message_id.toString());
				}else{
					module.upvoted.push(message_id.toString());
				}
				if($('#mssg_cont_' + message_id).hasClass('mssg_cont')){
					module.socket.emit('update_votes',{id:message_id,response:hresp,responseto:'global'});
				}else{
					module.socket.emit('update_votes',{id:message_id,response:hresp,responseto:$('#message').attr('class')});
				}
				$('#mssg_upvote_' + message_id).css('color','#57bf4b');
				$('#mssg_downvote_' + message_id).css('color','');
			}else if(hresp.status == 2){
				module.upvoted.splice(module.upvoted.indexOf(message_id.toString()),1);
				if($('#mssg_cont_' + message_id).hasClass('mssg_cont')){
					module.socket.emit('update_votes',{id:message_id,response:hresp,responseto:'global'});
				}else{
					module.socket.emit('update_votes',{id:message_id,response:hresp,responseto:$('#message').attr('class')});
				}
				$('#mssg_upvote_' + message_id).css('color','');
				$('#mssg_downvote_' + message_id).css('color','');
			}else{
				$('#mssg_upvote_' + message_id).tooltip('show');
			}
		},
		error:function(){}
	});
};

downvoteMssg = function(e){
	e.stopPropagation();
	var message_id = $(this).attr('id').replace('mssg_downvote_','');
	var url = '//mutualcog.com/chat/message-downvote';
	$.ajax({
		type:'POST',
		data:{id:message_id},
		url:url,
		success:function(hresp){
			if(hresp.status == 1 || hresp.status == 3){
				if(hresp.status == 1){
					module.upvoted.splice(module.downvoted.indexOf(message_id.toString()),1);						
					module.downvoted.push(message_id.toString());
				}else{
					module.downvoted.push(message_id.toString());
				}
				if($('#mssg_cont_' + message_id).hasClass('mssg_cont')){
					module.socket.emit('update_votes',{id:message_id,response:hresp,responseto:'global'});
				}else{
					module.socket.emit('update_votes',{id:message_id,response:hresp,responseto:$('#message').attr('class')});
				}
				$('#mssg_downvote_' + message_id).css('color','red');
				$('#mssg_upvote_' + message_id).css('color','');
			}else if(hresp.status == 2){
				module.downvoted.splice(module.downvoted.indexOf(message_id.toString()),1);
				if($('#mssg_cont_' + message_id).hasClass('mssg_cont')){
					module.socket.emit('update_votes',{id:message_id,response:hresp,responseto:'global'});
				}else{
					module.socket.emit('update_votes',{id:message_id,response:hresp,responseto:$('#message').attr('class')});
				}
				$('#mssg_upvote_' + message_id).css('color','');
				$('#mssg_downvote_' + message_id).css('color','');
			}else{
				$('#mssg_downvote_' + message_id).tooltip('show');
			}
		},
		error:function(){ }
	});
};

module.socket.on('updateVotes',function(info) {
	$('#mssg_votes_' + info.message_id).text(info.response.upvotes);
});

function validateLogin(username,password){
	var response = $.ajax({
		type:'GET',
		data:{username:username,pass:password},
		url:'//mutualcog.com/profile/validate-login',
		async:false,
	}).responseText;
	if(response == 1){
		$('#user_group').attr('class','form-group');
		$('#pass1_group').attr('class','form-group');
		$('#username').tooltip('destroy');
		return 1;
	}else{
		$('#user_group').attr('class','form-group has-error');
		$('#pass1_group').attr('class','form-group has-error');
		$('#username').attr('data-original-title','Your username or password is incorrect');
		$('#username').tooltip('show');
		return 0;
	}
}

$('#login_form').submit(function(){
	var username = $('#username').val();
	var pass = $('#pass').val();
	if(username.length > 0 && pass.length > 0){
		var res = validateLogin(username,pass);
		if(!res){
			return false;
		}
	}
	return true;
});

function validateUser(username){
	if(username.length < 3 || username.length > module.max_user_length){
		$('#reg_user_group').attr('class','form-group has-error');
		$('#reg_username').attr('data-original-title','Username must be between 3 and ' + module.max_user_length + ' characters');
		$('#reg_username').tooltip('show');
		return 0;
	}
	var response = $.ajax({
		type:'GET',
		data:{username:username},
		url:'//mutualcog.com/profile/validate-username',
		async:false,
	}).responseText;
	if(response == 2){
		$('#reg_user_group').attr('class','form-group has-error');
		$('#reg_username').attr('data-original-title','That username already exists');
		$('#reg_username').tooltip('show');
		return 0;
	}else if(response == 3){
		$('#reg_user_group').attr('class','form-group has-error');
		$('#reg_username').attr('data-original-title','Your username must contain at least one character');
		$('#reg_username').tooltip('show');
		return 0;
	}else{
		$('#reg_user_group').attr('class','form-group');
		$('#reg_username').tooltip('destroy');
		return 1;
	}
}

function validatePasswords(pass1,pass2){
	if(pass1 != pass2 && pass2 != ""){
		$('#reg_pass1_group').attr('class','form-group has-error');
		$('#pass2_group').attr('class','form-group has-error');
		$('#pass2').tooltip('show');
		return 0;
	}else if((pass1.length < 6 || pass1.length > 30) && pass2 != ""){
		$('#reg_pass1_group').attr('class','form-group has-error');
		$('#pass2_group').attr('class','form-group has-error');
		$('#pass').tooltip('show');
		return 0;
	}else{
		$('#reg_pass1_group').attr('class','form-group');
		$('#pass2_group').attr('class','form-group');
		$('#pass2').tooltip('destroy');
		$('#reg_pass').tooltip('destroy');
		return 1;
	}
}

function validateEmail(email){
	var response = $.ajax({
		type:'GET',
		data:{email:email},
		url:'//mutualcog.com/profile/validate-email',
		async:false,
	}).responseText;
	if(response == 0){
		$('#email_group').attr('class','form-group has-error');
		$('#email').tooltip('show');
		return 0;
	}else{
		$('#email_group').attr('class','form-group');
		$('#email').tooltip('destroy');
		return 1;
	}
}

$('#reg_username').blur(function(){
	var username = $('#reg_username').val();
	if(username.length > 0){
		var res = validateUser(username);
	}
});

$('#pass2').blur(function(){
	var pass = $('#reg_pass').val();
	var pass2 = $('#pass2').val();
	if(pass.length > 0 && pass2.length > 0){
		var res = validatePasswords(pass,pass2);
	}
});

$('#register_form').submit(function(){
	var username = $('#reg_username').val();
	var pass = $('#reg_pass').val();
	var pass2 = $('#pass2').val();
	var email = $('#email').val();
	if(username.length > 0 && pass.length > 0 && pass2.length > 0){
		var res = validateUser(username);
		if(!res){
			return false;
		}
		var res = validatePasswords(pass,pass2);
		if(!res){
			return false;
		}
		if(email.length > 0){
			var res = validateEmail(email);
			if(!res){
				return false;
			}
		}
	}else{
		if(username.length == 0){
			$('#reg_user_group').attr('class','form-group has-error');
		}
		if(pass.length == 0){
			$('#reg_pass1_group').attr('class','form-group has-error');
		}
		if(pass2.length == 0){
			$('#pass2_group').attr('class','form-group has-error');
		}
		$('#reg_username').attr('data-original-title','Please enter both a username and a confirmed password');
		$('#reg_username').tooltip('show');
		return false;
	}
	return true;
});

$('.modal').on('hide.bs.modal',function(){
	$('.form-control').tooltip('destroy');
});

$('#tag_dropdown').on('click',function(e){
	e.stopPropagation();
});

$('#search_input').on('focus',function(e){
	e.stopPropagation();
	if($('#search_input').val() == ""){
		$('#tag_dropdown').html('');
	}
	$(this).dropdown();
	$('#tag_dropdown').show();
});

var selected_term = -1;

$('#search_input').on('keydown',function(e){
	if(e.keyCode == 13){  /*enter key*/
		if(selected_term == -1){
		}else{
			location.assign($('li#search_' + selected_term).children('a').attr('href'));
		}	
		return false;
	}else if(e.keyCode == 38){  /*up arrow*/
		if(selected_term != 0){
			selected_term--;
			$('.tag_results').css('background-color','');
			$('li#search_' + selected_term).css('background-color','#ddd');
			
		}
		return false;
	}else if(e.keyCode == 40){  /*down arrow*/
		if(selected_term != $('.tag_results').length - 1){
			selected_term++;
			$('.tag_results').css('background-color','');
			$('li#search_' + selected_term).css('background-color','#ddd');
		}
		return false;
	}
});

$('#search_input').on('keyup',function(e){
	var tag = $(this).val();	
	if(e.keyCode == 13){  /*enter key*/
		return false;
	}else if(e.keyCode == 38 || e.keyCode == 40){  /*up arrow or down arrow*/
	}else{
		if(tag.length > 2){
			$.ajax({
				type:'GET',
				data: {tag:tag},
				url:'//mutualcog.com/tags/similar-entity',
				success:function(hresp){
					var content = '';
					var transition = 0;
					content += '<div class="search_res_type">Tags</div>';
					$.each(hresp,function(index,value){
						if(value.type == 'tag'){
							content += '<li id="search_' + index + '" class="tag_results"><a href="//mutualcog.com/t/' + value.name + '">' + value.name + '</a></li>';
						}else{
							if(transition == 0){
								content += '<div class="search_res_type">Users</div>';
								transition++;
							}
							content += '<li id="search_' + index + '" class="tag_results"><a href="//mutualcog.com/u/' + value.name + '">' + value.name + '</a></li>';
						}
					});
					if(content){
						$('#tag_dropdown').show();
						if($('#tag_dropdown').html() != content){
							$('#tag_dropdown').html(content);
							selected_term = -1;
						}
					}else{
						$('#tag_dropdown').hide();
						selected_term = -1;
					}
				},
				error:function(){
				}
			});
		}else{
			$('#tag_dropdown').html('');
		}
	}
});

$(window).on('blur',function(){
	module.focused = 0;
	if(module.user_id.length){
		module.recent += 110;
	}
});

$(window).on('focus',function(){
	module.focused = 1;
	if(module.user_id.length){
		if(module.recent > 120){
			module.socket.emit('seen_chats');
		}
		module.recent = 0;
	}
});

module.socket.on('receive_pm',function(info){
	var chat_cont = $('#pm_' + info.friend_id + '_' + info.pm_id);
	if(info.state == 0){  //chat closed
		var friend_status_class = $('#friend_' + info.friend_id + '_status').attr('class').replace('friend_status','');
		$.ajax({
			type:'GET',
			data:{pm_id:info.pm_id},
			url:'//mutualcog.com/chat/pm-log',
			success:function(hresp){	
				var chat_box = '<div class="pm_cont" id="pm_' + info.friend_id + '_' + info.pm_id + '">';
				chat_box += '<div class="pm_header"><div class="' + friend_status_class + ' pm_status"></div><div class="glyphicon glyphicon-remove pm_remove"></div><div class="pm_name">' + info.friend_name + '</div></div>';
				chat_box += '<div class="pm_body"><div class="pm_body_mssgs">';
				$.each(hresp,function(index,val){
					if(val.author_id == module.user_id){
						chat_box += '<div class="pm_mssg_cont"> <div class="pm_message pull-right" style="background-color:#eee;margin-left:30px;margin-right:5px;" title="' + moment.utc(val.created_at).local().format('hh:mma') + '"> ' + val.message + ' </div> </div>';
					}else{
						chat_box += '<div class="pm_mssg_cont"> <div class="pm_message pull-left" style="background-color:#7badfc;margin-right:30px;margin-left:5px;" title="' + moment.utc(val.created_at).local().format('hh:mma') + '"> ' + val.message + ' </div> </div>';
					}
				});
				chat_box += '</div><div class="pm_body_alerts"> <div class="pm_mssg_alert pm_unseen" style="display:none;">Not seen</div> <div class="pm_mssg_alert pm_typing" style="display:none;">' + info.friend_name + ' is typing...</div> </div></div>';
				chat_box += '<textarea rows=1 class="pm_text"></textarea>';
				chat_box += '</div>'; 
				$('.pm_bar').prepend(chat_box);
				var mssg = '<div class="pm_mssg_cont">';
				mssg += '<div class="pm_message pull-left" style="background-color:#7badfc;margin-right:30px;margin-left:5px;" title="' + moment.utc(info.time).local().format('hh:mma') + '">' + info.message + '</div>';
				mssg += '</div>'; 
				chat_cont = $('#pm_' + info.friend_id + '_' + info.pm_id);
				chat_cont.find('.pm_body_mssgs').append(mssg);
				if(module.pm_scroll_inactive[chat_cont.attr('id')] == 0 || !(chat_cont.attr('id') in module.pm_scroll_inactive)){
					var pm_body = chat_cont.find('.pm_body');
					window.setTimeout(function(){
						pm_body.mCustomScrollbar('scrollTo','bottom',{scrollInertia:0});	
					},20);
				}
			},
			error:function(){}	
		});
	}else if(info.state == 2){  //chat minimized
		chat_cont.resizable('enable');
		chat_cont.parent().find('.pm_body').css('display','');
		chat_cont.parent().find('.pm_text').css('display','');
		var mssg = '<div class="pm_mssg_cont">';
		mssg += '<div class="pm_message pull-left" style="background-color:#7badfc;margin-right:30px;margin-left:5px;" title="' + moment.utc(info.time).local().format('hh:mma') + '">' + info.message + '</div>';
		mssg += '</div>'; 
		chat_cont.find('.pm_body_mssgs').append(mssg);
	}else{
		var mssg = '<div class="pm_mssg_cont">';
		mssg += '<div class="pm_message pull-left" style="background-color:#7badfc;margin-right:30px;margin-left:5px;" title="' + moment.utc(info.time).local().format('hh:mma') + '">' + info.message + '</div>';
		mssg += '</div>'; 
		chat_cont.find('.pm_body_mssgs').append(mssg);
	}
	/*if(!module.focused && !module.title_blinking){
		notifyMessage();
	}*/
	if(module.pm_scroll_inactive[chat_cont.attr('id')] == 0 || !(chat_cont.attr('id') in module.pm_scroll_inactive)){
		var pm_body = chat_cont.find('.pm_body');
		window.setTimeout(function(){
			pm_body.mCustomScrollbar('scrollTo','bottom',{scrollInertia:0});	
		},20);
	}
});

module.socket.on('displayFriendRequests',function(request_info){
	var friend_count = $('#friend_requests_count');
	if(friend_count.text().length > 0){
		friend_count.text(parseInt(friend_count.text()) + 1);
	}else{
		$('#friend_request_glyph').addClass('pull-left');
		friend_count.text('1');
	}
	if($('#friend_requests').attr('data-content').indexOf('No friend requests') >= 0){
		$('#friend_requests').attr('data-content',request_info.message);
	}else{
		$('#friend_requests').attr('data-content',$('#friend_requests').attr('data-content').prepend(request_info.message));
	}
});

module.socket.on('displayGlobalRequests',function(request_info){
	var global_count = $('#global_requests_count');
	if(global_count.text().length > 0){
		global_count.text(parseInt(global_count.text()) + 1);
	}else{
		$('#global_request_glyph').addClass('pull-left');
		global_count.text('1');
	}
	if($('#global_requests').attr('data-content').indexOf('No global requests') >= 0){
		$('#global_requests').attr('data-content',request_info.message);
	}else{
		$('#global_requests').attr('data-content',$('#global_requests').attr('data-content').prepend(request_info.message));
	}
});

module.socket.on('chat_seen',function(info){
	var chat_cont = $('#pm_' + info.friend_id + '_' + info.pm_id);
	chat_cont.find('.pm_unseen').hide();
});

module.socket.on('is_typing',function(info){
	var chat_cont = $('#pm_' + info.friend_id + '_' + info.pm_id);
	chat_cont.find('.pm_typing').show();
});

module.socket.on('not_typing',function(info){
	var chat_cont = $('#pm_' + info.friend_id + '_' + info.pm_id);
	chat_cont.find('.pm_typing').hide();
});

var pm_keys = new Array();

$('body').on('cut','.pm_text',function(e){
	var $this = $(this);
	var self = this;
	window.setTimeout(function(){
		$this.height(0);
		$this.height(self.scrollHeight - 10);
	},0);
});

$('body').on('paste','.pm_text',function(e){
	var $this = $(this);
	var self = this;
	window.setTimeout(function(){
		$this.height(0);
		$this.height(self.scrollHeight - 10);
	},0);
});

$('body').on('keydown','.pm_text',function(e){
	pm_keys.push(e.which);
	var $this = $(this);
	var self = this;
	window.setTimeout(function(){
		$this.height(0);
		$this.height(self.scrollHeight - 10);
	},0);
});

$('body').on('keyup','.pm_text',function(e){
	module.pm_info = $(this).parent().attr('id').split('_');
	var chat_cont = $(this).parents('.pm_cont');
	if(module.user_id.length){
		if(module.recent > 120){
			module.socket.emit('seen_chats');
		}
		module.recent = 0;
	}
	if(e.which == 13){  /*enter key*/
		if(pm_keys.indexOf(16) == -1){  /*shift key not pressed*/
			pm_keys.splice(pm_keys.indexOf(e.which),1);
			if(module.typ_cnt > 0){
				module.socket.emit('not_typing',{pm_id:module.pm_info[2],friend_id:module.pm_info[1],user_id:module.user_id});
			}
			if($(this).val().trim() != ""){
				console.log($(this).val());
				module.socket.emit('send_pm',{message:$(this).val(),pm_id:module.pm_info[2],friend_id:module.pm_info[1],user_id:module.user_id},function(info){
					var chat_cont = $('#pm_' + info.friend_id + '_' + info.pm_id);
					var tmp_message = chat_cont.find('.tmp_message');
					tmp_message.find('.pm_message').html(info.message);
					tmp_message.attr('class',tmp_message.attr('class').replace('tmp_message',''));
					if(info.unseen){
						chat_cont.find('.pm_unseen').show();
					}
				});
				$(this).css('height','');
				$(this).val("");
				var mssg = '<div class="pm_mssg_cont tmp_message">';
				mssg += '<div class="pm_message pull-right" style="background-color:#eee;margin-left:30px;margin-right:5px;" title="' + moment().format("hh:mma") + '">' + $(this).val() + '</div>';
				mssg += '</div>'; 
				$('#pm_' + module.pm_info[1] + '_' + module.pm_info[2]).find('.pm_body_mssgs').append(mssg);
				if(module.pm_scroll_inactive[chat_cont.attr('id')] == 0 || !(chat_cont.attr('id') in module.pm_scroll_inactive)){
					var pm_body = chat_cont.find('.pm_body');
					window.setTimeout(function(){
						pm_body.mCustomScrollbar('scrollTo','bottom',{scrollInertia:0});	
					},20);
				}
			}
			module.typ_cnt = 0;
		}else{
			if(module.typ_cnt == 0){
				module.socket.emit('is_typing',{pm_id:module.pm_info[2],friend_id:module.pm_info[1],user_id:module.user_id});
			}
			pm_keys.splice(keys.indexOf(e.which),1);
			module.typ_cnt = 4;
		}
	}else{
		if(module.typ_cnt == 0){
			module.socket.emit('is_typing',{pm_id:module.pm_info[2],friend_id:module.pm_info[1],user_id:module.user_id});
		}
		pm_keys.splice(pm_keys.indexOf(e.which),1);
		module.typ_cnt = 4;
	}
	return true;
});

module.socket.on('softDelete',function(mssg_info){
	if($('#message_' + mssg_info.id + '.chat_mssg').length){
		$('.mssg_icon').tooltip('hide');
		$('.mssg_icon').tooltip();
		$('#message_' + mssg_info.id + '.chat_mssg').find('.mssg_body').html("<strong class='mssg_op' id='" + mssg_info.user + "' style='color:" + module.color_arr[mssg_info.mssg_serial % 7] + ";'>" + mssg_info.user + " (<span class='response_count' id='" + mssg_info.id + "'>" + mssg_info.responses + "</span>)</strong> : <em>This message has been deleted</em>");
	}
});

deleteIt = function(e){
	e.stopPropagation();
	var mssg_id = $(this).parents('.chat_mssg').first().attr('id').replace('message_','');
	if($('#logged_in').text() == 1){
		module.socket.emit('delete_message',{id:mssg_id,user:module.user_tracker,serial:$(this).attr('data-mssg-serial'),responses:$(this).parent().find('.response_count').text()});
	}else{
		module.socket.emit('delete_message',{id:mssg_id,user:module.serial_tracker,serial:$(this).attr('data-mssg-serial'),responses:$(this).parent().find('.response_count').text()});	
	}
};

getResponses = function(e){
	e.stopPropagation();
	var mssg_id = $(this).attr('id').replace('toggle_','');
	if($(this).hasClass('dropup')){
		$(this).removeClass('dropup');
		$(this).find('.caret').attr('data-original-title','Hide Responses');
		$('#mssg_cont_' + mssg_id).children('.mssg_cont').show();	
	}else{
		$(this).addClass('dropup');
		$(this).find('.caret').attr('data-original-title','Show Responses');
		$('#mssg_cont_' + mssg_id).children('.mssg_cont').hide();	
	}
}

