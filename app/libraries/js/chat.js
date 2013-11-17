var curr_request;
        
var socket = io.connect('http://localhost:3000/');

var stop_scroll = 0;

var color_arr = new Array('#228d49','#f52103','#2532f2','#f94f06','#5a24d9','#f8b92d','#38cedb','#000');

var serial_tracker = $('#serial_tracker').text();

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

removeSmallElements = function(){
	if($(this).width() < 1200){
		$('#members_box').css('display','none');
		$(this).off('resize');
		$(this).on('resize',addSmallElements);
	}
}

addSmallElements = function(){
	if($(this).width() >= 1200){
		$('#members_box').css('display','');
		$(this).off('resize');
		$(this).on('resize',removeSmallElements);
	}
}

$(document).ready(function(){
	updateChatTimes();
	setInterval(updateTimes,60000);
	setInterval(updateChatTimes,60000);
	if($(window).width() < 1200){
		$('#members_box').css('display','none');
		$(window).on('resize',addSmallElements);
	}else{
		$(window).on('resize',removeSmallElements);
	}
	$('#chat_messages').click(function(){
		$('#message').attr('class','global');
		$('.chat_mssg').css('background-color','');
		$('#response_display').html('');
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
	$('.go_back').click(function(e){
		e.stopPropagation();
		socket.emit('go_back',$('.chat_mssg').eq(0).attr('id'));
	});
});

deleteMessage = function(message_id) {
	socket.emit('delete_message',message_id);
};

deleteIt = function(e){
	e.stopPropagation();
	if($('#logged_in').text() == 1){
		deleteMessage({id:$(this).attr('id'),user:$('#user_tracker').text(),responses:$(this).parent().children('.mssg_op').children('.response_count').text()});
	}else{
		deleteMessage({id:$(this).attr('id'),user:$('#serial_tracker').text(),responses:$(this).parent().children('.mssg_op').children('.response_count').text()});
	}
};

getResponse = function(e){
	e.stopPropagation();
	socket.emit('show_responses',$(this).attr('id'));
	$('.chat_mssg').css('background-color','');
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
};

getNestedResponse = function(e){
	e.stopPropagation();
	socket.emit('show_nested_responses',{id:$(this).attr('id'),parent:$('#message').attr('class')});
	$('#chat_messages').hover(function(){
		$('.go_back').show(400);
	},function(){	
		$('.go_back').hide(400);
	});
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
socket.on('connect',function() {
	socket.emit('room',$('.chat_id').attr('id'));
	if($('#logged_in').text() == 1){
		socket.emit('add_member',{new_member:user_tracker,serial:serial_tracker,logged_in:1});
	}else{
		socket.emit('add_member',{new_member:serial_tracker,logged_in:0});
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
	var mems = new Array();
	$.each(info,function(index,member){
		if(member.is_admin){
			$('#display_admin').html(member.user);
		}
		mems.push("<div>" + member.user + "</div>");
	});
	$('#display_members').html(mems.join(''));
});
socket.on('openChat',function(chat_info){
	var chat_log = chat_info.rows;
	var messages = new Array();
	if(chat_log.length > 0){
		if(chat_log[0].responseto == -1){
			$('.go_back').css('display','none');
			$('#chat_messages').off('mouseenter mouseleave');
		}
	}
	$.each(chat_log,function(index,value){
		if((serial_tracker == value.author || $('#chat_admin').text() == serial_tracker || user_tracker == value.author || $('#chat_admin').text() == user_tracker) && value.message != '<i>This message has been deleted</i>'){
			var tmp = "<div class='chat_mssg' id='" + value.id + "'><div><span id='" + value.id + "' class='glyphicon glyphicon-remove mssg_icon'></span><b class='mssg_op' id='" + value.author + "' style='color:" + color_arr[value.serial % 7] + ";'> " + value.author + "(<span class='response_count' id='" + value.id + "'>" + value.responses + "</span>)</b> : " + value.message + "</div><div class='time' id='" + value.inception + "'>" + moment.utc(value.inception).fromNow() + "</div></div>";
		}else{
			var tmp = "<div class='chat_mssg' id='" + value.id + "'><div><b class='mssg_op' id='" + value.author + "' style='color:" + color_arr[value.serial % 7] + ";'> " + value.author + "(<span class='response_count' id='" + value.id + "'>" + value.responses + "</span>)</b> : " + value.message + "</div><div class='time' id='" + value.inception + "'>" + moment.utc(value.inception).fromNow() + "</div></div>"	
		}
		messages.push(tmp);
	});
	$('#chat_display').html(messages.join(''));
	$('.mssg_icon').on('click',deleteIt);
	$('.mssg_icon').hover(function(){
		$(this).css('color','red');
	},function(){
		$(this).css('color','black');
	});
	if(chat_info.clicked != "-1"){
		$('#' + chat_info.clicked + '.chat_mssg').css('background-color','#eee');
		$('#message').attr('class',chat_info.clicked);
	}
	$('.chat_mssg').on('click',getResponse);
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
	$.each(responses,function(index,value){
		if((serial_tracker == value.author || $('#chat_admin').text() == serial_tracker || user_tracker == value.author || $('#chat_admin').text() == user_tracker)  && value.message != '<i>This message has been deleted</i>'){
			var tmp = "<div class='chat_resp' id='" + value.id + "'><div><span id='" + value.id + "' class='glyphicon glyphicon-remove resp_icon'></span><b class='mssg_op' id='" + value.author + "' style='color:" + color_arr[value.serial % 7] + ";'> " + value.author + "(<span class='response_count' id='" + value.id + "'>" + value.responses + "</span>)</b> : " + value.message + "</div><div class='time' id='" + value.inception + "'>" + moment.utc(value.inception).fromNow() + "</div></div>";
		}else{
			var tmp = "<div class='chat_resp' id='" + value.id + "'><div><b class='mssg_op' id='" + value.author + "' style='color:" + color_arr[value.serial % 7] + ";'> " + value.author + "(<span class='response_count' id='" + value.id + "'>" + value.responses + "</span>)</b> : " + value.message + "</div><div class='time' id='" + value.inception + "'>" + moment.utc(value.inception).fromNow() + "</div></div>"	
		}
		messages.push(tmp);
	});
	$('#response_display').html(messages.join(''));
	$('.resp_icon').on('click',deleteIt);
	$('.resp_icon').hover(function(){
		$(this).css('color','red');
	},function(){
		$(this).css('color','black');
	});
	$('.chat_resp').on('click',getNestedResponse);
	$('.chat_link').click(function(e){e.stopPropagation();});
	if(!stop_scroll){
		$('#chat_responses').off('scroll',scroll_mod);
		$('#chat_responses').scrollTop($('#response_display').height());
		window.setTimeout(function(){
			$('#chat_responses').on('scroll',scroll_mod);
		},100);
	}
});
socket.on('softDelete',function(mssg_info){
	if($('#' + mssg_info.id + '.chat_mssg').length){
		$('#' + mssg_info.id + '.chat_mssg').html("<b class='mssg_op' id='" + mssg_info.user + "' style='color:" + color_arr[mssg_info.user % 7] + ";'>" + mssg_info.user + "(<span class='response_count' id='" + mssg_info.id + "'>" + mssg_info.responses + "</span>)</b> : <i>This message has been deleted</i>");
	}else{
		$('#' + mssg_info.id + '.chat_resp').html("<b class='mssg_op' id='" + mssg_info.user + "' style='color:" + color_arr[mssg_info.user % 7] + ";'>" + mssg_info.user + "(<span class='response_count' id='" + mssg_info.id + "'>" + mssg_info.responses + "</span>)</b> : <i>This message has been deleted</i>");
	}
});
// Add a disconnect listener
socket.on('disconnect',function() {
	console.log('The client has disconnected!');
});

// Sends a message to the server via sockets
function sendMessageToServer(message) {
	socket.emit('message_sent',message);
}

function sendResponseToServer(response) {
	socket.emit('response_sent',response);
}

$('#message').click(function(){
	$(this).text("");
});

$('#message').keypress(function(e){
	if(e.which == 13){
		if($('#message').val() != ""){
			if($('#message').attr('class') == 'global'){
				sendMessageToServer({message:$('#message').val()});
			}else{
				sendResponseToServer({message:$('#message').val(),responseto:$('#message').attr('class')});	
			}
			$('#message').val("");
		}
		return false;
	}
	return true;
});

