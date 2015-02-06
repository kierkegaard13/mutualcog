$('body').on('click','.mobile_pm_return',function(){
	$(this).parents('.mobile_pm_window').hide('slide');
});

$('body').on('click','.mobile_pm_cont',function(){
	var pm_id = 'mobile_' + $(this).attr('id').replace('ident_','');
	$('#' + pm_id).show('slide');
	$('#' + pm_id).find('.mobile_pm_body').mCustomScrollbar({theme:'light-2',callbacks:{onScroll:function(){
		var $this = $(this);
		var par_id = $this.parent().attr('id');
		var scrollBottom = this.mcs.draggerTop + $this.find('.mCSB_dragger').height();
		if(scrollBottom == $this.height()){
			module.pm_scroll_inactive[par_id] = 0;
		}else{
			module.pm_scroll_inactive[par_id] = 1;
		}
	}}});	
	$('#' + pm_id).find('.mobile_pm_body').mCustomScrollbar('scrollTo','bottom',{scrollInertia:0});	
});

$('body').on('click','.js_mssg_upvote',upvoteMssg);

$('body').on('click','.js_mssg_downvote',downvoteMssg);

$('body').on('click','.request_link',function(){
	var $this = $(this);
	$.ajax({
		type:'GET',
		data:{note_id:$(this).attr('data-request-id')},
		url:'//mutualcog.com/profile/remove-notification',
		success:function(){	
			window.location.href = $this.attr('data-request-link');
		}
	});
});

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

$('body').on('click','.mobile_pm_remove',function(){
	$(this).parent().parent().remove();
	var pm_info = $(this).parent().parent().attr('id').split('_');
	module.socket.emit('leave_pm',{pm_id:pm_info[2],friend_id:pm_info[1]});
	return false;
});

$('body').on('click','.mobile_friend_box',function(){
	//TODO finish this to create mobile chat
});

$('body').on('click','.friend_box',function(){
	var friend_name = $(this).attr('id').replace('friend_box_for_','');
	var friend_id = $(this).attr('data-friend-id');
	var pm_id = $(this).attr('data-pm-chat-id');
	var friend_status_class = $(this).find('#friend_' + friend_id + '_status').attr('class').replace('friend_status','');
	if($('.pm_bar').width() < $(window).width() - 370 && $('#pm_' + friend_id + '_' + pm_id).length == 0){
		if(pm_id != '0'){
			var chat_box = newPmChat(friend_id,pm_id,friend_status_class,friend_name);
			$('.pm_bar').prepend(chat_box);
			$.ajax({  
				type:'GET',
				data:{pm_id:pm_id},
				url:'//mutualcog.com/chat/pm-log',
				success:function(hresp){	
					var chat_messages = '';
					$.each(hresp,function(index,val){
						if(val.author_id == module.user_id){
							chat_messages += '<div class="pm_mssg_cont"> <div class="pm_message pull-right" style="background-color:#eee;margin-left:30px;margin-right:5px;" title="' + moment.utc(val.created_at).local().format('[Today at] h:mma') + '"> ' + val.message + ' </div> </div>';
						}else{
							chat_messages += '<div class="pm_mssg_cont"> <div class="pm_message pull-left" style="background-color:#7badfc;margin-right:30px;margin-left:5px;" title="' + moment.utc(val.created_at).local().format('[Today at] h:mma') + '"> ' + val.message + ' </div> </div>';
						}
					});
					$('#pm_' + friend_id + '_' + pm_id).find('.pm_body_mssgs').append(chat_messages);
					module.socket.emit('join_pm',{friend_id:friend_id,friend_name:friend_name,pm_id:pm_id},function(info){
					});
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
						$('#pm_' + friend_id + '_' + pm_id).find('.pm_text').focus();
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
					/*var chat_cont = $('#pm_' + friend_id + '_' + pm_id);
					if(module.pm_scroll_inactive[chat_cont.attr('id')] == 0 || !(chat_cont.attr('id') in module.pm_scroll_inactive)){
						var pm_body = chat_cont.find('.pm_body');
						window.setTimeout(function(){
							pm_body.mCustomScrollbar('scrollTo','bottom',{scrollInertia:0});	
						},20);
					}*/
				},
				error:function(){}	
			});
		}else{
			var chat_box = newPmChat(friend_id,0,friend_status_class,friend_name);
			$('.pm_bar').prepend(chat_box);
			module.socket.emit('join_pm',{friend_id:friend_id,friend_name:friend_name,pm_id:pm_id},function(info){
				$('#pm_' + info.friend_name + '_0').attr('id','pm_' + info.friend_id + '_' + info.pm_id);
			});
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
				$('#pm_' + friend_id + '_' + pm_id).find('.pm_text').focus();
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
		}
	}else if($('#pm_' + friend_id + '_' + pm_id).length == 0){
		if($('.pm_list_footer').length == 0){
			$('.pm_bar').prepend('<div class="dropup pm_list_footer_cont"><div class="pm_list_footer dropdown-toggle" data-toggle="dropdown"><div class="glyphicon glyphicon-comment" style="color:white;float:left;"> ...</div></div><ul class="dropdown-menu pm_dropup" role="menu"><li id="switch_' + friend_id + '_' + pm_id + '"><a class="switch_pm" href="#" data-friend-id="' + friend_id + '" data-friend-name="' + friend_name + '" data-pm-id="' + pm_id + '" data-status="' + friend_status_class + '">' + friend_name + '</a></li></ul></div>');
		}else{
			$('.pm_dropup').prepend('<li id="switch_' + friend_id + '_' + pm_id + '"><a class="switch_pm" href="#" data-friend-id="' + friend_id + '" data-friend-name="' + friend_name + '" data-pm-id="' + pm_id + '" data-status="' + friend_status_class + '">' + friend_name + '</a></li>');
		}
	}
});

$('body').on('click','.switch_pm',function(){
	$(this).remove();  //remove item from dropup
	var first = $('.pm_cont').first();
	var first_fr_id = first.attr('id').split('_')[1];
	var first_pm_id = first.attr('id').split('_')[2];
	var first_stat = first.find('.pm_status').attr('class').split(' ')[0];
	var first_name = first.find('.pm_name').text();
	$('.pm_dropup').prepend('<li id="switch_' + friend_id + '_' + pm_id + '"><a class="switch_pm" href="#" data-friend-id="' + first_fr_id + '" data-friend-name="' + first_name + '" data-pm-id="' + first_pm_id + '" data-status="' + first_stat + '">' + first_name + '</a></li>');
	$('.pm_cont').first().css('display','none');
	$('.pm_cont').first().css('visibility','hidden');
	var friend_id = $(this).attr('data-friend-id');;
	var pm_id = $(this).attr('data-pm-id');
	var friend_status_class = $(this).attr('data-status');
	var friend_name = $(this).attr('data-friend-name');
	if($('#pm_' + friend_id + '_' + pm_id).length == 0){  //display none never set on item, only exists as dropup elem
		var chat_box = newPmChat(friend_id,pm_id,friend_status_class,friend_name);
		$('.pm_cont').first().before(chat_box);
		$.ajax({
			type:'GET',
			data:{pm_id:pm_id},
			url:'//mutualcog.com/chat/pm-log',
			success:function(hresp){	
				var chat_messages = '';
				$.each(hresp,function(index,val){
					if(val.author_id == module.user_id){
						chat_messages += '<div class="pm_mssg_cont"> <div class="pm_message pull-right" style="background-color:#eee;margin-left:30px;margin-right:5px;" title="' + moment.utc(val.created_at).local().format('[Today at] h:mma') + '"> ' + val.message + ' </div> </div>';
					}else{
						chat_messages += '<div class="pm_mssg_cont"> <div class="pm_message pull-left" style="background-color:#7badfc;margin-right:30px;margin-left:5px;" title="' + moment.utc(val.created_at).local().format('[Today at] h:mma') + '"> ' + val.message + ' </div> </div>';
					}
				});
				$('#pm_' + friend_id + '_' + pm_id).find('.pm_body_mssgs').append(chat_messages);
				module.socket.emit('join_pm',{friend_id:friend_id,friend_name:friend_name,pm_id:pm_id},function(info){
				});
				$('#pm_' + friend_id + '_' + pm_id).find('.pm_body').mCustomScrollbar({theme:'light-2',callbacks:{onScroll:function(){
					var $this = $(this);
					var par_id = $this.parent().attr('id');
					var scrollBottom = this.mcs.draggerTop + $this.find('.mCSB_dragger').height();
					if(scrollBottom == $this.height()){
						module.pm_scroll_inactive[par_id] = 0;
					}else{
						module.pm_scroll_inactive[par_id] = 1;
					}
				}}});	
				$('#pm_' + friend_id + '_' + pm_id).find('.pm_body').mCustomScrollbar('scrollTo','bottom',{scrollInertia:0});	
				window.setTimeout(function(){
					$('#pm_' + friend_id + '_' + pm_id).css('visibility','');	
					$('#pm_' + friend_id + '_' + pm_id).find('.pm_text').focus();
				},50);
				$('#pm_' + friend_id + '_' + pm_id).resizable({handles:"nw",ghost:false,maxHeight:450,maxWidth:400,minHeight:330,minWidth:240,resize:function(e,ui){
					var ui_height = ui.size.height;
					var ui_width = ui.size.width - 10;
					$(this).css('left','0');
					$(this).css('top','0');
					$(this).find('.pm_header').width(ui_width);
					$(this).find('.pm_body').height(ui_height - 64);
					$(this).find('.pm_body').width($(this).find('.pm_header').width() + 6);
					$(this).find('.pm_text').width($(this).find('.pm_header').width() - 2);
				}});
				/*var chat_cont = $('#pm_' + friend_id + '_' + pm_id);
				if(module.pm_scroll_inactive[chat_cont.attr('id')] == 0 || !(chat_cont.attr('id') in module.pm_scroll_inactive)){
					var pm_body = chat_cont.find('.pm_body');
					window.setTimeout(function(){
						pm_body.mCustomScrollbar('scrollTo','bottom',{scrollInertia:0});	
					},20);
				}*/
			},
			error:function(){}	
		});
	}else{  //item is currently display none
		var chat_box = $('#pm_' + friend_id + '_' + pm_id).clone();
		$('#pm_' + friend_id + '_' + pm_id).remove();
		chat_box.css('display','');
		$('.pm_cont').first().before(chat_box);
		$('#pm_' + friend_id + '_' + pm_id).find('.pm_body').mCustomScrollbar({theme:'light-2',callbacks:{onScroll:function(){
			var $this = $(this);
			var par_id = $this.parent().attr('id');
			var scrollBottom = this.mcs.draggerTop + $this.find('.mCSB_dragger').height();
			if(scrollBottom == $this.height()){
				module.pm_scroll_inactive[par_id] = 0;
			}else{
				module.pm_scroll_inactive[par_id] = 1;
			}
		}}});	
		$('#pm_' + friend_id + '_' + pm_id).find('.pm_body').mCustomScrollbar('scrollTo','bottom',{scrollInertia:0});	
		window.setTimeout(function(){
			$('#pm_' + friend_id + '_' + pm_id).css('visibility','');	
			$('#pm_' + friend_id + '_' + pm_id).find('.pm_text').focus();
		},50);
		$('#pm_' + friend_id + '_' + pm_id).resizable({handles:"nw",ghost:false,maxHeight:450,maxWidth:400,minHeight:330,minWidth:240,resize:function(e,ui){
			var ui_height = ui.size.height;
			var ui_width = ui.size.width - 10;
			$(this).css('left','0');
			$(this).css('top','0');
			$(this).find('.pm_header').width(ui_width);
			$(this).find('.pm_body').height(ui_height - 64);
			$(this).find('.pm_body').width($(this).find('.pm_header').width() + 6);
			$(this).find('.pm_text').width($(this).find('.pm_header').width() - 2);
		}});
	}
	return false;
});

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

$(window).on('click',function(e){
	$('#community_dropdown').hide();
	$('#users_box').hide('blind');
	$('#show_users').removeClass('highlighted_dark');
});

$('#community_dropdown').on('click',function(e){
	e.stopPropagation();
});

$('.js_upvote').click(function(e){
	e.stopPropagation();
	if($('#logged_in').text() == 1){
		var upvote_id = $(this).attr('id');
		var chat_id = $(this).attr('id').replace('upvote_','');
		var url = '//mutualcog.com/chat/upvote';
		var votes = parseInt($('#votes_' + chat_id).text());
		if($('#downvote_' + chat_id).hasClass('red_color')){
			$('#upvote_' + chat_id).addClass('green_color');
			$('#downvote_' + chat_id).removeClass('red_color');
			$('#votes_' + chat_id).text(votes + 2);
		}else if($('#upvote_' + chat_id).hasClass('green_color')){
			$('#upvote_' + chat_id).removeClass('green_color');
			$('#downvote_' + chat_id).removeClass('red_color');
			$('#votes_' + chat_id).text(votes - 1);
		}else{
			$('#upvote_' + chat_id).addClass('green_color');
			$('#downvote_' + chat_id).removeClass('red_color');
			$('#votes_' + chat_id).text(votes + 1);
		}
		$.ajax({
			type:'POST',
			data:{id:chat_id},
			url:url,
			success:function(hresp){
				if(hresp.status == 1 || hresp.status == 3){
					$('#votes_' + chat_id).text(hresp.upvotes);
					$('#upvote_' + chat_id).addClass('green_color');
					$('#downvote_' + chat_id).removeClass('red_color');
				}else if(hresp.status == 2){
					$('#votes_' + chat_id).text(hresp.upvotes);
					$('#upvote_' + chat_id).removeClass('green_color');
					$('#downvote_' + chat_id).removeClass('red_color');
				}else{
					$('#reg_modal_title').text('Sign up to upvote/downvote');
					$('#register_modal').modal();	
				}
			},
			error:function(){}
		});
	}else{
		$('#reg_modal_title').text('Sign up to upvote/downvote');
		$('#register_modal').modal();	
	}
});

$('.js_downvote').click(function(e){
	e.stopPropagation();
	if($('#logged_in').text() == 1){
		var downvote_id = $(this).attr('id');
		var chat_id = $(this).attr('id').replace('downvote_','');
		var url = '//mutualcog.com/chat/downvote';
		var votes = parseInt($('#votes_' + chat_id).text());
		if($('#downvote_' + chat_id).hasClass('red_color')){
			$('#upvote_' + chat_id).removeClass('green_color');
			$('#downvote_' + chat_id).removeClass('red_color');
			$('#votes_' + chat_id).text(votes + 1);
		}else if($('#upvote_' + chat_id).hasClass('green_color')){
			$('#upvote_' + chat_id).removeClass('green_color');
			$('#downvote_' + chat_id).addClass('red_color');
			$('#votes_' + chat_id).text(votes - 2);
		}else{
			$('#upvote_' + chat_id).removeClass('green_color');
			$('#downvote_' + chat_id).addClass('red_color');
			$('#votes_' + chat_id).text(votes - 1);
		}
		$.ajax({
			type:'POST',
			data:{id:chat_id},
			url:url,
			success:function(hresp){
				if(hresp.status == 1 || hresp.status == 3){
					$('#votes_' + chat_id).text(hresp.upvotes);
					$('#upvote_' + chat_id).removeClass('green_color');
					$('#downvote_' + chat_id).addClass('red_color');
				}else if(hresp.status == 2){
					$('#votes_' + chat_id).text(hresp.upvotes);
					$('#upvote_' + chat_id).removeClass('green_color');
					$('#downvote_' + chat_id).removeClass('red_color');
				}else{
					$('#reg_modal_title').text('Sign up to upvote/downvote');
					$('#register_modal').modal();	
				}
			},
			error:function(){ }
		});
	}else{
		$('#reg_modal_title').text('Sign up to upvote/downvote');
		$('#register_modal').modal();	
	}
});

$('.entry_search_submit').click(function(){
	if(selected_term == -1 && $('#search_input').val().length == 0){
		return false;
	}else if(selected_term == -1 && $('#search_input').val().length > 0){
		window.location.href = '//mutualcog.com/search/result/' + $('#search_input').val();
	}else{
		location.assign($('li#search_' + selected_term).children('a').attr('href'));
	}	
	return false;
});

$('#request_friend').click(function(){
	if($('#logged_in').text() == 1){
		module.socket.emit('request_friend',{user_id:$(this).attr('data-user-id'),user:$(this).attr('data-user-name'),sender_id:module.user_id,sender:module.user_tracker});
		$(this).removeClass('btn-primary');
		$(this).addClass('btn-success');
		$(this).html('<div class="glyphicon glyphicon-check" id="request_glyph"></div> Request Sent');
		$(this).off('click');
	}else{
		$('#reg_modal_title').text('Sign up to add friends');
		$('#register_modal').modal();	
		return false;
	}
});
$('.mobile_show_friend_requests').click(function(){
	$(this).css('background-color','#ddd');
	$('.mobile_show_mssg_requests').css('background-color','');
	$('.mobile_show_global_requests').css('background-color','');
	$('.mobile_mssg_requests').hide();
	$('.mobile_global_requests').hide();
	$('.mobile_friend_requests').show('slide');
});
$('.mobile_show_mssg_requests').click(function(){
	$(this).css('background-color','#ddd');
	$('.mobile_show_friend_requests').css('background-color','');
	$('.mobile_show_global_requests').css('background-color','');
	$('.mobile_friend_requests').hide();
	$('.mobile_global_requests').hide();
	$('.mobile_mssg_requests').show('slide');
});
$('.mobile_show_global_requests').click(function(){
	$(this).css('background-color','#ddd');
	$('.mobile_show_friend_requests').css('background-color','');
	$('.mobile_show_mssg_requests').css('background-color','');
	$('.mobile_mssg_requests').hide();
	$('.mobile_friend_requests').hide();
	$('.mobile_global_requests').show('slide');
});
$('.mobile_show_friends').click(function(){
	$(this).css('background-color','#ddd');
	$('.mobile_show_open_pms').css('background-color','');
	$('.mobile_pms').hide();
	$('.mobile_friend_list').show('slide');
});
$('.mobile_show_open_pms').click(function(){
	$(this).css('background-color','#ddd');
	$('.mobile_show_friends').css('background-color','');
	$('.mobile_friend_list').hide();
	$('.mobile_pms').show('slide');
});
$('#show_mobile_pms').click(function(){
	if($('#mobile_pms_cont').css('display') == 'none'){
		$(this).addClass('highlight_blue_background');
		$('#show_mobile_notifications').removeClass('highlight_blue_background');
	}else{
		$(this).removeClass('highlight_blue_background');
	}
	$('#mobile_pms_cont').toggle('blind',function(){
		var c1 = $('.big_content_box').css('display') == 'none';
		var c2 = $('#mobile_pms_cont').css('display') == 'none';
		if(c1 && c2){
			$('.big_content_box').show('blind');
		}else if((c1 && !c2) || (c2 && !c1)){
		}else{
			$('.big_content_box').hide('blind');
		}
	});
	$('#mobile_notifications_cont').hide();
});
$('#show_mobile_notifications').click(function(){
	if($('#mobile_notifications_cont').css('display') == 'none'){
		$(this).addClass('highlight_blue_background');
		$('#show_mobile_pms').removeClass('highlight_blue_background');
	}else{
		$(this).removeClass('highlight_blue_background');
	}
	$('#mobile_notifications_cont').toggle('blind',function(){
		var c1 = $('.big_content_box').css('display') == 'none';
		var c2 = $('#mobile_notifications_cont').css('display') == 'none';
		if(c1 && c2){
			$('.big_content_box').show('blind');
		}else if((c1 && !c2) || (c2 && !c1)){
		}else{
			$('.big_content_box').hide('blind');
		}
	});
	$('#mobile_pms_cont').hide();
});
$('.register_link').click(function(){
	$('#reg_modal_title').text('Create an account');
});
$('.show_friends').click(function(){
	$('.left_menu_toggle').html('Friends <strong class="caret" style="color:white;"></strong>');
	$('.show_subscriptions').show();
	$('.show_recent').show();
	$('#friend_box_cont').show('slide');
	$('#subscription_cont').hide();
	$('#recent_cont').hide();
	$(this).hide();
	$.ajax({
		type:'GET',
		data:{status:0},
		url:'//mutualcog.com/profile/set-status/' + module.user_id,
		success:function(){	
		}
	});
});
$('.show_subscriptions').click(function(){
	$('.left_menu_toggle').html('Subscriptions <strong class="caret" style="color:white;"></strong>');
	$('.show_friends').show();
	$('.show_recent').show();
	$('#friend_box_cont').hide();
	$('#recent_cont').hide();
	$('#subscription_cont').show('slide');
	$(this).hide();
	$.ajax({
		type:'GET',
		data:{status:1},
		url:'//mutualcog.com/profile/set-status/' + module.user_id,
		success:function(){	
		}
	});
});
$('.show_recent').click(function(){
	$('.left_menu_toggle').html('Recent <strong class="caret" style="color:white;"></strong>');
	$('.show_subscriptions').show();
	$('.show_friends').show();
	$('#friend_box_cont').hide();
	$('#subscription_cont').hide();
	$('#recent_cont').show('slide');
	$(this).hide();
	$.ajax({
		type:'GET',
		data:{status:2},
		url:'//mutualcog.com/profile/set-status/' + module.user_id,
		success:function(){	
		}
	});
});
$('body').on('click','.toggle_responses',getResponses);
$('.static_chat_content').on('click','.toggle_responses',getStaticResponses);
$('.request_btn').on('click',function(){  //TODO complete seen notification func
	
});
$('.pm_bar').on('click','.pm_name',function(e){
	e.stopPropagation();
});
$('.toggle_search').click(function(){
	if($('.community_search').css('display') == 'none'){
		$('.community_search_expand').css('display','none');
		$('.community_search_collapse').css('display','');
		$('.community_input').width($('#welcome_user').width() - 34);
		$('.community_input').attr('placeholder',module.search_messages[randomInt(0,module.search_messages.length - 1)]);
		$('.nav_pad_r').css('padding-right',$('#welcome_user').width() + 100);
		$('.community_search').show('slide',{direction:'right'});
	}else{
		$('.community_search_expand').css('display','');
		$('.community_search_collapse').css('display','none');
		$('.community_search').hide('slide',{direction:'right'},function(){
			$('.nav_pad_r').css('padding-right',$('.community_search_cont').width());
		});
	}
	$('.community_input').focus();
});
$('#community_dropdown').on('click','.search_link',function(){
	$('#keywords_modal').modal();
	return false;
});	
$('#main').on('click','.edit_chat_link',function(e){
	var cont = $(this).parents('.chat_title_box');
	$('#Title_v3').val(cont.find('.chat_title_str').text());
	$('#Link_v3').val(cont.find('.chat_link_str').text());
	$('#Communities_v3').val(cont.find('.chat_community_str').text());
	$('#description_v3').val(cont.find('.chat_desc_str').text());
	$('#form_chat_id').val(cont.find('.chat_id_str').text());
	if(cont.find('.chat_live_str').text() == 1){
		$('#live_status_v3').attr('checked',true);
	}else{
		$('#live_status_v3').attr('checked',false);
	}
	if(cont.find('.chat_nsfw_str').text() == 1){
		$('#nsfw_v3').attr('checked',true);
	}else{
		$('#nsfw_v3').attr('checked',false);
	}
	$('#edit_modal').modal();
	return false;
});
$('#side').on('click','.edit_chat_link',function(e){
	var cont = $(this).parent();
	$('#Title_v3').val(cont.find('.chat_title_str').text());
	$('#Link_v3').val(cont.find('.chat_link_str').text());
	$('#Communities_v3').val(cont.find('.chat_community_str').text());
	$('#description_v3').val(cont.find('.chat_desc_str').text());
	$('#form_chat_id').val(cont.find('.chat_id_str').text());
	if(cont.find('.chat_live_str').text() == 1){
		$('#live_status_v3').attr('checked',true);
	}else{
		$('#live_status_v3').attr('checked',false);
	}
	if(cont.find('.chat_nsfw_str').text() == 1){
		$('#nsfw_v3').attr('checked',true);
	}else{
		$('#nsfw_v3').attr('checked',false);
	}
	$('#edit_modal').modal();
	return false;
});
$('#chat_messages').click(function(){
	if(module.scroll_mod_active == 0){
		if(module.stop_scroll == 1){
			$('.stop_scroll').removeClass('highlight_red');	
			$('.stop_scroll').attr('data-original-title','Stop scrollbar');
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
		$('.permalink').attr('data-page-link',permalink);
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
$('.permalink').click(function(e){
	window.location.href = $(this).attr('data-page-link'); 
});
$('#message').click(function(){
	$('.enter_hint').text("");
	$('.response_hint').text("");
	$(this).text("");
});

$(window).on('click',function(e){
	$('#community_dropdown').hide();
});

$('.show_users').click(function(e){
	var chat_id = $(this).attr('data-chat-id');
	$.ajax({
		type:'GET',
		url:'//mutualcog.com/chat/chat-users',
		data:{chat_id:chat_id},
		success:function(hresp){
			var members = '';
			$.each(hresp,function(index,val){
				if(index == hresp.length - 1){
					members += '<div class="chat_member">';
				}else{
					members += '<div class="chat_member light_divider_bottom">';
				}
				if(val.pivot.active == '1'){
					members += '<a class="dark_link" href="//mutualcog.com/u/' + val.name + '">' + val.name + '</a>';
				}else{
					members += '<a class="grey_link" href="//mutualcog.com/u/' + val.name + '">' + val.name + '</a>';
				}
				if(val.id != module.user_id){
					members += '<button class="btn btn-primary pull-right" style="margin-top:-6px;" id="request_friend" data-user-id="' + val.id + '" data-user-name="' + val.name + '"><div class="glyphicon glyphicon-plus" id="request_glyph"> </div> Friend</button>';
				}
				if(val.id != module.user_id && (module.user_tracker == $('#chat_admin').attr('data-admin-name') || module.serial_tracker == $('#chat_admin').attr('data-admin-name')) && val.pivot.is_mod == '0'){
					members += '<button class="btn btn-default pull-right mod_user" id="mod_user_' + val.id + '" style="margin-top:-6px;margin-right:5px;" data-user-id="' + val.id + '" data-user-name="' + val.name + '" data-is-mod="0"><div class="glyphicon glyphicon-tower"> </div> Mod</button>';
				}else if(val.id != module.user_id && (module.user_tracker == $('#chat_admin').attr('data-admin-name') || module.serial_tracker == $('#chat_admin').attr('data-admin-name')) && val.pivot.is_mod == '1'){
					members += '<button class="btn btn-default pull-right mod_user" id="mod_user_' + val.id + '" style="margin-top:-6px;margin-right:5px;" data-user-id="' + val.id + '" data-user-name="' + val.name + '" data-is-mod="1"><div class="glyphicon glyphicon-tower"> </div> Unmod</button>';
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
$('.pause_chat').click(function(){
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
$('.warn_user').click(function(){
	var user = $('#mssg_cont_' + module.clicked_on).find('.mssg_op').attr('data-author');
	if(user == module.user_tracker || module.clicked_on == -1){
		return false;
	}else{
		module.socket.emit('warn',{user:user});
	}
});
$('.kick_user').click(function(){
	var user = $('#mssg_cont_' + module.clicked_on).find('.mssg_op').attr('data-author');
	if(user == module.user_tracker || module.clicked_on == -1){
		return false;
	}else{
		module.socket.emit('kick',{user:user});
	}
});
$('.stop_scroll').click(function(){
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
$('.chat_member_cont').on('click','.mod_user',function(){
	var chat_id = $('#show_users').attr('data-chat-id');
	module.socket.emit('mod_user',{id:$(this).attr('data-user-id'),chat_id:chat_id,name:$(this).attr('data-user-name'),is_mod:$(this).attr('data-is-mod')},function(info){
		if(info.is_mod == '0'){
			$('#mod_user_' + info.user_id).html('<div class="glyphicon glyphicon-tower"> </div> Unmod');
			$('#mod_user_' + info.user_id).attr('data-is-mod','1');
		}else{
			$('#mod_user_' + info.user_id).html('<div class="glyphicon glyphicon-tower"> </div> Mod');
			$('#mod_user_' + info.user_id).attr('data-is-mod','0');
		}
	});
});
$('.chat_content').on('click','.mssg_icon',deleteIt);
$('.static_chat_content').on('click','.mssg_icon',deleteIt);
$('body').on('click','.p_chat_mssg',function(){
	var chat_id = $(this).find('.p_mssg_body').attr('class').split(' ')[0].split('_')[2];
	var mssg_id = $(this).attr('id');
	window.location.href = '//mutualcog.com/chat/static/' + chat_id + '/' + mssg_id;
});
$('#message_user_form').submit(function(){
	if($(this).find('#message_body').val() != ''){
		$(this).attr('action',$(this).attr('action') + $('.profile_name').attr('id')); 
		return true;
	}else{
		return false;
	}
});
$('#main').on('click','.toggle_description',function(){
	var descr = $(this).parent().parent().find('.description_cont');
	if(descr.css('display') == 'none'){
		$(this).html('Hide description'); 
		descr.css('display','block');
	}else{
		$(this).html('Show description'); 
		descr.css('display','none');
	}
	return false;
});	
$('.load_more').on('click',function(){
	var url = $(this).attr('href');
	var cont = $(this).parent();
	var $this = $(this);
	$.ajax({
		type:'GET',
		url:url,
		success:function(hresp){
			var res_len = hresp.length;
			var upvoted = hresp.upvoted;
			var downvoted = hresp.downvoted;
			var prev_y = 0;
			delete hresp['upvoted'];
			delete hresp['downvoted']
			$this.remove();
			var res = '';
			$.each(hresp,function(index,val){
				res += '<div class="response_to_' + val.responseto + ' static_mssg_cont y_' + val.y_dim + ' parent_' + val.parent + ' pad_l_10" id="static_mssg_cont_' + val.id + '">';
				res += '<div class="static_mssg_cont_inner"><div class="static_mssg js_mssg" id="message_' + val.id + '"> <div class="row" style="margin:0;"> <div class="mssg_body_cont"> <div class="static_vote_box">';
				if(upvoted.indexOf(val.id) != -1){
					res += '<span class="glyphicon glyphicon-chevron-up js_mssg_upvote static_mssg_upvote" id="mssg_upvote_' + val.id + '" style="color:#57bf4b" data-toggle="tooltip" data-original-title="You must be logged in to vote on responses" data-container="body" data-placement="top"></span> <div class="upvote_count" id="mssg_votes_' + val.id + '">' + (val.upvotes - val.downvotes) + '</div> <span class="glyphicon glyphicon-chevron-down js_mssg_downvote static_mssg_downvote" id="mssg_downvote_' + val.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on responses" data-container="body" data-placement="bottom"></span></div>';
				}else if(downvoted.indexOf(val.id) != -1){
					res += '<span class="glyphicon glyphicon-chevron-up js_mssg_upvote static_mssg_upvote" id="mssg_upvote_' + val.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on responses" data-container="body" data-placement="top"></span> <div class="upvote_count" id="mssg_votes_' + val.id + '">' + (val.upvotes - val.downvotes) + '</div> <span class="glyphicon glyphicon-chevron-down js_mssg_downvote static_mssg_downvote" id="mssg_downvote_' + val.id + '" style="color:red;" data-toggle="tooltip" data-original-title="You must be logged in to vote on responses" data-container="body" data-placement="bottom"></span></div>';
				}else{
					res += '<span class="glyphicon glyphicon-chevron-up js_mssg_upvote static_mssg_upvote" id="mssg_upvote_' + val.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on responses" data-container="body" data-placement="top"></span> <div class="upvote_count" id="mssg_votes_' + val.id + '">' + (val.upvotes - val.downvotes) + '</div> <span class="glyphicon glyphicon-chevron-down js_mssg_downvote static_mssg_downvote" id="mssg_downvote_' + val.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on responses" data-container="body" data-placement="bottom"></span></div>';
				}
				res += '<div class="static_mssg_body js_mssg_body author_' + val.author + '">';
				res += '<div id="toggle_' + val.id + '" class="toggle_responses"> <span class="caret caret_tooltip" id="caret_' + val.id + '" data-toggle="tooltip" data-original-title="Hide Responses" data-container="body" data-placement="top"></span> </div>';
				if(val.message != 'This response has been deleted' && (module.serial_tracker == val.author || module.user_tracker == val.author)){
					res += '<span id="remove_' + val.id + '" class="glyphicon glyphicon-remove mssg_icon" data-mssg-serial="' + val.serial + '" style="margin-right:5px;" data-toggle="tooltip" title="Delete post" data-container="body" data-placement="top"></span>';	
				}
				if(val.author == $('#chat_admin_info').text()){
					res += '<span class="glyphicon glyphicon-star"></span>';	
				}
				res += '<strong class="mssg_op" data-author="' + val.author + '" style="color:' + module.color_arr[val.serial % 7] + '"> ' + val.author + ' (<span class="response_count" id="' + val.id + '">' + val.responses + '</span>)</strong> : ' + val.message;
				res += '<div class="time_box">';
				if($('.chat_status_indicator').hasClass('glyphicon-pause')){
					res += '<div class="static_reply"><a href="#" class="reply_link" data-mssg-id="' + val.id + '"><strong>Reply</strong></a></div>';
				}
				res += '<div class="time" id="' + val.created_at + '" title="' + val.created_at + ' UTC">' + moment.utc(val.created_at).fromNow() + '</div></div>';
				res += '</div></div></div></div>';
				if(val.responses == 0){
					if(val.y_dim == prev_y || index == 0){
						res += '</div></div>';
					}else{
						for(var i = 0;i < prev_y - val.y_dim;i++){
							res += '</div></div>';
						}
					}
				}
				prev_y = val.y_dim;
			});
			cont.append(res);
		},
		error:function(){}
	});
	return false;
});
$('#side').on('click','#subscribe_btn',function(){
	if($('#logged_in').text() == 1){
		return true;
	}else{
		$('#reg_modal_title').text('Sign up to subscribe to communities');
		$('#register_modal').modal();	
		return false;
	}
});
$('button#message_friend').click(function(){
	if($('#logged_in').text() == 1){
		return true;
	}else{
		$('#reg_modal_title').text('Sign up to message users');
		$('#register_modal').modal();	
		return false;
	}
});
$('#create_community').click(function(){
	if($('#logged_in').text() == 1){
		return true;
	}else{
		$('#reg_modal_title').text('Sign up to create communities');
		$('#register_modal').modal();	
		return false;
	}
});
$('#side').on('click','#community_edit',function(e){
	var community_cont = $(this).parents('.side_content');
	$('#input_community_id').val(community_cont.find('#community_id_str').text());
	$('#edit_community_info').val(community_cont.find('#community_info_str').text());
	$('#input_community_desc').val(community_cont.find('#community_desc_str').text());
	$('#community_edit_modal').modal();
	return false;
});
$('#mobile_community_edit').click(function(e){
	var community_cont = $('#community_edit').parents('.side_content');
	$('#input_community_id').val(community_cont.find('#community_id_str').text());
	$('#edit_community_info').val(community_cont.find('#community_info_str').text());
	$('#input_community_desc').val(community_cont.find('#community_desc_str').text());
	$('#community_edit_modal').modal();
	return false;
});
$('.remove_mod').click(function(e){
	var community_id = $(this).attr('id').split('_')[3];
	var user_id = $(this).attr('id').split('_')[2];
	window.location.href = '//mutualcog.com/community/remove-mod/' + user_id + '/' + community_id; 
});
$('#main').on('click','.remove_chat_link',function(e){
	$('#remove_modal').modal();
	$('#remove_chat_final').attr('href',$(this).attr('data-remove-link'));
	return false;
});
$('.reply_link').on('click',function(){
	var reply_form = $('#reply_form').clone();
	if(!$('#message_' + $(this).attr('data-mssg-id')).find('#reply_form_' + $(this).attr('data-mssg-id')).length){
		$(this).html('<strong>Cancel</strong>');
		reply_form = $('#reply_form').clone();
		$('#message_' + $(this).attr('data-mssg-id')).append(reply_form);	
		$('#message_' + $(this).attr('data-mssg-id')).find('#reply_form').attr('id','reply_form_' + $(this).attr('data-mssg-id'));	
		$('#reply_form_' + $(this).attr('data-mssg-id')).children('#reply_to').val($(this).attr('data-mssg-id'));
	}else{
		$('#message_' + $(this).attr('data-mssg-id')).find('#reply_form_' + $(this).attr('data-mssg-id')).toggle();	
		if($(this).children().text() == 'Reply'){
			$(this).children().text('Cancel');
		}else{
			$(this).children().text('Reply');
		}
	}
	return false;
});
