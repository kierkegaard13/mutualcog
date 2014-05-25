module = function(){
	var socket = io.connect('http://localhost:3000/',{query:"sid=" + $('#sid').attr('data-sid') + "&serial=" + $('#serial_tracker').text()});
	var serial_id = $('#serial_id').text();
	var serial_tracker = $('#serial_tracker').text();
	var user_id = $('#user_id').text();
	var user_tracker = $('#user_tracker').text();
	return {socket:socket,serial_id:serial_id,serial_tracker:serial_tracker,user_id:user_id,user_tracker:user_tracker};
}(); 

var selected_tag = -1;

updateChatTimes = function(){
	$.each($('.chat_time'),function(index,value){
		$(this).text(moment.utc($(this).attr('id')).fromNow());
	});
	if($('.last_login').length){
		$('.last_login').html('<strong>Last login: </strong>' + moment.utc($('.last_login').attr('id')).fromNow());
	}
}

updateTimes = function(){
	$.each($('.time'),function(index,value){
		$(this).text(moment.utc($(this).attr('id')).fromNow());
	});
}

$(document).ready(function(){
	updateChatTimes();
	updateTimes();
	setInterval(updateTimes,60000);
	setInterval(updateChatTimes,60000);
	$('.chat_status_indicator').tooltip();
	$('.advanced_cog').tooltip();
	$('#pause_chat').tooltip();
	$('.mssg_upvote').on('click',upvoteMssg);
	$('.mssg_downvote').on('click',downvoteMssg);
	$('#mssg_requests').popover({html:true});
	$('#global_requests').popover({html:true});
	$('#friend_requests').popover({html:true});
	$('#user_props').change(function(){
		module.socket.emit('change_user_props',{props:$(this).val()});
	});
	$('body').on('click','.pm_remove',function(){
		$(this).parent().parent().remove();
		return false;
	});
	$('body').on('click','.friend_box',function(){
		var friend_name = $(this).attr('id').replace('friend_box_for_','');
		var friend_id = $(this).attr('data-friend-id');
		var pm_id = $(this).attr('data-pm-chat-id');
		var friend_status_class = $(this).find('#' + friend_name + '_status').attr('class').replace('friend_status','');
		if($('#pm_' + friend_name).length == 0){
			module.socket.emit('join_pm',{friend_id:friend_id,pm_id:pm_id});
			var chat_box = '<div class="pm_cont" id="' + 'pm_' + friend_name + '">';
			chat_box += '<div class="pm_header"><div class="' + friend_status_class + ' pm_status"></div><div class="glyphicon glyphicon-remove pm_remove"></div><div class="pm_name">' + friend_name + '</div></div>';
			chat_box += '<div class="pm_body"></div>';
			chat_box += '<textarea class="pm_text"></textarea>';
			chat_box += '</div>'; 
			$('.pm_bar').append(chat_box);
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
		if($(this).parent().find('.pm_body').css('display') == 'none'){
			$(this).parent().resizable('enable');
			$(this).parent().find('.pm_body').css('display','');
			$(this).parent().find('.pm_text').css('display','');
		}else{
			if($(this).parent().css('height') != ''){
				$(this).parent().attr('data-expanded-height',$(this).parent().css('height'));
				$(this).parent().css('height','');
			}
			$(this).parent().resizable('disable');
			$(this).parent().find('.pm_body').css('display','none');
			$(this).parent().find('.pm_text').css('display','none');
		}
	});
	var reply_form = $('#reply_form').clone();;
	$('#request_friend').click(function(){
		module.socket.emit('request_friend',{user_id:$(this).attr('data-user-id'),user:$(this).attr('data-user-name'),sender_id:module.user_id,sender:module.user_tracker});
		$(this).removeClass('btn-primary');
		$(this).addClass('btn-success');
		$(this).html('<div class="glyphicon glyphicon-check" id="request_glyph"></div> Request Sent');
		$(this).off('click');
	});
	$('a#advanced_create').click(function(e){
		$('#advanced_modal').modal();
		return false;
	});
	$('.reply_link').on('click',function(){
		if(!$('#message_' + $(this).attr('data-mssg-id')).find('#reply_form_' + $(this).attr('data-mssg-id')).length){
			$(this).html('<strong>Cancel</strong>');
			$('#message_' + $(this).attr('data-mssg-id')).append(reply_form);	
			$('#message_' + $(this).attr('data-mssg-id')).find('#reply_form').attr('id','reply_form_' + $(this).attr('data-mssg-id'));	
			$('#reply_form_' + $(this).attr('data-mssg-id')).children('#reply_to').val($(this).attr('data-mssg-id'));
			reply_form = $('#reply_form').clone();
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
	$('#mssg_requests').blur(function(){
		$(this).popover('hide');
	});
	$('#global_requests').blur(function(){
		$(this).popover('hide');
	});
	$('#friend_requests').blur(function(){
		$(this).popover('hide');
	});
});


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
		console.log(response);
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

function cookiesEnabled() {
	var cookieEnabled = navigator.cookieEnabled;

	if (cookieEnabled === false) {
		return false;
	}

	if (!document.cookie && (cookieEnabled === null || /*@cc_on!@*/false))
	{
		document.cookie = "testcookie=1";

		if (!document.cookie) {
			return false;
		} else {
			document.cookie = "testcookie=; expires=" + new Date(0).toUTCString();
		}
	}

	return true;
}

$('#home_form').submit(function(){
	if(cookiesEnabled()){
		var submit = 1;
		var title = $('#Title').val();
		var tags = $('#Tags').val();
		$('.form_error').hide();
		$('.form-group').attr('class','form-group');
		if(title.length < 3 || title.length > 180){
			$('#Title').attr('data-original-title','Title must be longer than 2 characters but less than 180');
			$('#Title').tooltip('show');
			$('#title_group').attr('class','form-group has-error');
			submit = 0;
		}
		if(tags.split(' ')[0] == "" || tags.split(' ').length > 5){
			$('#tags_group').attr('class','form-group has-error');		
			$('#Tags').attr('data-original-title','Must have at least 1 tag but less than 6');
			$('#Tags').tooltip({placement:'left',trigger:'focus'});
			$('#Tags').tooltip('show');
			submit = 0;
		}else{
			tags = tags.split(' ');
			$.each(tags,function(index,value){
				value = value.substr(1);
				if((value.length < 3 || value.length > 19) && value.length != 0){
					$('#tags_group').attr('class','form-group has-error');
					$('#Tags').attr('data-original-title','Tags must be longer than 2 characters but less than 20');
					$('#Tags').tooltip({placement:'left',trigger:'focus'});
					$('#Tags').tooltip('show');
					submit = 0;
					return false;
				}
			});
		}
		if(submit){
			$('#home_form').append('<input type="hidden" name="js_key" value="js_enabled" id="js_key">');
			return true;
		}else{
			return false;
		}
	}else{
		$('#Title').attr('data-original-title','You must enable cookies to post chats');
		$('#Title').tooltip('show');
		return false;
	}
});

$('#home_form_v2').submit(function(){
	if(cookiesEnabled()){
		var submit = 1;
		var title = $('#Title_v2').val();
		var tags = $('#Tags_v2').val();
		$('.form_error').hide();
		$('.form-group').attr('class','form-group');
		if(title.length < 3 || title.length > 180){
			$('#Title_v2').attr('data-original-title','Title must be longer than 2 characters but less than 180');
			$('#Title_v2').tooltip('show');
			$('#title_group_v2').attr('class','form-group has-error');
			submit = 0;
		}
		if(tags.split(' ')[0] == "" || tags.split(' ').length > 5){
			$('#tags_group_v2').attr('class','form-group has-error');		
			$('#Tags_v2').attr('data-original-title','Must have at least 1 tag but less than 6');
			$('#Tags_v2').tooltip({placement:'bottom',trigger:'focus'});
			$('#Tags_v2').tooltip('show');
			submit = 0;
		}else{
			tags = tags.split(' ');
			$.each(tags,function(index,value){
				value = value.substr(1);
				if((value.length < 3 || value.length > 19) && value.length != 0){
					$('#tags_group_v2').attr('class','form-group has-error');
					$('#Tags_v2').attr('data-original-title','Tags must be longer than 2 characters but less than 20');
					$('#Tags_v2').tooltip({placement:'bottom',trigger:'focus'});
					$('#Tags_v2').tooltip('show');
					submit = 0;
					return false;
				}
			});
		}
		if(submit){
			$('#home_form_v2').append('<input type="hidden" name="js_key" value="js_enabled" id="js_key">');
			return true;
		}else{
			return false;
		}
	}else{
		$('#Title').attr('data-original-title','You must enable cookies to post chats');
		$('#Title').tooltip('show');
		return false;
	}
});

$('.big_upvote').click(function(e){
	e.stopPropagation();
	var upvote_id = $(this).attr('id');
	var chat_id = $(this).attr('id').replace('upvote_','');
	var url = '//mutualcog.com/chat/upvote';
	$.ajax({
		type:'POST',
		data:{id:chat_id},
		url:url,
		success:function(hresp){
			if(hresp.status == 1 || hresp.status == 3){
				$('#votes_' + chat_id).text(hresp.upvotes);
				$('#upvote_' + chat_id).css('color','#57bf4b');
				$('#downvote_' + chat_id).css('color','');
			}else if(hresp.status == 2){
				$('#votes_' + chat_id).text(hresp.upvotes);
				$('#upvote_' + chat_id).css('color','');
				$('#downvote_' + chat_id).css('color','');
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
	var chat_id = $(this).attr('id').replace('downvote_','');
	var url = '//mutualcog.com/chat/downvote';
	$.ajax({
		type:'POST',
		data:{id:chat_id},
		url:url,
		success:function(hresp){
			if(hresp.status == 1 || hresp.status == 3){
				$('#votes_' + chat_id).text(hresp.upvotes);
				$('#downvote_' + chat_id).css('color','red');
				$('#upvote_' + chat_id).css('color','');
			}else if(hresp.status == 2){
				$('#votes_' + chat_id).text(hresp.upvotes);
				$('#upvote_' + chat_id).css('color','');
				$('#downvote_' + chat_id).css('color','');
			}else{
				$('#' + downvote_id).tooltip('show');
			}
		},
		error:function(){ }
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
				$('#mssg_upvote_' + message_id).css('color','#57bf4b');
				$('#mssg_downvote_' + message_id).css('color','');
				$('#mssg_votes_' + message_id).text(hresp.upvotes);
			}else if(hresp.status == 2){
				$('#mssg_upvote_' + message_id).css('color','');
				$('#mssg_downvote_' + message_id).css('color','');
				$('#mssg_votes_' + message_id).text(hresp.upvotes);
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
				$('#mssg_downvote_' + message_id).css('color','red');
				$('#mssg_upvote_' + message_id).css('color','');
				$('#mssg_votes_' + message_id).text(hresp.upvotes);
			}else if(hresp.status == 2){
				$('#mssg_upvote_' + message_id).css('color','');
				$('#mssg_downvote_' + message_id).css('color','');
				$('#mssg_votes_' + message_id).text(hresp.upvotes);
			}else{
				$('#mssg_downvote_' + message_id).tooltip('show');
			}
		},
		error:function(){ }
	});
};

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
			$('li#search_' + selected_term).css('background-color','#f5f5f5');
			
		}
		return false;
	}else if(e.keyCode == 40){  /*down arrow*/
		if(selected_term != $('#tag_dropdown').length){
			selected_term++;
			$('.tag_results').css('background-color','');
			$('li#search_' + selected_term).css('background-color','#f5f5f5');
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
						content += '<li id="search_' + index + '" class="tag_results"><a href="//mutualcog.com/t/' + value.name + '">' + value.name + '</a></li>';
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

$('.tags_input').on('keydown',function(e){
	if(e.keyCode == 13){  /*enter key*/
		if(selected_tag != -1){
			var curr_val = $(this).val().split(' ');
			curr_val.pop();
			curr_val.push('#' + $('.suggested_tags').eq(selected_tag).text());
			$(this).val(curr_val.join(' ') + ' #');
			$(this).focus();
			return false;		
		}
		return false;
	}else if(e.keyCode == 38){  /*up arrow*/
		if($('.popover').length != 0){
			if(selected_tag != 0){
				selected_tag -= 1;
				$('.suggested_tags').css('color','');
				$('.suggested_tags').eq(selected_tag).css('color','#57bf4b');
			}else{
				selected_tag = -1;
				$('.suggested_tags').css('color','');
			}
			return false;
		}
	}else if(e.keyCode == 40){  /*down arrow*/
		if($('.popover').length != 0){
			if(selected_tag != $('.suggested_tags').length - 1){
				selected_tag += 1;
				$('.suggested_tags').css('color','');
				$('.suggested_tags').eq(selected_tag).css('color','#57bf4b');
			}
			return false;
		}
	}
});

$('.tags_input').on('keyup',function(e){
	if(e.keyCode == 32){  /*space bar*/
		if($(this).val().length == 1){
			$(this).val('');
		}else{
			var tags = $(this).val().split(" ");
			var hashtags = new Array();
			$.each(tags,function(index,value){
				value = value.replace('#','');
				hashtags.push('#' + value);
			});
			$(this).val(hashtags.join(' '));
			$(this).popover('destroy');
			selected_tag = -1;
		}
	}else if(e.keyCode == 38 || e.keyCode == 40){
		/*up arrow or down arrow*/
	}else{
		var guess = $(this).val().split(' ');
		guess = guess.pop().replace('#','');
		if(guess.length > 2){
			var tags_input = $(this);
			$(this).on('blur',function(){
				if($('.popover').length){
					$(this).popover('hide');
				}
			});
			$.ajax({
				type:'GET',
				data: {tag:guess.slice(0,-1)},
				url:'//mutualcog.com/tags/similar-tag',
				success:function(hresp){
					var content = '';
					$.each(hresp,function(index,value){
						content += '<div class="suggested_tags" id="' + value.id + '">' + value.name + '</div>';
					});
					if($('.popover').length == 0){
						if(content){
							tags_input.popover({html:true});
							tags_input.attr('data-content',content);
							tags_input.popover('show');
							$('.suggested_tags').click(function(){
								var curr_val = $('.tags_input').val().split(' ');
								curr_val.pop();
								curr_val.push('#' + $(this).text());
								tags_input.val(curr_val.join(' ') + ' #');
								tags_input.focus();
								tags_input.popover('destroy');
								selected_tag = -1;
							});
							selected_tag = -1;
						}
					}else{
						if(content){
							if($('.popover-content').html() != content){
								$('.popover-content').html(content);
								selected_tag = -1;
								$('.suggested_tags').off('click');
								$('.suggested_tags').click(function(){
									var curr_val = $('.tags_input').val().split(' ');
									curr_val.pop();
									curr_val.push('#' + $(this).text());
									tags_input.val(curr_val.join(' ') + ' #');
									tags_input.focus();
									tags_input.popover('destroy');
									selected_tag = -1;
								});
							}
						}else{
							tags_input.popover('destroy');
							selected_tag = -1;
						}
					}
				},
				error:function(){
				}
			});
		}else{
			$(this).popover('destroy');
			selected_tag = -1;
		}
	}
});

