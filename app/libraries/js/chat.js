var curr_request;
var focused = 1;
var title_blinking = 0;
var clicked_on = -1;
var mssg_clicked = -1;
var live = 1;
var chat_id = $('.chat_id').attr('id');
        
var socket = io.connect('http://localhost:3000/');

var stop_scroll = 0;

var color_arr = new Array('#228d49','#f52103','#2532f2','#f94f06','#5a24d9','#f8b92d','#38cedb','#000');
var mems = new Array();
var mods = new Array();
var admin = new Array();

var serial_id = $('#serial_id').text();
var serial_tracker = $('#serial_tracker').text();

var user_id = $('#user_id').text();
var user_tracker = $('#user_tracker').text();

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
                        url:'//mutualcog.com/profile/checkuser',
                        async:false,
                }).responseText;
		console.log(username);
		console.log(response);
		if(response == 1){
			var response = $.ajax({
				type:'GET',
				data:{username:username},
				url:'//mutualcog.com/profile/checkalpha',
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
			url:'//mutualcog.com/profile/checkcredentials',
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
	if(e.keyCode == 13){  //enter key
		if(selected_term == -1){
		}else{
			location.assign($('li#search_' + selected_term).children('a').attr('href'));
		}	
		return false;
	}else if(e.keyCode == 38){  //up arrow
		if(selected_term != 0){
			selected_term--;
			$('.tag_results').css('background-color','');
			$('li#search_' + selected_term).css('background-color','#f5f5f5');
			
		}
		return false;
	}else if(e.keyCode == 40){  //down arrow
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
	if(e.keyCode == 13){  //enter key
		return false;
	}else if(e.keyCode == 38 || e.keyCode == 40){  //up arrow or down arrow
	}else{
		if(tag.length > 2){
			$.ajax({
				type:'GET',
				data: {tag:tag},
				url:'//mutualcog.com/tags/similar-tag',
				success:function(hresp){
					var content = '';
					$.each(hresp,function(index,value){
						content += '<li id="search_' + index + '" class="tag_results"><a href="//mutualcog.com/tags/tag/' + value.name + '">' + value.name + '</a></li>';
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

$('button#add_details').click(function(){
	$(this).css('display','none');
	$('#curr_details').css('display','none');
	$('div#edit_details').css('display','');
});

$('button#save_details').click(function(){
	$('div#edit_details').css('display','none');
	$.ajax({
		type:'POST',
		data: {details:$('#detail_text').val(),id:$('.chat_id').attr('id')},
		url:'//mutualcog.com/chat/details',
		success:function(hresp){
			$('#curr_details').html(hresp);
			$('#curr_details').css('display','');
			$('button#add_details').css('display','');
		},
		error:function(){
		}
	});
});

$(window).on('blur',function(){
	focused = 0;
});

$(window).on('focus',function(){
	focused = 1;
});

updateChatTimes = function(){
	$.each($('.chat_time'),function(index,value){
		$(this).text(moment.utc($(this).attr('id')).fromNow());
	});
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
	$('#chat_messages').click(function(){
		$('#message').attr('class','global');
		$('.chat_mssg').css('background-color','');
		$('.chat_resp').css('background-color','');
		$('#mssg_cont_' + mssg_clicked).children('#resp_cont_' + mssg_clicked).remove();
		clicked_on = -1;
		socket.emit('leave_last_room');
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
	var showing = 0;
	var hovering = 0;
	$('#show_members').tooltip();
	$('#stop_scroll').tooltip();
	$('#pause_chat').tooltip();
	$('#mod_user').tooltip();
	$('#warn_user').tooltip();
	$('#kick_user').tooltip();
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
		if($(this).hasClass('pause')){  //if chat is not paused
			socket.emit('pause_all');
			$(this).removeClass('pause');
			$(this).removeClass('glyphicon-pause');
			$(this).addClass('glyphicon-play');	
			$(this).addClass('play');
			$(this).attr('data-original-title','Play chat');
		}else{  //if chat is already paused
			socket.emit('play_all');
			$(this).removeClass('play');
			$(this).removeClass('glyphicon-play');	
			$(this).addClass('glyphicon-pause');
			$(this).addClass('pause');
			$(this).attr('data-original-title','Pause chat');
		}
	});
	$('#mod_user').click(function(){
		var user = $('#mssg_cont_' + clicked_on).find('.mssg_op').attr('id');
		console.log(user);
		if(user == user_tracker || clicked_on == -1){
			return false;
		}else{
			$.ajax({
				type:'GET',
				url:'//mutualcog.com/chat/checkmod',
				data:{user:user,chat_id:chat_id},
				success:function(hresp){
					if(hresp == 0){
						socket.emit('make_mod',{user:user,chat_id:chat_id});
					}else{
						socket.emit('remove_mod',{user:user,chat_id:chat_id});
					}
				},
				error:function(){
				}
			});
		}
	});
});

deleteMessage = function(message_id) {
	socket.emit('delete_message',message_id);
};

deleteIt = function(e){
	e.stopPropagation();
	if($('#logged_in').text() == 1){
		deleteMessage({id:$(this).attr('id'),user:user_tracker,responses:$(this).parent().children('.mssg_op').children('.response_count').text()});
	}else{
		deleteMessage({id:$(this).attr('id'),user:serial_tracker,responses:$(this).parent().children('.mssg_op').children('.response_count').text()});
	}
};

socket.on('softDelete',function(mssg_info){
	if($('#' + mssg_info.id + '.chat_mssg').length){
		$('.mssg_icon').tooltip('hide');
		$('.mssg_icon').tooltip();
		$('#' + mssg_info.id + '.chat_mssg').html("<b class='mssg_op' id='" + mssg_info.user + "' style='color:" + color_arr[mssg_info.user % 7] + ";'>" + mssg_info.user + "(<span class='response_count' id='" + mssg_info.id + "'>" + mssg_info.responses + "</span>)</b> : <i>This message has been deleted</i>");
	}else{
		$('.resp_icon').tooltip('hide');
		$('.resp_icon').tooltip();
		$('#' + mssg_info.id + '.chat_resp').html("<b class='mssg_op' id='" + mssg_info.user + "' style='color:" + color_arr[mssg_info.user % 7] + ";'>" + mssg_info.user + "(<span class='response_count' id='" + mssg_info.id + "'>" + mssg_info.responses + "</span>)</b> : <i>This message has been deleted</i>");
	}
});

getResponse = function(e){
	e.stopPropagation();
	if($(this).attr('class') == 'chat_mssg'){
		mssg_clicked = $(this).attr('id');  //same as clicked_on far as I can tell. Only used on window event
	}
	if(clicked_on != $(this).attr('id')){  //if you clicked on a different message or response
		if(clicked_on != -1){  //if your previous click wasn't on the body
			var old_level = $('#mssg_cont_' + clicked_on).attr('class').split(" ")[1].replace('level_','');
			var new_level = $(this).parent().attr('class').split(" ")[1].replace('level_','');
			if(parseInt(new_level) == 0){  //if new message clicked on is top level, remove old messages responses
				if($('#mssg_cont_' + clicked_on).attr('class').split(" ")[2].replace('parent_','') == $(this).attr('id')){
					$('.level_' + (parseInt(new_level) + 2)).remove();
				}else{
					$('.level_' + (parseInt(new_level) + 1)).remove();
				}
			}else{
				if($(this).parents('.resp_cont').first().attr('id').replace('resp_cont_','') != clicked_on){ //if previous click wasn't the parent
					if($('#mssg_cont_' + clicked_on).parents('.level_' + new_level).first().attr('id') == $(this).parent().attr('id')){  
						$('.level_' + (parseInt(new_level) + 2)).remove();
					}else{
						$('.level_' + (parseInt(new_level) + 1)).remove();
					}
				}
			}
		}
		clicked_on = $(this).attr('id');
		socket.emit('show_responses',$(this).attr('id'));
		$('.chat_mssg').css('background-color','');
		$('.chat_resp').css('background-color','');
		$(this).css('background-color','#eee');
		$('#message').attr('class',$(this).attr('id'));
		if($('#message').text() != ""){
			$('#message').text("Press enter to respond to " + $(this).children().eq(0).children('.mssg_op').attr('id') + "\'s message");
		}else{
			$('#message').val("Press enter to respond to " + $(this).children().eq(0).children('.mssg_op').attr('id') + "\'s message");
			$('#message').on('click',function(){
				$(this).val("");
				$(this).off('click');
			});
		}
	}else{  //if you clicked on the same message
		if($('#mssg_cont_' + clicked_on).children('#resp_cont_' + clicked_on).length){  //either remove the responses
			$('#mssg_cont_' + clicked_on).children('#resp_cont_' + clicked_on).remove();
		}else{  //or show them again
			socket.emit('show_responses',$(this).attr('id'));
			$('.chat_mssg').css('background-color','');
			$('.chat_resp').css('background-color','');
			$(this).css('background-color','#eee');
			$('#message').attr('class',$(this).attr('id'));
			if($('#message').text() != ""){
				$('#message').text("Press enter to respond to " + $(this).children().eq(0).children('.mssg_op').attr('id') + "\'s message");
			}else{
				$('#message').val("Press enter to respond to " + $(this).children().eq(0).children('.mssg_op').attr('id') + "\'s message");
				$('#message').on('click',function(){
					$(this).val("");
					$(this).off('click');
				});
			}
		}
	}
};

scroll_mod = function(){
	stop_scroll = 1;
	window.setTimeout(function(){
		stop_scroll = 0;
	},10000);
};

blinkRed = function(message){
	if(message.css('background-color') == 'rgb(255, 255, 255)'){
		message.animate({backgroundColor:'#F5A9A9'},'slow');
	}else{
		message.animate({backgroundColor:'#fff'},'slow');
	}
	if(message.data('continue') == '1'){
		message.off('click');
		message.on('click',function(e){
			e.stopPropagation();
			$(this).data('continue','0');
			$(this).off('click');
			$(this).on('click',getResponse);
			message.trigger('click');
		});
	}
	setTimeout(function(){
		if(message.data('continue') == '1'){
			blinkRed(message);
		}else{
			message.off('click');
			message.on('click',getResponse);
			message.css('background-color','#eee');
		}
	},1000);
}

blinkRedv2 = function(message){
	if(message.css('background-color') == 'rgb(255, 255, 255)'){
		message.animate({backgroundColor:'#F5A9A9'},'slow');
	}else{
		message.animate({backgroundColor:'#fff'},'slow');
	}
	if(message.data('continue') == '1'){
		message.off('click');
		message.on('click',function(e){
			e.stopPropagation();
			$(this).data('continue','0');
			$(this).off('click');
			$(this).on('click',getNestedResponse);
			message.trigger('click');
		});
	}
	setTimeout(function(){
		if(message.data('continue') == '1'){
			blinkRedv2(message);
		}else{
			message.off('click');
			message.on('click',getNestedResponse);
			message.css('background-color','#eee');
		}
	},1000);
}

notifyMessage = function(){
	title_blinking = 1;
	setTimeout(function(){
		if(focused){
			$('title').html('Mutual Cognizance');
			title_blinking = 0;
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

socket.on('connect',function() {
	socket.emit('room',$('.chat_id').attr('id'));
	if($('#logged_in').text() == 1){
		socket.emit('add_member',{new_member:user_tracker,user_id:user_id,serial_id:serial_id,serial:serial_tracker,logged_in:1});
	}else{
		socket.emit('add_member',{new_member:serial_tracker,serial_id:serial_id,logged_in:0});
	}
});

socket.on('alertUserToResponse',function(info){
	if(!$('#' + info.resp_id + '.chat_resp').length){
		if($('#' + info.mssg_id + '.chat_mssg').length){
			$('#' + info.mssg_id + '.chat_mssg').data('continue','1');
			blinkRed($('#' + info.mssg_id + '.chat_mssg'));
		}else if($('#' + info.mssg_id + '.chat_resp').length){
			$('#' + info.mssg_id + '.chat_resp').data('continue','1');
			blinkRedv2($('#' + info.mssg_id + '.chat_resp'));
		}
	}
});

socket.on('updateResponseCount',function(info){
	$('#' + info.id + '.response_count').animate({color:'#57bf4b'},'slow');	
	$('#' + info.id + '.response_count').animate({color:'black'},'slow');	
	$('#' + info.id + '.response_count').text(info.count);
});

socket.on('displayMembers',function(info){
	mems = new Array();
	mods = new Array();
	admin = new Array();
	$.each(info,function(index,member){
		if(member.is_admin){
			admin.push(member.user);
			mems.push("<div style='color:white;'><span class='glyphicon glyphicon-star' style='margin-right:5px;'></span>" + member.user + "</div>");
		}else if(member.is_mod){
			mods.push(member.user);
			mems.push("<div style='color:white;'><span class='glyphicon glyphicon-tower' style='margin-right:5px;'></span>" + member.user + "</div>");
		}else{
			mems.push("<div style='color:white;'>" + member.user + "</div>");
		}
	});
	$('#members_list').html(mems.join(''));
});

socket.on('pause',function(security){
	live = 0;	
	$('#chat_display').append('<div class="chat_paused" id="paused_message">Chat has been paused</div>');
	$('#paused_message').show('fade','slow');
	socket.emit('pause',{hash:security.hash});
});

socket.on('play',function(security){
	live = 1;
	$('#paused_message').hide('fade','show',function(){
		$('#paused_message').remove();
	});
	socket.emit('play',{hash:security.hash});
});

socket.on('check_live',function(live){
	if(live == '1'){
		$('#paused_message').hide('fade','show',function(){
			$('#paused_message').remove();
		});
		if(!$('#pause_chat').hasClass('pause')){
			$('#pause_chat').removeClass('play');
			$('#pause_chat').removeClass('glyphicon-play');	
			$('#pause_chat').addClass('glyphicon-pause');
			$('#pause_chat').addClass('pause');
			$('#pause_chat').attr('data-original-title','Pause chat');
		}
	}else{
		live = 0;
		$('#chat_display').append('<div class="chat_paused" id="paused_message">Chat has been paused</div>');
		$('#paused_message').show('fade','show');
		if($('#pause_chat').hasClass('pause')){
			$('#pause_chat').removeClass('pause');
			$('#pause_chat').removeClass('glyphicon-pause');
			$('#pause_chat').addClass('glyphicon-play');	
			$('#pause_chat').addClass('play');
			$('#pause_chat').attr('data-original-title','Play chat');
		}
	}
	$('.mssg_icon').tooltip();
	$('.mssg_icon').on('click',deleteIt);
	$('.chat_mssg').on('click',getResponse);
	$('.chat_resp').on('click',getResponse);
	$('.chat_link').click(function(e){e.stopPropagation();});
	if(!stop_scroll){
		$('#chat_messages').off('scroll',scroll_mod);
		$('#chat_messages').scrollTop($('#chat_display').height());
		window.setTimeout(function(){
			$('#chat_messages').on('scroll',scroll_mod);
		},100);
	}
});

socket.on('openChat',function(chat_info){
	var chat_log = chat_info.rows;
	var messages = new Array();
	if($('#mssg_cont_' + clicked_on).parent('.resp_cont').length){  //gets responses that user is looking at
		var tmp_clicked = clicked_on;
		clicked_on = $('#mssg_cont_' + clicked_on).parents('.resp_cont').last().attr('id').replace('resp_cont_','');
		var responses = $('#mssg_cont_' + clicked_on).children('#resp_cont_' + clicked_on);
	}else{
		var responses = $('#mssg_cont_' + clicked_on).children('#resp_cont_' + clicked_on);
	}
	$.each(chat_log,function(index,value){
		var tmp = "<div class='mssg_cont level_" + value.level + " parent_" + value.parent + "' id='mssg_cont_" + value.id + "'><div class='chat_mssg' id='" + value.id + "'><div>";
		if((serial_tracker == value.author || $('#chat_admin').text() == serial_tracker || user_tracker == value.author || $('#chat_admin').text() == user_tracker) && value.message != '<i>This message has been deleted</i>'){
			tmp += "<span id='" + value.id + "' class='glyphicon glyphicon-remove mssg_icon' data-toggle='tooltip' title='Delete post' data-container='body' data-placement='top'></span>";
		}
		if(mods.indexOf(value.author) != -1){
			tmp += "<span class='glyphicon glyphicon-star' style='margin-left:5px;'></span>";	
		}
		if(admin.indexOf(value.author) != -1){
			tmp += "<span class='glyphicon glyphicon-tower' style='margin-left:5px;'></span>";
		}
		tmp += "<b class='mssg_op' id='" + value.author + "' style='color:" + color_arr[value.serial % 7] + ";'> " + value.author + "(<span class='response_count' id='" + value.id + "'>" + value.responses + "</span>)</b> : " + value.message + "</div><div class='time' id='" + value.inception + "'>" + moment.utc(value.inception).fromNow() + "</div></div></div>"	
		messages.push(tmp);
	});
	$('#chat_display').html(messages.join(''));
	$('#mssg_cont_' + clicked_on).append(responses);
	if(tmp_clicked){
		clicked_on = tmp_clicked;
	}
	$('.mssg_icon').tooltip();
	$('.mssg_icon').on('click',deleteIt);
	if(!focused && !title_blinking){
		notifyMessage();
	}
	if(chat_info.clicked != "-1"){
		$('#' + chat_info.clicked + '.chat_mssg').css('background-color','#eee');
		$('#message').attr('class',chat_info.clicked);
	}
	$('.chat_mssg').on('click',getResponse);
	$('.chat_resp').on('click',getResponse);
	$('.chat_link').click(function(e){e.stopPropagation();});
	if(!stop_scroll){
		$('#chat_messages').off('scroll',scroll_mod);
		$('#chat_messages').scrollTop($('#chat_display').height());
		window.setTimeout(function(){
			$('#chat_messages').on('scroll',scroll_mod);
		},100);
	}
});

socket.on('openResponses',function(responses){
	var messages = new Array();
	var responseto = -1;
	$.each(responses,function(index,value){
		responseto = value.responseto;
		if((serial_tracker == value.author || $('#chat_admin').text() == serial_tracker || user_tracker == value.author || $('#chat_admin').text() == user_tracker)  && value.message != '<i>This message has been deleted</i>'){
			var tmp = "<div class='responses_to_" + value.responseto + " level_" + value.level + " parent_" + value.parent + " pad_l_20' id='mssg_cont_" + value.id + "'><div class='chat_resp' id='" + value.id + "'><div><span id='" + value.id + "' class='glyphicon glyphicon-remove resp_icon' data-toggle='tooltip' title='Delete post' data-container='body' data-placement='top'></span><b class='mssg_op' id='" + value.author + "' style='color:" + color_arr[value.serial % 7] + ";'> " + value.author + "(<span class='response_count' id='" + value.id + "'>" + value.responses + "</span>)</b> : " + value.message + "</div><div class='time' id='" + value.inception + "'>" + moment.utc(value.inception).fromNow() + "</div></div></div>";
		}else{
			var tmp = "<div class='responses_to_" + value.responseto + " level_" + value.level + " parent_" + value.parent + " pad_l_20' id='mssg_cont_" + value.id + "'><div class='chat_resp' id='" + value.id + "'><div><b class='mssg_op' id='" + value.author + "' style='color:" + color_arr[value.serial % 7] + ";'> " + value.author + "(<span class='response_count' id='" + value.id + "'>" + value.responses + "</span>)</b> : " + value.message + "</div><div class='time' id='" + value.inception + "'>" + moment.utc(value.inception).fromNow() + "</div></div></div>"	
		}
		messages.push(tmp);
	});
	$('#mssg_cont_' + responseto).children('#resp_cont_' + responseto).remove();
	$('#mssg_cont_' + responseto).append('<div id="resp_cont_' + responseto + '" class="resp_cont">' + messages.join('') + '</div>');
	$('.resp_icon').on('click',deleteIt);
	$('.resp_icon').tooltip();
	$('.chat_resp').off('click');
	$('.chat_resp').on('click',getResponse);
	$('.chat_link').click(function(e){e.stopPropagation();});
	if(!focused && !title_blinking){
		notifyMessage();
	}
	if(!stop_scroll){
		$('#chat_responses').off('scroll',scroll_mod);
		$('#chat_responses').scrollTop($('#response_display').height());
		window.setTimeout(function(){
			$('#chat_responses').on('scroll',scroll_mod);
		},100);
	}
});

// Add a disconnect listener
socket.on('disconnect',function() {
	console.log('The client has disconnected!');
});

// Sends a message to the server via sockets
function sendMessageToServer(message) {
	socket.emit('message_sent',message);
	if($('#logged_in').text() == 1){
		$('#chat_display').append("<div id='mssg_cont'><div class='chat_mssg'><div><span class='glyphicon glyphicon-remove mssg_icon'></span><b class='mssg_op' id='" + user_tracker + "' style='color:" + color_arr[serial_tracker % 7] + ";'> " + user_tracker + "(<span class='response_count'>0</span>)</b> : " + message.message + "</div><div class='time'>a few seconds ago</div></div></div>");
	}else{
		$('#chat_display').append("<div id='mssg_cont'><div class='chat_mssg'><div><span class='glyphicon glyphicon-remove mssg_icon'></span><b class='mssg_op' id='" + serial_tracker + "' style='color:" + color_arr[serial_tracker % 7] + ";'> " + serial_tracker + "(<span class='response_count'>0</span>)</b> : " + message.message + "</div><div class='time'>a few seconds ago</div></div></div>");
	}
}

function sendResponseToServer(response,clicked_on) {
	socket.emit('response_sent',response);
	if($('#logged_in').text() == 1){
		$('#resp_cont_' + clicked_on).append("<div class='responses_to_" + clicked_on + " pad_l_20'><div class='chat_resp'><div><span class='glyphicon glyphicon-remove mssg_icon'></span><b class='mssg_op' id='" + user_tracker + "' style='color:" + color_arr[serial_tracker % 7] + ";'> " + user_tracker + "(<span class='response_count'>0</span>)</b> : " + response.message + "</div><div class='time'>a few seconds ago</div></div></div>");
	}else{
		$('#resp_cont_' + clicked_on).append("<div class='responses_to_" + clicked_on + " pad_l_20'><div class='chat_resp'><div><span class='glyphicon glyphicon-remove mssg_icon'></span><b class='mssg_op' id='" + serial_tracker + "' style='color:" + color_arr[serial_tracker % 7] + ";'> " + serial_tracker + "(<span class='response_count'>0</span>)</b> : " + response.message + "</div><div class='time'>a few seconds ago</div></div></div>");
	}
}

$('#message').click(function(){
	$(this).text("");
});

$('#message').keypress(function(e){
	if(live){
		if(e.which == 13){
			if($('#message').val() != ""){
				if($('#message').attr('class') == 'global'){
					sendMessageToServer({message:$('#message').val()});
				}else{
					var responseto = $('#message').attr('class');
					var level = parseInt($('#mssg_cont_' + responseto).attr('class').split(" ")[1].replace('level_','')) + 1;
					console.log(level);
					if($('#mssg_cont_' + responseto).attr('class').split(" ")[2].replace('parent_','') == -1){
						var resp_parent = responseto;
					}else{
						var resp_parent = $('#mssg_cont_' + responseto).parents('.mssg_cont').last().attr('id').replace('mssg_cont_','');
					}
					sendResponseToServer({message:$('#message').val(),responseto:responseto,level:level,parent:resp_parent},clicked_on);	
				}
				$('#message').val("");
			}
			return false;
		}
		return true;
	}
});

