module = function(){
	var focused = live = scroll_mod_active = 1;
	var pm_info = '';
	var crit_len = new Array();
	var url_state = new Array();
	var pm_scroll_inactive = {};
	var url_state_pntr = -1;
	var tmp_mssg_cnt = title_blinking = chat_scroll_timer = typ_cnt = connected = recent = banned = stop_scroll = scroll_button_clicked = scroll_top = 0;
	var clicked_on = -1;
	if($('.chat_id').length){
		var chat_id = $('.chat_id').attr('id').replace('chat_','');
	}else{
		var chat_id = null;
	}
	if($('#up_arr').length){
		var upvoted = jQuery.parseJSON($('#up_arr').text());
		var downvoted = jQuery.parseJSON($('#down_arr').text());
	}
	if(typeof io !== 'undefined'){
		var socket = io('http://localhost:3000/');
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
	var search_messages = new Array("Use 'who like' to find users with certain interests","Use 'about' to find posts about a certain topic","Type 'here' to search current community","Use 'in' to search communities","Press enter for more results","Search for your interests or specific content");

	return {url_state_pntr:url_state_pntr,url_state:url_state,tmp_mssg_cnt:tmp_mssg_cnt,search_messages:search_messages,crit_len:crit_len,chat_scroll_timer:chat_scroll_timer,max_title_length:max_title_length,max_user_length:max_user_length,max_static_length:max_static_length,max_chat_mssg_length:max_chat_mssg_length,max_description_length:max_description_length,max_info_length:max_info_length,pm_scroll_inactive:pm_scroll_inactive,connected:connected,recent:recent,typ_cnt:typ_cnt,pm_info:pm_info,focused:focused,live:live,title_blinking:title_blinking,banned:banned,stop_scroll:stop_scroll,scroll_mod_active:scroll_mod_active,scroll_button_clicked:scroll_button_clicked,scroll_top:scroll_top,clicked_on:clicked_on,chat_id:chat_id,upvoted:upvoted,downvoted:downvoted,socket:socket,color_arr:color_arr,mems:mems,mods:mods,admin:admin,notifications_top_positions:notifications_top_positions,notifications_bottom_positions:notifications_bottom_positions,notifications_top_ids:notifications_top_ids,notifications_bottom_ids:notifications_bottom_ids,serial_id:serial_id,serial_tracker:serial_tracker,user_id:user_id,user_tracker:user_tracker};
}();

var selected_term = -1;
var keys = new Array();
var pm_keys = new Array();
var selected_community = -1;
var selected_mod = -1;
var selected_admin = -1;

$(window).resize(function(){
	if($(window).width() < 768){
		$('.nav_pad_r').css('padding-right','');
		$('.community_search').css('display','');
		$('#search_input').css('width','');
	}else{
		if($('.community_search').css('display') != 'none'){
			$('.community_input').width($('#welcome_user').width() - 54);
			if($('#logged_in').text() == 1){
				$('.nav_pad_r').css('padding-right',$('.community_search_cont').width() + 118);
			}else{
				$('.nav_pad_r').css('padding-right',$('.community_search_cont').width());
			}
		}
		$('.community_search').css('visibility','visible');
	}
	if($('.pm_bar').width() > $(window).width() - 30){
		module.crit_len.push($(window).width() + 30);
		$.each($('.pm_cont'),function(index,val){
			if($('.pm_cont').eq(index).css('display') != 'none'){
				$('.pm_cont').eq(index).css('display','none');
				$('.pm_cont').eq(index).css('visibility','hidden');
				var chat_box = $('.pm_cont').eq(index);
				var friend_id = chat_box.attr('id').split('_')[1];
				var pm_id = chat_box.attr('id').split('_')[2];
				var friend_status_class = chat_box.find('.pm_status').attr('class').split(' ')[0];
				var friend_name = chat_box.find('.pm_name').text();
				if($('.pm_list_footer').length == 0){
					$('.pm_bar').prepend('<div class="dropup pm_list_footer_cont"><div class="pm_list_footer dropdown-toggle" data-toggle="dropdown"><div class="glyphicon glyphicon-comment" style="color:white;float:left;"> ...</div></div><ul class="dropdown-menu pm_dropup" role="menu"><li id="switch_' + friend_id + '_' + pm_id + '"><a class="switch_pm" href="#" data-friend-id="' + friend_id + '" data-friend-name="' + friend_name + '" data-pm-id="' + pm_id + '" data-status="' + friend_status_class + '">' + friend_name + '</a></li></ul></div>');
				}else{
					$('.pm_dropup').prepend('<li id="switch_' + friend_id + '_' + pm_id + '"><a class="switch_pm" href="#" data-friend-id="' + friend_id + '" data-friend-name="' + friend_name + '" data-pm-id="' + pm_id + '" data-status="' + friend_status_class + '">' + friend_name + '</a></li>');
				}
				return false;
			}
		});
	}else if(((module.crit_len.length > 0 && $(window).width() > module.crit_len[module.crit_len.length - 1]) || (module.crit_len.length == 0 && $('.pm_bar').width() <= $(window).width() - 30)) && $('.pm_cont').eq(0).css('display') == 'none'){
		module.crit_len.pop();
		$.each($('.pm_cont'),function(index,val){
			if($('.pm_cont').eq(index).css('display') != 'none' && index > 0){
				var chat_box = $('.pm_cont').eq(index - 1);
				var friend_id = chat_box.attr('id').split('_')[1];
				var pm_id = chat_box.attr('id').split('_')[2];
				$('#switch_' + friend_id + '_' + pm_id).remove();
				if($('.pm_dropup').children().length == 0){
					$('.pm_list_footer_cont').remove();
				}
				$('.pm_cont').eq(index - 1).css('display','');
				$('.pm_cont').eq(index - 1).find('.pm_body').mCustomScrollbar('scrollTo','bottom',{scrollInertia:0});	
				window.setTimeout(function(){
					$('.pm_cont').eq(index - 1).css('visibility','');	
				},50);
			}else if(index == $('.pm_cont').length - 1){
				var chat_box = $('.pm_cont').eq(index);
				var friend_id = chat_box.attr('id').split('_')[1];
				var pm_id = chat_box.attr('id').split('_')[2];
				$('#switch_' + friend_id + '_' + pm_id).remove();
				if($('.pm_dropup').children().length == 0){
					$('.pm_list_footer_cont').remove();
				}
				$('.pm_cont').eq(index).css('display','');
				$('.pm_cont').eq(index).find('.pm_body').mCustomScrollbar('scrollTo','bottom',{scrollInertia:0});	
				window.setTimeout(function(){
					$('.pm_cont').eq(index).css('visibility','');	
				},50);
			}
		});
	}
});

$(document).ready(function(){
	startup();
	if(module.user_id.length){
		window.setInterval(function(){
			if(module.typ_cnt > 1){
				module.typ_cnt--;
			}else if(module.typ_cnt == 1){
				module.typ_cnt--;
				module.socket.emit('not_typing',{pm_id:module.pm_info[2],friend_id:module.pm_info[1],user_id:module.user_id});
			}
			if(module.recent == 120){
				$.ajax({
					type:'POST',
					data:{user_id:module.user_id},
					url:'//mutualcog.com/profile/update-online-status',
					success:function(){},
					error:function(){}	
				});
			}
			module.recent++;	
		},1000);
		$(window).on('mousemove',function(){
			if(module.recent > 120){
				module.socket.emit('seen_chats');
			}
			module.recent = 0;
		});
	}
	if($('.pm_body').length){
		if($('.pm_bar').width() > $(window).width() - 30){
			$.each($('.pm_cont'),function(index,val){
				$('.pm_cont').eq(index).css('display','none');
				$('.pm_cont').eq(index).removeClass('pm_visible');
				var chat_box = $('.pm_cont').eq(index);
				var friend_id = chat_box.attr('id').split('_')[1];
				var pm_id = chat_box.attr('id').split('_')[2];
				var friend_status_class = chat_box.find('.pm_status').attr('class').split(' ')[0];
				var friend_name = chat_box.find('.pm_name').text();
				if($('.pm_list_footer').length == 0){
					$('.pm_bar').prepend('<div class="dropup pm_list_footer_cont"><div class="pm_list_footer dropdown-toggle" data-toggle="dropdown"><div class="glyphicon glyphicon-comment" style="color:white;float:left;"> ...</div></div><ul class="dropdown-menu pm_dropup" role="menu"><li id="switch_' + friend_id + '_' + pm_id + '"><a class="switch_pm" href="#" data-friend-id="' + friend_id + '" data-friend-name="' + friend_name + '" data-pm-id="' + pm_id + '" data-status="' + friend_status_class + '">' + friend_name + '</a></li></ul></div>');
				}else{
					$('.pm_dropup').prepend('<li id="switch_' + friend_id + '_' + pm_id + '"><a class="switch_pm" href="#" data-friend-id="' + friend_id + '" data-friend-name="' + friend_name + '" data-pm-id="' + pm_id + '" data-status="' + friend_status_class + '">' + friend_name + '</a></li>');
				}
				if($('.pm_bar').width() <= $(window).width() - 30){
					return false;
				}
			});
		}
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
			$.each($('.pm_cont'),function(index,val){
				if(!$('.pm_cont').eq(index).hasClass('pm_visible')){
					$('.pm_cont').eq(index).addClass('pm_visible');
				}
			});
		},50);
	}
	updateTimes;
	window.setInterval(updateTimes,1000);
	$('#mssg_requests').popover({html:true});
	$('#global_requests').popover({html:true});
	$('#friend_requests').popover({html:true});
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
	if($(window).width() > 767){
		$('.community_search').hide();
		$('.community_search').css('visibility','visible');
	}
	$('.chat_main').mCustomScrollbar({theme:'minimal',scrollInertia:100,callbacks:{onScroll:function(){
		module.scroll_top = this.mcs.draggerTop;
		var scrollBottom = this.mcs.draggerTop + $('.chat_main').find('.mCSB_dragger').height();
		if(scrollBottom == $('.chat_main').height() - 4){
			module.stop_scroll = 0;
			module.scroll_mod_active = 1;
			$('.stop_scroll').removeClass('highlight_red');	
			$('.stop_scroll').attr('data-original-title','Stop scrollbar');
		}else if(scroll_mod_active){
			module.stop_scroll = 1;
			module.chat_scroll_timer = 10;
			if($('.stop_scroll').hasClass('highlight_red')){
			}else{
				$('.stop_scroll').addClass('highlight_red');
				$('.stop_scroll').attr('data-original-title','Resume scrolling');
			}	
		}
	}}});	
	window.setInterval(function(){
		if(module.chat_scroll_timer == 0){
			if(module.scroll_button_clicked == 0 && module.stop_scroll){
				$('.stop_scroll').removeClass('highlight_red');	
				$('.stop_scroll').attr('data-original-title','Stop scrollbar');
				module.stop_scroll = 0;
			}
		}else{
			module.chat_scroll_timer--;
		}
	},1000);
});

