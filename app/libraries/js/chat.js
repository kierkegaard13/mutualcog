var curr_request;
var focused = 1;
var title_blinking = 0;
var clicked_on = -1;
var mssg_clicked = -1;
var live = 1;
var banned = 0;
var chat_id = $('.chat_id').attr('id');
var upvoted = jQuery.parseJSON($('#up_arr').text());
var downvoted = jQuery.parseJSON($('#down_arr').text());
        
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

socket.on('updateVotes',function(info) {
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
					downvoted.splice(downvoted.indexOf(message_id.toString()),1);						
					upvoted.push(message_id.toString());
				}else{
					upvoted.push(message_id.toString());
				}
				if($('#mssg_cont_' + message_id).hasClass('mssg_cont')){
					socket.emit('update_votes',{id:message_id,response:hresp,responseto:'global'});
				}else{
					socket.emit('update_votes',{id:message_id,response:hresp,responseto:$('#message').attr('class')});
				}
				$('#mssg_upvote_' + message_id).css('color','#57bf4b');
				$('#mssg_downvote_' + message_id).css('color','');
			}else if(hresp.status == 2){
				upvoted.splice(upvoted.indexOf(message_id.toString()),1);
				if($('#mssg_cont_' + message_id).hasClass('mssg_cont')){
					socket.emit('update_votes',{id:message_id,response:hresp,responseto:'global'});
				}else{
					socket.emit('update_votes',{id:message_id,response:hresp,responseto:$('#message').attr('class')});
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
					upvoted.splice(downvoted.indexOf(message_id.toString()),1);						
					downvoted.push(message_id.toString());
				}else{
					downvoted.push(message_id.toString());
				}
				if($('#mssg_cont_' + message_id).hasClass('mssg_cont')){
					socket.emit('update_votes',{id:message_id,response:hresp,responseto:'global'});
				}else{
					socket.emit('update_votes',{id:message_id,response:hresp,responseto:$('#message').attr('class')});
				}
				$('#mssg_downvote_' + message_id).css('color','red');
				$('#mssg_upvote_' + message_id).css('color','');
			}else if(hresp.status == 2){
				downvoted.splice(downvoted.indexOf(message_id.toString()),1);
				if($('#mssg_cont_' + message_id).hasClass('mssg_cont')){
					socket.emit('update_votes',{id:message_id,response:hresp,responseto:'global'});
				}else{
					socket.emit('update_votes',{id:message_id,response:hresp,responseto:$('#message').attr('class')});
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
	$('a#continue_description').click(function(e){
		e.stopPropagation();
		$('#continue_modal').modal();
	});
	$('button#save_details').click(function(){
		$('#description_modal').modal('hide');
		$.ajax({
			type:'POST',
			data: {details:$('#detail_text').val(),id:$('.chat_id').attr('id')},
			url:'//mutualcog.com/chat/details',
			success:function(hresp){
				$('#curr_details').html(hresp);
				socket.emit('update_details',hresp);
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
	$('#warn_user').click(function(){
		var user = $('#mssg_cont_' + clicked_on).find('.mssg_op').attr('id');
		if(user == user_tracker || clicked_on == -1){
			return false;
		}else{
			socket.emit('warn',{member:$('#mssg_cont_' + clicked_on).find('.mssg_op').attr('id')});
		}
	});
	$('#kick_user').click(function(){
		var user = $('#mssg_cont_' + clicked_on).find('.mssg_op').attr('id');
		if(user == user_tracker || clicked_on == -1){
			return false;
		}else{
			socket.emit('kick',{member:$('#mssg_cont_' + clicked_on).find('.mssg_op').attr('id')});
		}
	});
	$('#stop_scroll').click(function(){
		if($(this).hasClass('highlight_red')){
			stop_scroll = 1;
			$(this).removeClass('highlight_red');	
			$(this).attr('data-original-title','Stop scrollbar');
		}else{
			stop_scroll = 0;
			$(this).addClass('highlight_red');
			$(this).attr('data-original-title','Resume scrolling');
		}	
	});
});

deleteIt = function(e){
	e.stopPropagation();
	if($('#logged_in').text() == 1){
		socket.emit('delete_message',{id:$(this).parents('.chat_mssg').first().attr('id'),user:user_tracker,serial:serial_tracker,responses:$(this).parent().find('.response_count').text()});
	}else{
		socket.emit('delete_message',{id:$(this).parents('.chat_mssg').first().attr('id'),user:serial_tracker,serial:serial_tracker,responses:$(this).parent().find('.response_count').text()});
	}
};

socket.on('softDelete',function(mssg_info){
	if($('#' + mssg_info.id + '.chat_mssg').length){
		$('.mssg_icon').tooltip('hide');
		$('.mssg_icon').tooltip();
		$('#' + mssg_info.id + '.chat_mssg').html("<b class='mssg_op' id='" + mssg_info.user + "' style='color:" + color_arr[mssg_info.serial % 7] + ";'>" + mssg_info.user + " (<span class='response_count' id='" + mssg_info.id + "'>" + mssg_info.responses + "</span>)</b> : <i>This message has been deleted</i>");
	}else{
		$('.resp_icon').tooltip('hide');
		$('.resp_icon').tooltip();
		$('#' + mssg_info.id + '.chat_resp').html("<b class='mssg_op' id='" + mssg_info.user + "' style='color:" + color_arr[mssg_info.serial % 7] + ";'>" + mssg_info.user + " (<span class='response_count' id='" + mssg_info.id + "'>" + mssg_info.responses + "</span>)</b> : <i>This message has been deleted</i>");
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
			$('#message').text("Press enter to respond to " + $(this).find('.mssg_op').attr('id') + "\'s message");
		}else{
			$('#message').val("Press enter to respond to " + $(this).find('.mssg_op').attr('id') + "\'s message");
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
				$('#message').text("Press enter to respond to " + $(this).find('.mssg_op').attr('id') + "\'s message");
			}else{
				$('#message').val("Press enter to respond to " + $(this).find('.mssg_op').attr('id') + "\'s message");
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

socket.on('display_details',function(info){
	$('#curr_details').html(info);
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

socket.on('add_mod_funcs',function(){
	console.log('hi');
	$('#user_toolbox').append('<span class="glyphicon glyphicon-warning-sign mod_power" id="warn_user" data-toggle="tooltip" data-container="body" data-placement="top" data-original-title="Warn user"></span> <span class="glyphicon glyphicon-remove mod_power" id="kick_user" data-toggle="tooltip" data-container="body" data-placement="top" data-original-title="Kick user"></span> ');
});

socket.on('remove_mod_funcs',function(){
	$('.mod_power').remove();
});

socket.on('pause',function(security){
	live = 0;	
	$('.chat_paused').remove();
	$('#main').append('<div class="chat_paused" id="paused_message">Chat has been paused</div>');
	$('#paused_message').show('fade','slow');
	socket.emit('pause',{hash:security.hash});
});

socket.on('play',function(security){
	live = 1;
	$('#paused_message').hide('fade','slow',function(){
		$('#paused_message').remove();
	});
	socket.emit('play',{hash:security.hash});
});

socket.on('warn',function(){
	$('.chat_paused').remove();
	$('#main').append('<div class="chat_paused" id="warned_user">You have been warned</div>');
	$('#warned_user').show('fade','slow');
});

socket.on('kick',function(){
	banned = 1;
	$('.chat_paused').remove();
	$('#main').append('<div class="chat_paused" id="banned_user">You have been banned</div>');
	$('#banned_user').show('fade','slow');
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
});

socket.on('openChat',function(chat_info){
	var tmp = "<div class='mssg_cont level_0 parent_0' id='mssg_cont_" + chat_info.id + "'><div class='chat_mssg' id='" + chat_info.id + "'><span class='vote_box'>";
	if(upvoted.indexOf(chat_info.id.toString()) != -1){
		tmp += '<span class="glyphicon glyphicon-chevron-up mssg_upvote" id="mssg_upvote_' + chat_info.id + '" style="color:#57bf4b" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="top"></span> <div style="margin-top:-5px;margin-bottom:-5px;text-align:center;" id="mssg_votes_' + chat_info.id + '">0</div> <span class="glyphicon glyphicon-chevron-down mssg_downvote" id="mssg_downvote_' + chat_info.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="bottom"></span>';
	}else if(downvoted.indexOf(chat_info.id.toString()) != -1){
		tmp += '<span class="glyphicon glyphicon-chevron-up mssg_upvote" id="mssg_upvote_' + chat_info.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="top"></span> <div style="margin-top:-5px;margin-bottom:-5px;text-align:center;" id="mssg_votes_' + chat_info.id + '">0</div> <span class="glyphicon glyphicon-chevron-down mssg_downvote" id="mssg_downvote_' + chat_info.id + '" style="color:red;" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="bottom"></span>';
	}else{
		tmp += '<span class="glyphicon glyphicon-chevron-up mssg_upvote" id="mssg_upvote_' + chat_info.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="top"></span> <div style="margin-top:-5px;margin-bottom:-5px;text-align:center;" id="mssg_votes_' + chat_info.id + '">0</div> <span class="glyphicon glyphicon-chevron-down mssg_downvote" id="mssg_downvote_' + chat_info.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="bottom"></span>';
	}
	tmp += '</span><span>'
	if((serial_tracker == chat_info.author || user_tracker == chat_info.author) && chat_info.message != '<i>This message has been deleted</i>'){
		tmp += "<span id='" + chat_info.id + "' style='margin-right:4px;' class='glyphicon glyphicon-remove mssg_icon' data-toggle='tooltip' title='Delete post' data-container='body' data-placement='top'></span>";
	}
	if(admin.indexOf(chat_info.author) != -1){
		tmp += "<span class='glyphicon glyphicon-star'></span>";
	}else if(mods.indexOf(chat_info.author) != -1){
		tmp += "<span class='glyphicon glyphicon-tower'></span>";	
	}
	tmp += "<b class='mssg_op' id='" + chat_info.author + "' style='color:" + color_arr[chat_info.serial % 7] + ";'> " + chat_info.author + " (<span class='response_count' id='" + chat_info.id + "'>0</span>)</b> : " + chat_info.message + "</span><div><div class='time' id='" + chat_info.created_at + "'>" + moment.utc(chat_info.created_at).fromNow() + "</div></div></div></div>"	
	console.log(tmp)
	$('#chat_display').append(tmp);
	$('.mssg_icon').tooltip();
	$('.mssg_icon').on('click',deleteIt);
	if(!focused && !title_blinking){
		notifyMessage();
	}
	if(chat_info.clicked != "-1"){
		$('#' + chat_info.clicked + '.chat_mssg').css('background-color','#eee');
		$('#message').attr('class',chat_info.clicked);
	}
	$('.mssg_upvote').on('click',upvoteMssg);
	$('.mssg_downvote').on('click',downvoteMssg);
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
	var responseto = 0;
	$.each(responses,function(index,value){
		responseto = value.responseto;
		var tmp = "<div class='responses_to_" + value.responseto + " level_" + value.level + " parent_" + value.parent + " pad_l_20' id='mssg_cont_" + value.id + "'><div class='chat_resp' id='" + value.id + "'><span class='vote_box'>";
		if(upvoted.indexOf(value.id.toString()) != -1){
			tmp += '<span class="glyphicon glyphicon-chevron-up mssg_upvote" id="mssg_upvote_' + value.id + '" style="color:#57bf4b" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="top"></span> <div style="margin-top:-5px;margin-bottom:-5px;text-align:center;" id="mssg_votes_' + value.id + '">' + (value.upvotes - value.downvotes) + '</div> <span class="glyphicon glyphicon-chevron-down mssg_downvote" id="mssg_downvote_' + value.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="bottom"></span>';
		}else if(downvoted.indexOf(value.id.toString()) != -1){
			tmp += '<span class="glyphicon glyphicon-chevron-up mssg_upvote" id="mssg_upvote_' + value.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="top"></span> <div style="margin-top:-5px;margin-bottom:-5px;text-align:center;" id="mssg_votes_' + value.id + '">' + (value.upvotes - value.downvotes) + '</div> <span class="glyphicon glyphicon-chevron-down mssg_downvote" id="mssg_downvote_' + value.id + '" style="color:red;" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="bottom"></span>';
		}else{
			tmp += '<span class="glyphicon glyphicon-chevron-up mssg_upvote" id="mssg_upvote_' + value.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="top"></span> <div style="margin-top:-5px;margin-bottom:-5px;text-align:center;" id="mssg_votes_' + value.id + '">' + (value.upvotes - value.downvotes) + '</div> <span class="glyphicon glyphicon-chevron-down mssg_downvote" id="mssg_downvote_' + value.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="bottom"></span>';
		}
		tmp += '</span><span>'
		if((serial_tracker == value.author || user_tracker == value.author)  && value.message != '<i>This message has been deleted</i>'){
			tmp += "<span id='" + value.id + "' style='margin-right:4px;' class='glyphicon glyphicon-remove resp_icon' data-toggle='tooltip' title='Delete post' data-container='body' data-placement='top'></span>";
		}
		if(admin.indexOf(value.author) != -1){
			tmp += "<span class='glyphicon glyphicon-star'></span>";
		}else if(mods.indexOf(value.author) != -1){
			tmp += "<span class='glyphicon glyphicon-tower'></span>";	
		}
		tmp += "<b class='mssg_op' id='" + value.author + "' style='color:" + color_arr[value.serial % 7] + ";'> " + value.author + " (<span class='response_count' id='" + value.id + "'>" + value.responses + "</span>)</b> : " + value.message + "</span><div><div class='time' id='" + value.created_at + "'>" + moment.utc(value.created_at).fromNow() + "</div></div></div></div>"	
		messages.push(tmp);
	});
	$('#mssg_cont_' + responseto).children('#resp_cont_' + responseto).remove();
	$('#mssg_cont_' + responseto).append('<div id="resp_cont_' + responseto + '" class="resp_cont">' + messages.join('') + '</div>');
	$('.mssg_upvote').on('click',upvoteMssg);
	$('.mssg_downvote').on('click',downvoteMssg);
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
	$('.enter_hint').text("");
	$('.response_hint').text("");
	$(this).text("");
});

var keys = new Array();

$('#message').keydown(function(e){
	keys.push(e.which);
});

$('#message').keyup(function(e){
	if(live && banned == 0){
		if(e.which == 13){  //enter key
			if(keys.indexOf(16) == -1){  //shift key not pressed
				keys.splice(keys.indexOf(e.which),1);
				if($('#message').val().trim() != ""){
					if($('#message').attr('class') == 'global'){
						sendMessageToServer({message:$('#message').val()});
					}else{
						var responseto = $('#message').attr('class');
						var level = parseInt($('#mssg_cont_' + responseto).attr('class').split(" ")[1].replace('level_','')) + 1;
						if($('#mssg_cont_' + responseto).attr('class').split(" ")[2].replace('parent_','') == 0){
							var resp_parent = responseto;
						}else{
							var resp_parent = $('#mssg_cont_' + responseto).parents('.mssg_cont').last().attr('id').replace('mssg_cont_','');
						}
						sendResponseToServer({message:$('#message').val(),responseto:responseto,level:level,parent:resp_parent},clicked_on);	
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

