marked.setOptions({
	sanitize:true,
	breaks:true
});

function hashHtml(text){
	return text.replace(/#/,'&#035;');
}

function emoji(text){
	var mapArr = ['\\&lt\\;3',':\\)',':\\(',':D',":\\&\\#39\\;\\(",'spec_face_angr','spec_face_rage',':\\|',':O',':P','T_T'];

	var mapObj = {
		'&lt;3':'<img style="height:18px;" src="//localhost/laravel/app/emoji/heart.png"></img>',
		':D':'<img style="height:18px;" src="//localhost/laravel/app/emoji/smile.png"></img>',
		':)':'<img style="height:18px;" src="//localhost/laravel/app/emoji/smiley.png"></img>',
		':(':'<img style="height:18px;" src="//localhost/laravel/app/emoji/disappointed.png"></img>',
		':|':'<img style="height:18px;" src="//localhost/laravel/app/emoji/neutral_face.png"></img>',
		//':/':'<img style="height:18px;" src="//localhost/laravel/app/emoji/confused.png"></img>',
		":&#39;(":'<img style="height:18px;" src="//localhost/laravel/app/emoji/cry.png"></img>',
		':O':'<img style="height:18px;" src="//localhost/laravel/app/emoji/open_mouth.png"></img>',
		':P':'<img style="height:18px;" src="//localhost/laravel/app/emoji/stuck_out_tongue_closed_eyes.png"></img>',
		'T_T':'<img style="height:18px;" src="//localhost/laravel/app/emoji/sob.png"></img>',
		'spec_face_angr':'<img style="height:18px;" src="//localhost/laravel/app/emoji/angry.png"></img>',
		'spec_face_rage':'<img style="height:18px;" src="//localhost/laravel/app/emoji/rage.png"></img>'
	};

	var re = new RegExp(mapArr.join("|"),"gi");
	text = text.replace(re, function(matched){
		return mapObj[matched];
	});
	return text;
}

function processMessage(message){
	var url_reg = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;
	var url_reg3 = /(img)(\s)(src\=)/g;
	var t_reg = /\/c\/([^\s]*)(\s*)/g; 
	var p_reg = /\/u\/([^\s]*)(\s*)/g; 
	var at_reg = /\@([^\s]*)(\s*)/g;
	var hash_reg = /\&\#035\;([^\s]*)(\s*)/g; 
	var re1 = new RegExp('^<p>','g');
	var re2 = new RegExp('</p>$','g');
	message = hashHtml(message);
	message = message.replace('>:|','spec_face_angr');
	message = message.replace('>:(','spec_face_rage');
	message = marked(message);
	message = message.replace(url_reg,"<a class='chat_link' href='//$3$4'>$3$4</a>");
	if(message.length){
		message = message.replace(/^\s+|\s+$/g,'');
		message = message.replace(re1,'');
		message = message.replace(re2,'');
		message = message.replace(p_reg,"<a class='chat_link' href='\/\/mutualcog.com/u/$1'>\/u\/$1</a>$2");
		message = message.replace(t_reg,"<a class='chat_link' href='\/\/mutualcog.com/c/$1'>\/c\/$1</a>$2");
		message = message.replace(at_reg,"<a class='chat_link' href='\/\/mutualcog.com/u/$1'>@$1</a>$2");
		message = message.replace(hash_reg,"<a class='chat_link' href='\/\/mutualcog.com/c/$1'>#$1</a>$2");
		message = message.replace(url_reg3,"$1$2style='max-width:300px;max-height:200px;margin-bottom:5px;' $3");
	}
	message = emoji(message);
	return message;
}

updateTimes = function(){
	$.each($('.time'),function(index,value){
		$(this).text(moment.utc($(this).attr('id')).fromNow());
	});
	$.each($('.chat_time'),function(index,value){
		$(this).text(moment.utc($(this).attr('id')).fromNow());
	});
	$.each($('.interaction_time'),function(index,value){
		$(this).text(moment.utc($(this).attr('id')).fromNow());
	});
};

function randomInt(min,max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startup(){
	$.each($('.async_img'),function(index,val){
		$('.async_img').eq(index).attr('src',$('.async_img').eq(index).attr('data-chat-img'));
	});
	if(document.URL.indexOf("#") != -1 && $('.nav-tabs').length != 0){
		var tab_name = document.URL.substring(document.URL.indexOf("#"));
		$('.nav-tabs').find('a[href="' + tab_name + '"]').tab('show');
	}
	$.each($('.pm_message'),function(index,val){
		if(moment().local().format('D:M:YYYY') == moment.utc($('.pm_message').eq(index).attr('title')).local().format('D:M:YYYY')){
			$('.pm_message').eq(index).attr('title',moment.utc($('.pm_message').eq(index).attr('title')).local().format('[Today at] h:mma'));
		}else{
			$('.pm_message').eq(index).attr('title',moment.utc($('.pm_message').eq(index).attr('title')).local().format('M/D/YY [at] h:mma'));
		}
	});
	$.each($('.chat_time'),function(index,val){
		if(moment().local().format('D:M:YYYY') == moment.utc($('.chat_time').eq(index).attr('title')).local().format('D:M:YYYY')){
			$('.chat_time').eq(index).attr('title',moment.utc($('.chat_time').eq(index).attr('title')).local().format('[Today at] h:mma'));
		}else{
			$('.chat_time').eq(index).attr('title',moment.utc($('.chat_time').eq(index).attr('title')).local().format('M/D/YY [at] h:mma'));
		}
	});
	$.each($('.time'),function(index,val){
		if(moment().local().format('D:M:YYYY') == moment.utc($('.time').eq(index).attr('title')).local().format('D:M:YYYY')){
			$('.time').eq(index).attr('title',moment.utc($('.time').eq(index).attr('title')).local().format('[Today at] h:mma'));
		}else{
			$('.time').eq(index).attr('title',moment.utc($('.time').eq(index).attr('title')).local().format('M/D/YY [at] h:mma'));
		}
	});
	$('.user_tooltip').tooltip();
	$('.caret_tooltip').tooltip();
	$('.advanced_cog').tooltip();
	$('.glyphicon-info-sign').tooltip();
	$('.mssg_cont').show();
}

function newPmChat(friend_id,pm_id,friend_status_class,friend_name){
	if(pm_id == 0){
		var chat_box = '<div class="pm_cont pm_visible" id="pm_' + friend_name + '_0" style="visibility:hidden;">';
	}else{
		var chat_box = '<div class="pm_cont pm_visible" id="pm_' + friend_id + '_' + pm_id + '" style="visibility:hidden;">';
	}
	chat_box += '<div class="pm_header"><div class="' + friend_status_class + ' pm_status"></div><div class="glyphicon glyphicon-remove pm_remove"></div><a class="pm_name" href="//mutualcog.com/u/' + friend_name + '">' + friend_name + '</a></div>';
	chat_box += '<div class="pm_body"><div class="pm_body_mssgs">'
	chat_box += '</div><div class="pm_body_alerts"> <div class="pm_mssg_alert pm_unseen" style="display:none;">Not seen</div> <div class="pm_mssg_alert pm_typing" style="display:none;">' + friend_name + ' is typing...</div> </div></div>';
	chat_box += '<textarea rows=1 class="pm_text"></textarea>';
	chat_box += '</div>'; 
	return chat_box;
}

upvoteMssg = function(e){
	e.stopPropagation();
	if($('#logged_in').text() == 1){
		var message_id = $(this).attr('id').replace('mssg_upvote_','');
		var url = '//mutualcog.com/chat/message-upvote';
		var votes = parseInt($('#mssg_votes_' + message_id).text());
		if($('#mssg_downvote_' + message_id).hasClass('red_color')){
			$('#mssg_upvote_' + message_id).addClass('green_color');
			$('#mssg_downvote_' + message_id).removeClass('red_color');
			$('#mssg_votes_' + message_id).text(votes + 2);
		}else if($('#mssg_upvote_' + message_id).hasClass('green_color')){
			$('#mssg_upvote_' + message_id).removeClass('green_color');
			$('#mssg_downvote_' + message_id).removeClass('red_color');
			$('#mssg_votes_' + message_id).text(votes - 1);
		}else{
			$('#mssg_upvote_' + message_id).addClass('green_color');
			$('#mssg_downvote_' + message_id).removeClass('red_color');
			$('#mssg_votes_' + message_id).text(votes + 1);
		}
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
					$('#mssg_upvote_' + message_id).addClass('green_color');
					$('#mssg_downvote_' + message_id).removeClass('red_color');
				}else if(hresp.status == 2){
					module.upvoted.splice(module.upvoted.indexOf(message_id.toString()),1);
					if($('#mssg_cont_' + message_id).hasClass('mssg_cont')){
						module.socket.emit('update_votes',{id:message_id,response:hresp,responseto:'global'});
					}else{
						module.socket.emit('update_votes',{id:message_id,response:hresp,responseto:$('#message').attr('class')});
					}
					$('#mssg_upvote_' + message_id).removeClass('green_color');
					$('#mssg_downvote_' + message_id).removeClass('red_color');
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
};

downvoteMssg = function(e){
	e.stopPropagation();
	if($('#logged_in').text() == 1){
		var message_id = $(this).attr('id').replace('mssg_downvote_','');
		var url = '//mutualcog.com/chat/message-downvote';
		var votes = parseInt($('#mssg_votes_' + message_id).text());
		if($('#mssg_downvote_' + message_id).hasClass('red_color')){
			$('#mssg_upvote_' + message_id).removeClass('green_color');
			$('#mssg_downvote_' + message_id).removeClass('red_color');
			$('#mssg_votes_' + message_id).text(votes + 1);
		}else if($('#mssg_upvote_' + message_id).hasClass('green_color')){
			$('#mssg_upvote_' + message_id).removeClass('green_color');
			$('#mssg_downvote_' + message_id).addClass('red_color');
			$('#mssg_votes_' + message_id).text(votes - 2);
		}else{
			$('#mssg_upvote_' + message_id).removeClass('green_color');
			$('#mssg_downvote_' + message_id).addClass('red_color');
			$('#mssg_votes_' + message_id).text(votes - 1);
		}
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
					$('#mssg_upvote_' + message_id).removeClass('green_color');
					$('#mssg_downvote_' + message_id).addClass('red_color');
				}else if(hresp.status == 2){
					module.downvoted.splice(module.downvoted.indexOf(message_id.toString()),1);
					if($('#mssg_cont_' + message_id).hasClass('mssg_cont')){
						module.socket.emit('update_votes',{id:message_id,response:hresp,responseto:'global'});
					}else{
						module.socket.emit('update_votes',{id:message_id,response:hresp,responseto:$('#message').attr('class')});
					}
					$('#mssg_upvote_' + message_id).removeClass('green_color');
					$('#mssg_downvote_' + message_id).removeClass('red_color');
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
};

function validateLogin(username,password,mobile){
	var response = $.ajax({
		type:'GET',
		data:{username:username,pass:password},
		url:'//mutualcog.com/profile/validate-login',
		async:false,
	}).responseText;
	if(response == 1){
		if(!mobile){
			$('#user_group').attr('class','form-group');
			$('#pass1_group').attr('class','form-group');
			$('#username').tooltip('destroy');
		}else{
			$('#mobile_user_group').attr('class','form-group');
			$('#mobile_pass1_group').attr('class','form-group');
			$('#mobile_username').tooltip('destroy');
		}
		return 1;
	}else{
		if(!mobile){
			$('#user_group').attr('class','form-group has-error');
			$('#pass1_group').attr('class','form-group has-error');
			$('#username').attr('data-original-title','Your username or password is incorrect');
			$('#username').tooltip('show');
		}else{
			$('#mobile_user_group').attr('class','form-group has-error');
			$('#mobile_pass1_group').attr('class','form-group has-error');
			$('#mobile_username').attr('data-original-title','Your username or password is incorrect');
			$('#mobile_username').tooltip('show');
		}
		return 0;
	}
}

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
	}else if(response == 4){
		$('#reg_user_group').attr('class','form-group has-error');
		$('#reg_username').attr('data-original-title','Your username cannot contain brackets or spaces');
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

deleteIt = function(e){
	e.stopPropagation();
	var mssg_id = $(this).parents('.js_mssg').first().attr('id').replace('message_','');
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
		$('.response_to_' + mssg_id).show();	
	}else{
		$(this).addClass('dropup');
		$(this).find('.caret').attr('data-original-title','Show Responses');
		$('.response_to_' + mssg_id).hide();	
	}
}

getStaticResponses = function(e){
	e.stopPropagation();
	var mssg_id = $(this).attr('id').replace('toggle_','');
	if($(this).hasClass('dropup')){
		$(this).removeClass('dropup');
		$(this).find('.caret').attr('data-original-title','Hide Responses');
		$('.response_to_' + mssg_id).show();	
	}else{
		$(this).addClass('dropup');
		$(this).find('.caret').attr('data-original-title','Show Responses');
		$('.response_to_' + mssg_id).hide();	
	}
}

setClicked = function(e){
	e.stopPropagation();
	module.clicked_on = $(this).attr('id').replace('message_','');
	var permalink = $('#permalink').attr('data-page-link');
	if(permalink.split('/').length - 1 == 5){
		$('.permalink').attr('data-page-link',permalink + '/' + module.clicked_on);
	}else{
		permalink = permalink.substring(0,permalink.lastIndexOf('/'));
		$('.permalink').attr('data-page-link',permalink + '/' + module.clicked_on);
	}
	$('.chat_mssg').removeClass('bright_blue_background');;
	$('.chat_mssg').find('.reply_link').find('strong').text('Reply');
	$(this).addClass('bright_blue_background');
	$(this).find('.reply_link').find('strong').text('Replying');
	$('#message').attr('class',$(this).attr('id').replace('message_',''));
	if(module.stop_scroll == 0){
		$('.stop_scroll').addClass('highlight_red');
		$('.stop_scroll').attr('data-original-title','Resume scrolling');
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

generateMssg = function(info,is_mssg,tmp){
	if(is_mssg){
		if(tmp){
			var tmp = "<div class='tmp_chat_mssg_" + module.tmp_mssg_cnt + " response_to_0 mssg_cont y_0 parent_0' id='mssg_cont_" + info.id + "'><div class='chat_mssg js_mssg' id='message_" + info.id + "'>";
		}else{
			var tmp = "<div class='response_to_0 mssg_cont y_0 parent_0' id='mssg_cont_" + info.id + "'><div class='chat_mssg js_mssg' id='message_" + info.id + "'>";
		}
	}else{
		if(tmp){
			var tmp = "<div class='tmp_chat_mssg_" + module.tmp_mssg_cnt + " response_to_" + info.responseto + " mssg_cont y_" + info.y_dim + " parent_" + info.parent + " marg_l_20' id='mssg_cont_" + info.id + "'><div class='chat_mssg js_mssg' id='message_" + info.id + "'>";
		}else{
			var tmp = "<div class='response_to_" + info.responseto + " mssg_cont y_" + info.y_dim + " parent_" + info.parent + " marg_l_20' id='mssg_cont_" + info.id + "'><div class='chat_mssg js_mssg' id='message_" + info.id + "'>";
		}
	}
	tmp += "<div class='mssg_body_cont'><div class='chat_vote_box'>";
	if(module.user_tracker == info.author || module.serial_tracker == info.author){
		tmp += '<span class="glyphicon glyphicon-chevron-up js_mssg_upvote mssg_upvote green_color" id="mssg_upvote_' + info.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="top"></span> <div class="upvote_count" id="mssg_votes_' + info.id + '">0</div> <span class="glyphicon glyphicon-chevron-down js_mssg_downvote mssg_downvote" id="mssg_downvote_' + info.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="bottom"></span>';
	}else{
		tmp += '<span class="glyphicon glyphicon-chevron-up js_mssg_upvote mssg_upvote" id="mssg_upvote_' + info.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="top"></span> <div class="upvote_count" id="mssg_votes_' + info.id + '">0</div> <span class="glyphicon glyphicon-chevron-down js_mssg_downvote mssg_downvote" id="mssg_downvote_' + info.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="bottom"></span>';
	}
	tmp += '</div><div class="mssg_body author_' + info.author + '"><div id="toggle_' + info.id + '" class="toggle_responses"> <span class="caret caret_tooltip" id="caret_' + info.id + '" data-toggle="tooltip" data-original-title="Hide Responses" data-container="body" data-placement="top"></span> </div> ';
	//TODO: Add mod symbol fix admin array and mods array
	if((module.serial_tracker == info.author || module.user_tracker == info.author) && info.message != '<i>This message has been deleted</i>'){
		tmp += "<span id='remove_" + info.id + "' style='margin-right:4px;' class='glyphicon glyphicon-remove mssg_icon' data-mssg-serial='" + info.serial + "' data-toggle='tooltip' title='Delete post' data-container='body' data-placement='top'></span>";
		tmp += "<span class='glyphicon glyphicon-star'></span><strong class='mssg_op' data-author='" + info.author + "' style='color:" + module.color_arr[info.serial % 7] + ";'> " + info.author + " </strong> : " + info.message + "<div class='time_box'><div class='reply'><a href='#' class='reply_link' data-mssg-id='" + info.id + "'><strong>Reply</strong></a></div><div class='time' id='" + info.created_at + "'>" + moment.utc(info.created_at).fromNow() + "</div></div></div></div></div></div></div>"	
	}else{
		tmp += "<strong class='mssg_op' data-author='" + info.author + "' style='color:" + module.color_arr[info.serial % 7] + ";'> " + info.author + " </strong> : " + info.message + "<div class='time_box'><div class='reply'><a href='#' class='reply_link' data-mssg-id='" + info.id + "'><strong>Reply</strong></a></div><div class='time' id='" + info.created_at + "'>" + moment.utc(info.created_at).fromNow() + "</div></div></div></div></div></div>"	
	}
	return tmp;
}

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

function validateCommunity(community){
	var response = $.ajax({
		type:'GET',
		data:{community:community},
		url:'//mutualcog.com/community/validate-name',
		async:false,
	}).responseText;
	if(response == 1){
		return 1;
	}else{
		return 0;
	}
}

