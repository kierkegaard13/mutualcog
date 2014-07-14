module = function(){
	var focused = live = 1;
	var typ_cnt = 0;
	var pm_info = '';
	var title_blinking = recent = banned = stop_scroll = scroll_attached = scroll_button_clicked = 0;
	var clicked_on = -1;
	var chat_id = $('.chat_id').attr('id');
	var upvoted = jQuery.parseJSON($('#up_arr').text());
	var downvoted = jQuery.parseJSON($('#down_arr').text());
	var socket = io.connect('http://localhost:3000/',{query:"sid=" + $('#sid').attr('data-sid') + "&serial=" + $('#serial_tracker').text()});
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

	return {recent:recent,typ_cnt:typ_cnt,pm_info:pm_info,focused:focused,live:live,title_blinking:title_blinking,banned:banned,stop_scroll:stop_scroll,scroll_attached:scroll_attached,scroll_button_clicked:scroll_button_clicked,clicked_on:clicked_on,chat_id:chat_id,upvoted:upvoted,downvoted:downvoted,socket:socket,color_arr:color_arr,mems:mems,mods:mods,admin:admin,notifications_top_positions:notifications_top_positions,notifications_bottom_positions:notifications_bottom_positions,notifications_top_ids:notifications_top_ids,notifications_bottom_ids:notifications_bottom_ids,serial_id:serial_id,serial_tracker:serial_tracker,user_id:user_id,user_tracker:user_tracker};
}();

$('.big_upvote').click(function(e){
	e.stopPropagation();
	var upvote_id = $(this).attr('id');
	var url = '//mutualcog.com/chat/upvote';
	$.ajax({
		type:'POST',
		data:{id:module.chat_id},
		url:url,
		success:function(hresp){
			if(hresp.status == 1 || hresp.status == 3){
				$('#votes_' + module.chat_id).text(hresp.upvotes);
				$('#upvote_' + module.chat_id).css('color','#57bf4b');
				$('#downvote_' + module.chat_id).css('color','');
			}else if(hresp.status == 2){
				$('#votes_' + module.chat_id).text(hresp.upvotes);
				$('#upvote_' + module.chat_id).css('color','');
				$('#downvote_' + module.chat_id).css('color','');
			}else{
				$('#' + upvote_id).tooltip('show');
			}
		},
		error:function(){}
	});
});

$('.big_downvote').click(function(e){
	e.stopPropagation();
	var downvote_id = $(this).attr('id');
	var url = '//mutualcog.com/chat/downvote';
	$.ajax({
		type:'POST',
		data:{id:module.chat_id},
		url:url,
		success:function(hresp){
			if(hresp.status == 1 || hresp.status == 3){
				$('#votes_' + module.chat_id).text(hresp.upvotes);
				$('#downvote_' + module.chat_id).css('color','red');
				$('#upvote_' + module.chat_id).css('color','');
			}else if(hresp.status == 2){
				$('#votes_' + module.chat_id).text(hresp.upvotes);
				$('#upvote_' + module.chat_id).css('color','');
				$('#downvote_' + module.chat_id).css('color','');
			}else{
				$('#' + downvote_id).tooltip('show');
			}
		},
		error:function(){ }
	});
});

module.socket.on('updateVotes',function(info) {
	$('#mssg_votes_' + info.message_id).text(info.response.upvotes);
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

$('#login_form').submit(function(){
	var submit = 1;
	var username = $('#username').val();
	var pass = $('#pass').val();
	var pass2 = $('#pass2').val();
	$('.form-group').attr('class','form-group');
	if(username.length < 3 || username.length > 20){
		$('#user_group').attr('class','form-group has-error');
		$('#username').attr('data-original-title','Username must be longer than 2 characters but less than 15');
		$('#username').tooltip('show');
		submit = 0;
	}else if(pass2 != ""){
		var response = $.ajax({
                        type:'GET',
                        data:{username:username},
                        url:'//mutualcog.com/profile/check-user',
                        async:false,
                }).responseText;
		if(response == 1){
			var response = $.ajax({
				type:'GET',
				data:{username:username},
				url:'//mutualcog.com/profile/check-alpha',
				async:false,
			}).responseText;
			if(response == 1){
			}else{
				$('#user_group').attr('class','form-group has-error');
				$('#username').attr('data-original-title','Your username must contain at least one character');
				$('#username').tooltip('show');
				submit = 0;
			}
		}else{
			$('#user_group').attr('class','form-group has-error');
			$('#username').attr('data-original-title','That username already exists');
			$('#username').tooltip('show');
			submit = 0;
		}
	}else{
		var response = $.ajax({
			type:'GET',
			data:{username:username,pass:pass},
			url:'//mutualcog.com/profile/check-credentials',
			async:false,
		}).responseText;
		if(response == 1){
		}else{
			$('#user_group').attr('class','form-group has-error');
			$('#pass1_group').attr('class','form-group has-error');
			$('#username').attr('data-original-title','Your username or password is incorrect');
			$('#username').tooltip('show');
			submit = 0;
		}
	}
	if(pass.length < 6 || pass.length > 30){
		$('#pass1_group').attr('class','form-group has-error');
		$('#pass2_group').attr('class','form-group has-error');
		$('#pass').tooltip('show');
		submit = 0;
	}
	if(pass != pass2 && pass2 != ""){
		$('#pass1_group').attr('class','form-group has-error');
		$('#pass2_group').attr('class','form-group has-error');
		$('#pass2').tooltip('show');
		submit = 0;
	}
	if(submit){
		return true;
	}else{
		return false;
	} 
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

$(window).on('click',function(e){
	$('#tag_dropdown').hide();
	$('#members_box').hide('blind');
	$('#show_members').removeClass('highlighted_dark');
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
		if(selected_term != $('#tag_dropdown').length - 1){
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
				url:'//mutualcog.com/tags/similar-tag',
				success:function(hresp){
					var content = '';
					$.each(hresp,function(index,value){
						if(value.type == 'tag'){
							content += '<li id="search_' + index + '" class="tag_results"><a href="//mutualcog.com/t/' + value.name + '">' + value.name + '</a></li>';
						}else{
							content += '<li id="search_' + index + '" class="tag_results"><a href="//mutualcog.com/p/' + value.name + '">' + value.name + '</a></li>';
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
		$('.pm_body').animate({scrollTop:$('.pm_body')[0].scrollHeight},'fast',function(){
			$('.pm_visible').css('visibility','');	
		});
	}
	setInterval(updateTimes,60000);
	setInterval(updateChatTimes,60000);
	$.each($('.pm_message'),function(index,val){
		$('.pm_message').eq(index).attr('title',moment.utc($('.pm_message').eq(index).attr('title')).local().format('hh:mma'));
	});
	$('#chat_messages').on('scroll',scroll_mod);
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
	module.scroll_attached = 1;
	module.stop_scroll = 0;
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
		if($('#pm_' + friend_name).length == 0){
			module.socket.emit('join_pm',{friend_id:friend_id,friend_name:friend_name,pm_id:pm_id},function(info){
				$('#pm_' + info.friend_name).attr('id','pm_' + info.friend_id + '_' + info.pm_id);
			});
			$.ajax({
				type:'GET',
				data:{pm_id:pm_id},
				url:'//mutualcog.com/chat/pm-log',
				success:function(hresp){	
					var chat_box = '<div class="pm_cont" id="pm_' + friend_id + '_' + pm_id + '" data-stop-scroll="0">';
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
					var chat_cont = $('#pm_' + friend_id + '_' + pm_id);
					if(!parseInt(chat_cont.attr('data-stop-scroll'))){
						var pm_body = chat_cont.find('.pm_body');
						pm_body.off('scroll',pm_scroll_mod);
						pm_body.scrollTop(pm_body[0].scrollHeight);
						window.setTimeout(function(){
							pm_body.on('scroll',pm_scroll_mod);
						},100);
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
	$('#chat_messages').click(function(){
		if(module.scroll_attached == 0){
			$('#chat_messages').on('scroll',scroll_mod);
			module.scroll_attached = 1;
			module.stop_scroll = 0;
		}
		$('#message').attr('class','global');
		$('.chat_mssg').css('background-color','');
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
			data: {details:$('#detail_text').val(),id:$('.chat_id').attr('id')},
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
	if($('#curr_details').hasClass('edit_details')){
		$('#curr_details').tooltip();
		$('#curr_details').click(function(){
			$('#description_modal').modal();
			return false;
		});
	}
	$('.mssg_upvote').on('click',upvoteMssg);
	$('.mssg_downvote').on('click',downvoteMssg);
	$('.caret_tooltip').tooltip();
	$('#permalink').tooltip();
	$('#show_members').tooltip();
	$('#stop_scroll').tooltip();
	$('#pause_chat').tooltip();
	$('#mod_user').tooltip();
	$('#warn_user').tooltip();
	$('#kick_user').tooltip();
	$('#permalink').click(function(e){
		window.location.href = $(this).attr('data-page-link'); 
	});
	$('#show_members').click(function(e){
		if(hovering == 0){
			$('#members_box').toggle('blind');
		}
		if($(this).hasClass('highlighted_dark')){
			showing = 0;
			$(this).attr('data-original-title','Show chat members');
			$(this).removeClass('highlighted_dark');
		}else{
			showing = 1;
			$(this).attr('data-original-title','Hide chat members');
			$(this).addClass('highlighted_dark');
		}
		return false;
	});
	$('#show_members').hover(function(){
		if(showing == 0){
			$('#members_box').show('blind');
			hovering = 1;
		}
	},function(){
		if(showing == 0){
			$('#members_box').hide('blind');
			hovering = 0;
		}
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
			module.socket.emit('warn',{member:user});
		}
	});
	$('#kick_user').click(function(){
		var user = $('#mssg_cont_' + module.clicked_on).find('.mssg_op').attr('data-author');
		if(user == module.user_tracker || module.clicked_on == -1){
			return false;
		}else{
			module.socket.emit('kick',{member:user});
		}
	});
	$('#stop_scroll').click(function(){
		if($(this).hasClass('highlight_red')){
			module.stop_scroll = 0;
			module.scroll_attached = 1;
			module.scroll_button_clicked = 0;
			$('#chat_messages').on('scroll',scroll_mod);
			$(this).removeClass('highlight_red');	
			$(this).attr('data-original-title','Stop scrollbar');
		}else{
			module.stop_scroll = 1;
			module.scroll_attached = 0;
			module.scroll_button_clicked = 1;
			$('#chat_messages').off('scroll',scroll_mod);
			$(this).addClass('highlight_red');
			$(this).attr('data-original-title','Resume scrolling');
		}	
	});
});

pm_scroll_mod = function(){
	var $this = $(this);
	$this.parent().attr('data-stop-scroll','1');
	window.setTimeout(function(){
		$this.parent().attr('data-stop-scroll','0');
	},10000);
};

module.socket.on('receive_pm',function(info){
	var chat_cont = $('#pm_' + info.friend_id + '_' + info.pm_id);
	if(info.state == 0){  //chat closed
		var friend_status_class = $('#friend_' + info.friend_id + '_status').attr('class').replace('friend_status','');
		$.ajax({
			type:'GET',
			data:{pm_id:info.pm_id},
			url:'//mutualcog.com/chat/pm-log',
			success:function(hresp){	
				var chat_box = '<div class="pm_cont" id="pm_' + info.friend_id + '_' + info.pm_id + '" data-stop-scroll="0">';
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
				if(!parseInt(chat_cont.attr('data-stop-scroll'))){
					var pm_body = chat_cont.find('.pm_body');
					pm_body.off('scroll',pm_scroll_mod);
					pm_body.scrollTop(pm_body[0].scrollHeight);
					window.setTimeout(function(){
						pm_body.on('scroll',pm_scroll_mod);
					},100);
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
	if(!parseInt(chat_cont.attr('data-stop-scroll'))){
		var pm_body = chat_cont.find('.pm_body');
		pm_body.off('scroll',pm_scroll_mod);
		pm_body.scrollTop(pm_body[0].scrollHeight);
		window.setTimeout(function(){
			pm_body.on('scroll',pm_scroll_mod);
		},100);
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

deleteIt = function(e){
	e.stopPropagation();
	var mssg_id = $(this).parents('.chat_mssg').first().attr('id').replace('message_','');
	if($('#logged_in').text() == 1){
		module.socket.emit('delete_message',{id:mssg_id,user:module.user_tracker,serial:module.serial_tracker,responses:$(this).parent().find('.response_count').text()});
	}else{
		module.socket.emit('delete_message',{id:mssg_id,user:module.serial_tracker,serial:module.serial_tracker,responses:$(this).parent().find('.response_count').text()});
	}
};

module.socket.on('softDelete',function(mssg_info){
	if($('#message_' + mssg_info.id + '.chat_mssg').length){
		$('.mssg_icon').tooltip('hide');
		$('.mssg_icon').tooltip();
		$('#message_' + mssg_info.id + '.chat_mssg').find('.mssg_body').html("<strong class='mssg_op' id='" + mssg_info.user + "' style='color:" + module.color_arr[mssg_info.serial % 7] + ";'>" + mssg_info.user + " (<span class='response_count' id='" + mssg_info.id + "'>" + mssg_info.responses + "</span>)</strong> : <em>This message has been deleted</em>");
	}
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
	$('.chat_mssg').css('background-color','');
	$(this).css('background-color','#ddd');
	$('#message').attr('class',$(this).attr('id').replace('message_',''));
	$('#chat_messages').off('scroll',scroll_mod);
	module.scroll_attached = 0;
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

scroll_mod = function(){
	module.stop_scroll = 1;
	if($('#stop_scroll').hasClass('highlight_red')){
	}else{
		$('#stop_scroll').addClass('highlight_red');
		$('#stop_scroll').attr('data-original-title','Resume scrolling');
	}	
	window.setTimeout(function(){
		if(module.scroll_button_clicked == 0){
			$('#stop_scroll').removeClass('highlight_red');	
			$('#stop_scroll').attr('data-original-title','Stop scrollbar');
		}
		module.stop_scroll = 0;
	},10000);
};

find_top_notifications = function(){
	var min = Math.min.apply(Math,module.notifications_top_positions);
	var min_id = module.notifications_top_ids[module.notifications_top_positions.indexOf(min)];
	module.notifications_top_ids.splice(module.notifications_top_positions.indexOf(min),1);
	module.notifications_top_positions.splice(module.notifications_top_positions.indexOf(min),1);
	$('#chat_messages').animate({scrollTop:min},'swing',function(){
		$('#message_' + min_id).addClass('highlight_background','800');
		setTimeout(function(){
			$('#message_' + min_id).removeClass('highlight_background','slow');
		},800);
	});
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
	$('#chat_messages').animate({scrollTop:min},'swing',function(){
		$('#message_' + min_id).addClass('highlight_background','800');
		setTimeout(function(){
			$('#message_' + min_id).removeClass('highlight_background','slow');
		},800);
	});
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

module.socket.on('displayFriendRequests',function(request_info){
	var friend_count = $('#friend_requests_count');
	var f_content = "";
	if(friend_count.text().length > 0){
		friend_count.text(parseInt(friend_count.text()) + 1);
	}else{
		$('#friend_request_glyph').addClass('pull-left');
		friend_count.text('1');
	}
	if($('#friend_requests').attr('data-content').indexOf('No friend requests') >= 0){
		$('#friend_requests').attr('data-content',"<div class='request_cont'> <div class='request_text'> <a class='chat_link' href='//mutualcog.com/p/" + request_info.sender + "'>" + request_info.sender + "</a> has requested your friendship </div> <div class='request_text'> <a class='chat_link' href='//mutualcog.com/profile/accept/" + request_info.id + "'>Accept</a> / <a class='chat_link' href='//mutualcog.com/profile/decline/" + request_info.id + "'>Decline</a> </div> </div>");
	}else{
		$('#friend_requests').attr('data-content',$('#friend_requests').attr('data-content').prepend("<div class='request_cont'> <div class='request_text'> <a class='chat_link' href='//mutualcog.com/p/" + request_info.sender + "'>" + request_info.sender + "</a> has requested your friendship </div> <div class='request_text'> <a class='chat_link' href='//mutualcog.com/profile/accept/" + request_info.id + "'>Accept</a> / <a class='chat_link' href='//mutualcog.com/profile/decline/" + request_info.id + "'>Decline</a> </div> </div>"));
	}
});

module.socket.on('connect',function() {
	module.socket.emit('room',$('.chat_id').attr('id'));
	if($('#logged_in').text() == 1){
		module.socket.emit('add_member',{new_member:module.user_tracker,serial_id:module.serial_id});
	}else{
		module.socket.emit('add_member',{new_member:module.serial_tracker,serial_id:module.serial_id});
	}
});

module.socket.on('alertUserToResponse',function(info){
	var scrollTop = $('#chat_messages').scrollTop();
	if($('#mssg_cont_' + info.mssg_id).parent().css('display') == 'none'){
		var resp_pos = $('#mssg_cont_' + info.parent).position().top;
	}else{
		var resp_pos = $('#mssg_cont_' + info.resp_id).position().top;
	}
	var result_top = resp_pos - scrollTop + 12;
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
	var result_bottom = resp_pos - scrollTop - $('#chat_messages').height();
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
	/*if(!$('#' + info.resp_id + '.chat_resp').length){
		if($('#' + info.mssg_id + '.chat_mssg').length){
			$('#' + info.mssg_id + '.chat_mssg').data('continue','1');
			blinkRed($('#' + info.mssg_id + '.chat_mssg'));
		}else if($('#' + info.mssg_id + '.chat_resp').length){
			$('#' + info.mssg_id + '.chat_resp').data('continue','1');
			blinkRedv2($('#' + info.mssg_id + '.chat_resp'));
		}
	}*/
});

module.socket.on('display_details',function(info){
	$('#curr_details').html(info);
});

module.socket.on('updateResponseCount',function(info){
	$('#' + info.id + '.response_count').animate({color:module.color_arr[info.serial % 7]},'slow');	
	$('#' + info.id + '.response_count').animate({color:'black'},'slow');	
	$('#' + info.id + '.response_count').text(info.count);
});

module.socket.on('displayMembers',function(info){
	module.mems = new Array();
	module.mods = new Array();
	module.admin = new Array();
	if(info.add){
		$.each($('.author_' + info.mod),function(index,element){
			$('.author_' + info.mod).eq(index).html("<span class='glyphicon glyphicon-tower' style='margin-right:5px;'></span>" + $('.author_' + info.mod).eq(index).html());
		});
	}
	if(info.remove){
		$('.author_' + info.mod).find('.glyphicon-tower').remove();
	}
	$.each(info.members,function(index,member){
		if(member.is_admin){
			module.admin.push(member.user);
			module.mems.push("<div style='color:white;'><span class='glyphicon glyphicon-star' style='margin-right:5px;'></span>" + member.user + "</div>");
		}else if(member.is_mod){
			module.mods.push(member.user);
			module.mems.push("<div style='color:white;'><span class='glyphicon glyphicon-tower' style='margin-right:5px;'></span>" + member.user + "</div>");
		}else{
			module.mems.push("<div style='color:white;'>" + member.user + "</div>");
		}
	});
	$('#members_list').html(module.mems.join(''));
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
	$('#chat_display').on('click','.toggle_responses',getResponses);
	$('#chat_display').on('click','.chat_link',function(e){e.stopPropagation();});
});

generateMssg = function(info,is_mssg){
	if(is_mssg){
		var tmp = "<div class='response_to_0 mssg_cont level_0 parent_0' id='mssg_cont_" + info.id + "'><div class='chat_mssg' id='message_" + info.id + "'>";
	}else{
		var tmp = "<div class='response_to_" + info.responseto + " mssg_cont level_" + info.level + " parent_" + info.parent + " pad_l_20' id='mssg_cont_" + info.id + "'><div class='chat_mssg' id='message_" + info.id + "'>";
	}
	tmp += "<div class='row' style='margin:0;'> <div class='mssg_body_cont'><div class='vote_box'>";
	if(module.user_tracker == info.author || module.serial_tracker == info.author){
		tmp += '<span class="glyphicon glyphicon-chevron-up mssg_upvote" style="color:#57bf4b;" id="mssg_upvote_' + info.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="top"></span> <div class="upvote_count" id="mssg_votes_' + info.id + '">0</div> <span class="glyphicon glyphicon-chevron-down mssg_downvote" id="mssg_downvote_' + info.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="bottom"></span>';
	}else{
		tmp += '<span class="glyphicon glyphicon-chevron-up mssg_upvote" id="mssg_upvote_' + info.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="top"></span> <div class="upvote_count" id="mssg_votes_' + info.id + '">0</div> <span class="glyphicon glyphicon-chevron-down mssg_downvote" id="mssg_downvote_' + info.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="bottom"></span>';
	}
	tmp += '</div><div class="mssg_body author_' + info.author + '"><div id="toggle_' + info.id + '" class="toggle_responses"> <span class="caret caret_tooltip" id="caret_' + info.id + '" data-toggle="tooltip" data-original-title="Hide Responses" data-container="body" data-placement="top"></span> </div> ';
	if((module.serial_tracker == info.author || module.user_tracker == info.author) && info.message != '<i>This message has been deleted</i>'){
		tmp += "<span id='" + info.id + "' style='margin-right:4px;' class='glyphicon glyphicon-remove mssg_icon' data-toggle='tooltip' title='Delete post' data-container='body' data-placement='top'></span>";
	}
	if(module.admin.indexOf(info.author) != -1){
		tmp += "<span class='glyphicon glyphicon-star'></span>";
	}else if(module.mods.indexOf(info.author) != -1){
		tmp += "<span class='glyphicon glyphicon-tower'></span>";	
	}
	tmp += "<strong class='mssg_op' data-author='" + info.author + "' style='color:" + module.color_arr[info.serial % 7] + ";'> " + info.author + " (<span class='response_count' id='" + info.id + "'>0</span>)</strong> : " + info.message + "<div class='time_box'><div class='time' id='" + info.created_at + "'>" + moment.utc(info.created_at).fromNow() + "</div></div></div></div></div></div></div>"	
	return tmp;
}

module.socket.on('publishMessage',function(chat_info){
	if(chat_info.responseto == 0){
		var tmp = generateMssg(chat_info,1);
		$('.tmp_message').remove();
		$('#chat_display').append(tmp);
	}else{
		var tmp = generateMssg(chat_info,0);
		$('.tmp_message').remove();
		$('#mssg_cont_' + chat_info.responseto).append(tmp);
	}
	$('.mssg_icon').tooltip();
	$('.caret_tooltip').tooltip();
	if(!module.focused && !module.title_blinking){
		notifyMessage();
	}
	if(!module.stop_scroll){
		$('#chat_messages').off('scroll',scroll_mod);
		module.scroll_attached = 0;
		$('#chat_messages').scrollTop($('#chat_display').height());
		window.setTimeout(function(){
			$('#chat_messages').on('scroll',scroll_mod);
			module.scroll_attached = 1;
		},100);
	}
});

/* Add a disconnect listener*/
module.socket.on('disconnect',function() {
	console.log('The client has disconnected!');
});

/* Sends a message to the server via module.sockets*/
function sendMessageToServer(message,clicked_on) {
	module.socket.emit('message_sent',message);
	/*if(message.responseto == 0){
		var tmp = "<div id='mssg_cont' class='tmp_message response_to_0 level_0 parent_0'><div class='chat_mssg'><div class='row' style='margin:0;'> <div id='toggle_' class='toggle_responses'> <span class='caret caret_tooltip' id='caret_' data-toggle='tooltip' data-original-title='Hide Responses' data-container='body' data-placement='top'></span> </div> <div class='mssg_body_cont'><div class='vote_box'>";
	}else{
		var tmp = "<div id='mssg_cont' class='tmp_message response_to_" + message.responseto + " level_" + message.level + " parent_" + message.parent + " pad_l_20'><div class='chat_mssg'><div class='row' style='margin:0;'> <div class='mssg_body_cont'><div class='vote_box'>";
	}
	tmp += '<span class="glyphicon glyphicon-chevron-up mssg_upvote" id="mssg_upvote" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="top"></span> <div class="upvote_count">0</div> <span class="glyphicon glyphicon-chevron-down mssg_downvote" id="mssg_downvote" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="bottom"></span></div><div class="mssg_body"><div id="toggle_" class="toggle_responses"> <span class="caret caret_tooltip" id="caret_" data-toggle="tooltip" data-original-title="Hide Responses" data-container="body" data-placement="top"></span> </div> ';
	if($('#logged_in').text() == 1){
		tmp += "<span style='margin-right:4px;' class='glyphicon glyphicon-remove mssg_icon' data-toggle='tooltip' title='Delete post' data-container='body' data-placement='top'></span>";
	}
	if(module.admin.indexOf(module.user_tracker) != -1){
		tmp += "<span class='glyphicon glyphicon-star'></span>";
	}else if(module.mods.indexOf(module.user_tracker) != -1){
		tmp += "<span class='glyphicon glyphicon-tower'></span>";	
	}
	tmp += "<strong class='mssg_op' id='" + module.user_tracker + "' style='color:" + module.color_arr[module.serial_tracker % 7] + ";'> " + module.user_tracker + " (<span class='response_count'>0</span>)</strong> : " + message.message + "<div class='time_box'><div class='time'>a few seconds ago</div></div></div></div></div></div></div>";	
	if(message.responseto == 0){
		$('#chat_display').append(tmp);
	}else{
		$('#mssg_cont_' + clicked_on).append(tmp);
	}*/
}

$('#message').click(function(){
	$('.enter_hint').text("");
	$('.response_hint').text("");
	$(this).text("");
});

var keys = new Array();

$('#message').keydown(function(e){
	keys.push(e.which);
});

$('#message').keyup(function(e){
	if(module.live && module.banned == 0){
		if(e.which == 13){  /*enter key*/
			if(keys.indexOf(16) == -1){  /*shift key not pressed*/
				keys.splice(keys.indexOf(e.which),1);
				if($('#message').val().trim() != ""){
					if($('#message').attr('class') == 'global'){
						sendMessageToServer({message:$('#message').val(),responseto:0,level:0,parent:0},module.clicked_on);
					}else{
						var responseto = $('#message').attr('class').replace('message_','');
						var level = parseInt($('#mssg_cont_' + responseto).attr('class').split(" ")[2].replace('level_','')) + 1;
						if($('#mssg_cont_' + responseto).attr('class').split(" ")[3].replace('parent_','') == 0){
							var resp_parent = responseto;
						}else{
							var resp_parent = $('#mssg_cont_' + responseto).parents('.mssg_cont').last().attr('id').replace('mssg_cont_','');
						}
						sendMessageToServer({message:$('#message').val(),responseto:responseto,level:level,parent:resp_parent},module.clicked_on);	
					}
					$('#message').val("");
				}
			}else{
				keys.splice(keys.indexOf(e.which),1);
				return true;
			}
		}else{
			keys.splice(keys.indexOf(e.which),1);
		}
		return true;
	}else{
		keys.splice(keys.indexOf(e.which),1);
	}
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
				var mssg = '<div class="pm_mssg_cont tmp_message">';
				mssg += '<div class="pm_message pull-right" style="background-color:#eee;margin-left:30px;margin-right:5px;" title="' + moment().format("hh:mma") + '">' + $(this).val() + '</div>';
				mssg += '</div>'; 
				$('#pm_' + module.pm_info[1] + '_' + module.pm_info[2]).find('.pm_body_mssgs').append(mssg);
				$(this).val("");
				if(!parseInt(chat_cont.attr('data-stop-scroll'))){
					var pm_body = chat_cont.find('.pm_body');
					pm_body.off('scroll',pm_scroll_mod);
					pm_body.scrollTop(pm_body[0].scrollHeight);
					window.setTimeout(function(){
						pm_body.on('scroll',pm_scroll_mod);
					},100);
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

