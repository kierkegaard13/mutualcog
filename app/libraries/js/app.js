$('body').on('click','.mutual_route',function(){
	var route_url = $(this).attr('href');
	var route_uri = route_url.replace('//','');
	var main_html = $('#main').html();
	var side_html = $('#side').html();
	var old_url = document.URL;
	var nav = $('.highlight_light_blue');
	var new_nav = $(this);
	route_uri = route_uri.slice(route_uri.indexOf('/'));
	$('.mutual_route').removeClass('highlight_light_blue');
	$(this).addClass('highlight_light_blue');
	$('#main_cont').html('<div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div>');
	$.ajax({
		type:'GET',
		url:route_url,
		success:function(hresp){
			$('#main').html(hresp.view);
			$('#sid').attr('data-sid',hresp.sid);
			$('#serial_tracker').text(hresp.serial);
			$('#serial_id').text(hresp.serial_id);
			if(hresp.community || hresp.home){
				$('#static_post_box').hide();
				$('#chat_description_box').hide();
				$('#chat_tool_box').hide();
			}
			if(hresp.community){
				$('#community_sub_box').html($('#community_sub_replacement').html());
				$('#community_info_box').html($('#community_info_replacement').html());
				$('#community_sub_box').show();
				$('#community_info_box').show();
			}else{
				$('#community_sub_box').hide();
				$('#community_info_box').hide();
			}
			startup();
			if(module.url_state_pntr == -1){
				window.history.replaceState({pntr:0},null,document.documentURI);	
				module.url_state.push({html:main_html,url:old_url,side:side_html,nav:nav});
				module.url_state.push({html:$('#main').html(),url:document.URL,side:$('#side').html(),nav:new_nav});
				module.url_state_pntr += 2;
			}else{
				module.url_state.push({html:$('#main').html(),url:document.URL,side:$('#side').html(),nav:new_nav});
				module.url_state_pntr++;
			}
			window.history.pushState({pntr:module.url_state_pntr},null,route_uri);	
			if(module.chat_id){
				module.socket.emit('leave_room',module.chat_id);
				module.chat_id = null;
			}
			module.socket.emit('authorize',{room:module.chat_id,sid:$('#sid').attr('data-sid'),serial:$('#serial_tracker').text()},function(){
				if(module.chat_id){
					if($('#logged_in').text() == 1){
						module.socket.emit('add_user',{new_user:module.user_tracker,serial_id:module.serial_id});
					}else{
						module.socket.emit('add_user',{new_user:module.serial_tracker,serial_id:module.serial_id});
					}
				}
				module.socket.emit('seen_chats');
			});
		}
	});
	return false;
});

window.onpopstate = function(e){
	if(e.state !== null){
		var state = module.url_state[e.state.pntr];
		$('.mutual_route').removeClass('highlight_light_blue');
		state.nav.addClass('highlight_light_blue');
		$('#main').html(state.html);
		$('#side').html(state.side);
		startup();
	}else{
		var state = module.url_state[0];
		$('.mutual_route').removeClass('highlight_light_blue');
		state.nav.addClass('highlight_light_blue');
		$('#main').html(state.html);
		$('#side').html(state.side);
		startup();
	}
};

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
	$('.mutual_tooltip').tooltip();
	$('.caret_tooltip').tooltip();
	$('.advanced_cog').tooltip();
	$('.glyphicon-info-sign').tooltip();
	$('.mssg_cont').velocity('transition.slideLeftBigIn');
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
		tmp += '<span class="glyphicon glyphicon-menu-up js_mssg_upvote mssg_upvote green_color" id="mssg_upvote_' + info.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="top"></span> <div class="upvote_count" id="mssg_votes_' + info.id + '">0</div> <span class="glyphicon glyphicon-menu-down js_mssg_downvote mssg_downvote" id="mssg_downvote_' + info.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="bottom"></span>';
	}else{
		tmp += '<span class="glyphicon glyphicon-menu-up js_mssg_upvote mssg_upvote" id="mssg_upvote_' + info.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="top"></span> <div class="upvote_count" id="mssg_votes_' + info.id + '">0</div> <span class="glyphicon glyphicon-menu-down js_mssg_downvote mssg_downvote" id="mssg_downvote_' + info.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on messages" data-container="body" data-placement="bottom"></span>';
	}
	tmp += '</div><div class="js_mssg_body mssg_body author_' + info.author + '"><div id="toggle_' + info.id + '" class="toggle_responses"> <span class="caret caret_tooltip" id="caret_' + info.id + '" data-toggle="tooltip" data-original-title="Hide Responses" data-container="body" data-placement="top"></span> </div> ';
	//TODO: Add mod symbol fix admin array and mods array
	if((module.serial_tracker == info.author || module.user_tracker == info.author) && info.message != '<i>This message has been deleted</i>'){
		tmp += "<span id='remove_" + info.id + "' style='margin-right:4px;' class='glyphicon glyphicon-remove mssg_icon' data-mssg-serial='" + info.serial + "' data-toggle='tooltip' title='Delete post' data-container='body' data-placement='top'></span>";
	}
	tmp += "<strong class='mssg_op' data-author='" + info.author + "'><a href='//mutualcog.com/u/" + info.author + "' style='color:" + module.color_arr[info.serial % 7] + ";'> " + info.author;
	if(module.serial_id == module.admin || module.user_id == module.admin){
		tmp += " <span class='glyphicon glyphicon-king'></span>";
	}else if(module.serial_id in module.mods || module.user_id in module.mods){
		tmp += " <span class='glyphicon glyphicon-knight'></span>";
	}
	tmp += " </a></strong> : " + info.message + "<div class='time_box'><div class='reply'><a href='#' class='reply_link' data-mssg-id='" + info.id + "'><strong>Reply</strong></a></div><div class='time' id='" + info.created_at + "'>" + moment.utc(info.created_at).fromNow() + "</div></div></div></div></div></div>";	
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
	}else{
		var upvoted = new Array();
		var downvoted = new Array();
	}
	if(typeof io !== 'undefined'){
		var socket = io('http://localhost:3000/');
	}else{
		var socket = $('body');
	}
	var color_arr = new Array('#228d49','#f52103','#2532f2','#f94f06','#5a24d9','#f8b92d','#38cedb','#050a57');
	var mems = new Array();
	if($('#chat_mods_info').length){
		var mods = $.parseJSON($('#chat_mods_info').text());
	}else{
		var mods = new Array();
	}
	var admin = $('#chat_admin_info').text();
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
		$('.community_search').css('opacity','');
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


module.socket.on('updateVotes',function(info) {
	$('#mssg_votes_' + info.message_id).text(info.response.upvotes);
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
				chat_box += '<div class="pm_header"><div class="' + friend_status_class + ' pm_status"></div><div class="glyphicon glyphicon-remove pm_remove"></div><a class="pm_name" href="//mutualcog.com/u/' + info.friend_name + '">' + info.friend_name + '</a></div>';
				chat_box += '<div class="pm_body"><div class="pm_body_mssgs">';
				$.each(hresp,function(index,val){
					if(val.author_id == module.user_id){
						chat_box += '<div class="pm_mssg_cont"> <div class="pm_message pull-right" style="background-color:#eee;margin-left:30px;margin-right:5px;" title="' + moment.utc(val.created_at).local().format('[Today at] h:mma') + '"> ' + val.message + ' </div> </div>';
					}else{
						chat_box += '<div class="pm_mssg_cont"> <div class="pm_message pull-left" style="background-color:#7badfc;margin-right:30px;margin-left:5px;" title="' + moment.utc(val.created_at).local().format('[Today at] h:mma') + '"> ' + val.message + ' </div> </div>';
					}
				});
				chat_box += '</div><div class="pm_body_alerts"> <div class="pm_mssg_alert pm_unseen" style="display:none;">Not seen</div> <div class="pm_mssg_alert pm_typing" style="display:none;">' + info.friend_name + ' is typing...</div> </div></div>';
				chat_box += '<textarea rows=1 class="pm_text"></textarea>';
				chat_box += '</div>'; 
				$('.pm_bar').prepend(chat_box);
				var mssg = '<div class="pm_mssg_cont">';
				mssg += '<div class="pm_message pull-left" style="background-color:#7badfc;margin-right:30px;margin-left:5px;" title="' + moment.utc(info.time).local().format('[Today at] h:mma') + '">' + info.message + '</div>';
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
		mssg += '<div class="pm_message pull-left" style="background-color:#7badfc;margin-right:30px;margin-left:5px;" title="' + moment.utc(info.time).local().format('[Today at] h:mma') + '">' + info.message + '</div>';
		mssg += '</div>'; 
		chat_cont.find('.pm_body_mssgs').append(mssg);
	}else{
		var mssg = '<div class="pm_mssg_cont">';
		mssg += '<div class="pm_message pull-left" style="background-color:#7badfc;margin-right:30px;margin-left:5px;" title="' + moment.utc(info.time).local().format('[Today at] h:mma') + '">' + info.message + '</div>';
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

module.socket.on('softDelete',function(mssg_info){
	if($('#message_' + mssg_info.id + '.chat_mssg').length){
		$('.mssg_icon').tooltip('hide');
		$('.mssg_icon').tooltip();
		var mssg = $('#message_' + mssg_info.id + '.chat_mssg').find('.js_mssg_body');
		var tmp = mssg.find('.toggle_responses');
		var tmp2 = mssg.find('.time_box');
		mssg.html('');
		mssg.append(tmp);
		mssg.append("<strong class='mssg_op' id='" + mssg_info.user + "' style='color:" + module.color_arr[mssg_info.mssg_serial % 7] + ";'>" + mssg_info.user + " </strong> : <em>This message has been deleted</em>");
		mssg.append(tmp2);
	}
});

module.socket.on('connect',function() {
	console.log('Client has connected');
	module.connected = 1;
	module.socket.emit('authorize',{room:module.chat_id,sid:$('#sid').attr('data-sid'),serial:$('#serial_tracker').text()},function(){
		if(module.chat_id){
			if($('#logged_in').text() == 1){
				module.socket.emit('add_user',{new_user:module.user_tracker,serial_id:module.serial_id});
			}else{
				module.socket.emit('add_user',{new_user:module.serial_tracker,serial_id:module.serial_id});
			}
		}
		module.socket.emit('seen_chats');
	});
	if($('.enter_hint').text() == 'You are disconnected'){
		$('.enter_hint').text("Press Shift+Enter for new line");
		$('.response_hint').text("Click on a message to respond to it");
		$('.pm_unseen').text("");
		$('.pm_unseen').hide();
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

module.socket.on('add_mod_funcs',function(){
	$('#user_toolbox').append('<span class="glyphicon glyphicon-warning-sign mod_power" id="warn_user" data-toggle="tooltip" data-container="body" data-placement="top" data-original-title="Warn user"></span> <span class="glyphicon glyphicon-remove mod_power" id="kick_user" data-toggle="tooltip" data-container="body" data-placement="top" data-original-title="Kick user"></span> ');
	$('#warn_user').tooltip();
	$('#kick_user').tooltip();
});

module.socket.on('remove_mod_funcs',function(){
	$('.mod_power').remove();
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
	$('.chat_content').append('<div class="chat_paused" id="paused_message">Chat has been paused</div>');
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
	$('.chat_content').append('<div class="chat_paused" id="warned_user">You have been warned</div>');
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
	$('.chat_content').append('<div class="chat_paused" id="banned_user">You have been banned</div>');
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
		$('.chat_content').append('<div class="chat_paused" id="paused_message">Chat has been paused</div>');
		$('#paused_message').show('fade','show');
	}
	$('.mssg_icon').tooltip();
	$('#notify_cont_top').off('click');
	$('#notify_cont_bottom').off('click');
	$('#notify_cont_top').on('click',find_top_notifications);
	$('#notify_cont_bottom').on('click',find_bottom_notifications);
	$('#chat_display').off('click');
	$('#chat_display').on('click','.mssg_icon',deleteIt);
	$('#chat_display').on('click','.js_mssg_upvote',upvoteMssg);
	$('#chat_display').on('click','.js_mssg_downvote',downvoteMssg);
	$('body').on('click','.chat_mssg',setClicked);
	$('#chat_display').on('click','.chat_link',function(e){e.stopPropagation();});
});

module.socket.on('publishMessage',function(chat_info){
	if(chat_info.responseto == 0){
		var tmp = generateMssg(chat_info,1,0);
		$('#chat_display').append(tmp);
	}else{
		var tmp = generateMssg(chat_info,0,0);
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


$('body').on('click','.mobile_pm_return',function(){
	$(this).parents('.mobile_pm_window').velocity('transition.slideLeftBigOut');
});

$('body').on('click','.mobile_pm_cont',function(){
	var pm_id = 'mobile_' + $(this).attr('id').replace('ident_','');
	$('#' + pm_id).velocity('transition.slideLeftBigIn');
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
	$('.mobile_friend_requests').velocity('transition.slideLeftBigIn');
});
$('.mobile_show_mssg_requests').click(function(){
	$(this).css('background-color','#ddd');
	$('.mobile_show_friend_requests').css('background-color','');
	$('.mobile_show_global_requests').css('background-color','');
	$('.mobile_friend_requests').hide();
	$('.mobile_global_requests').hide();
	$('.mobile_mssg_requests').velocity('transition.slideLeftBigIn');
});
$('.mobile_show_global_requests').click(function(){
	$(this).css('background-color','#ddd');
	$('.mobile_show_friend_requests').css('background-color','');
	$('.mobile_show_mssg_requests').css('background-color','');
	$('.mobile_mssg_requests').hide();
	$('.mobile_friend_requests').hide();
	$('.mobile_global_requests').velocity('transition.slideLeftBigIn');
});
$('.mobile_show_friends').click(function(){
	$(this).css('background-color','#ddd');
	$('.mobile_show_open_pms').css('background-color','');
	$('.mobile_pms').hide();
	$('.mobile_friend_list').velocity('transition.slideLeftBigIn');
});
$('.mobile_show_open_pms').click(function(){
	$(this).css('background-color','#ddd');
	$('.mobile_show_friends').css('background-color','');
	$('.mobile_friend_list').hide();
	$('.mobile_pms').velocity('transition.slideLeftBigIn');
});
$('#show_mobile_pms').click(function(){
	if($('#mobile_pms_cont').css('display') == 'none'){
		$(this).addClass('highlight_blue_background');
		$('#show_mobile_notifications').removeClass('highlight_blue_background');
	}else{
		$(this).removeClass('highlight_blue_background');
	}
	var transition = 'transition.slideDownBigIn';
	if($('#mobile_pms_cont').css('display') == 'block'){
		$('.big_content_box').velocity('transition.slideDownBigIn');
		transition = 'transition.slideUpBigOut';
	}else{
		$('.big_content_box').velocity('transition.slideUpBigOut');
	}
	$('#mobile_pms_cont').velocity(transition);
	$('#mobile_notifications_cont').hide();
});
$('#show_mobile_notifications').click(function(){
	if($('#mobile_notifications_cont').css('display') == 'none'){
		$(this).addClass('highlight_blue_background');
		$('#show_mobile_pms').removeClass('highlight_blue_background');
	}else{
		$(this).removeClass('highlight_blue_background');
	}
	var transition = 'transition.slideDownBigIn';
	if($('#mobile_notifications_cont').css('display') == 'block'){
		$('.big_content_box').velocity('transition.slideDownBigIn');
		transition = 'transition.slideUpBigOut';
	}else{
		$('.big_content_box').velocity('transition.slideUpBigOut');
	}
	$('#mobile_notifications_cont').velocity(transition);
	$('#mobile_pms_cont').hide();
});
$('.register_link').click(function(){
	$('#reg_modal_title').text('Create an account');
});
$('.show_friends').click(function(){
	$('.left_menu_toggle').html('Friends <strong class="caret" style="color:white;"></strong>');
	$('.show_subscriptions').show();
	$('.show_recent').show();
	$('#friend_box_cont').velocity('transition.slideLeftBigIn');
	$('#subscription_cont').hide();
	$('#recent_cont').hide();
	$(this).hide();
	$(this).dropdown('toggle');
	$.ajax({
		type:'GET',
		data:{status:0},
		url:'//mutualcog.com/profile/set-status/' + module.user_id,
		success:function(){	
		}
	});
	return false;
});
$('.show_subscriptions').click(function(){
	$('.left_menu_toggle').html('Subscriptions <strong class="caret" style="color:white;"></strong>');
	$('.show_friends').show();
	$('.show_recent').show();
	$('#friend_box_cont').hide();
	$('#recent_cont').hide();
	$('#subscription_cont').velocity('transition.slideLeftBigIn');
	$(this).hide();
	$(this).dropdown('toggle');
	$.ajax({
		type:'GET',
		data:{status:1},
		url:'//mutualcog.com/profile/set-status/' + module.user_id,
		success:function(){	
		}
	});
	return false;
});
$('.show_recent').click(function(){
	$('.left_menu_toggle').html('Recent <strong class="caret" style="color:white;"></strong>');
	$('.show_subscriptions').show();
	$('.show_friends').show();
	$('#friend_box_cont').hide();
	$('#subscription_cont').hide();
	$('#recent_cont').velocity('transition.slideLeftBigIn');
	$(this).hide();
	$(this).dropdown('toggle');
	$.ajax({
		type:'GET',
		data:{status:2},
		url:'//mutualcog.com/profile/set-status/' + module.user_id,
		success:function(){	
		}
	});
	return false;
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
		var welcome_width = $('#welcome_user').width();
		$('.community_search_expand').css('display','none');
		$('.community_search_collapse').css('display','');
		$('.community_input').width(welcome_width - 54);
		$('.community_input').attr('placeholder',module.search_messages[randomInt(0,module.search_messages.length - 1)]);
		$('.nav_pad_r').css('padding-right',welcome_width + 100);
		$('.community_search_cont').velocity('transition.slideRightBigIn');
		$('.community_search').velocity('transition.slideRightBigIn',{display:'inline-block'});
		console.log($('.community_search').find('input'));
		window.setTimeout(function(){
		$('.community_search').find('input').get(0).focus();
		},800);
		//$('.community_search').show('slide',{direction:'right'});
	}else{
		$('.community_search_expand').css('display','');
		$('.community_search_collapse').css('display','none');
		$('.community_search').velocity('transition.slideRightBigOut',500,function(){
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
	var cont = $(this).parents('.chat_title_cont');
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
		descr.show();
	}else{
		$(this).html('Show description'); 
		descr.hide();
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
					res += '<span class="glyphicon glyphicon-menu-up js_mssg_upvote static_mssg_upvote" id="mssg_upvote_' + val.id + '" style="color:#57bf4b" data-toggle="tooltip" data-original-title="You must be logged in to vote on responses" data-container="body" data-placement="top"></span> <div class="upvote_count" id="mssg_votes_' + val.id + '">' + (val.upvotes - val.downvotes) + '</div> <span class="glyphicon glyphicon-menu-down js_mssg_downvote static_mssg_downvote" id="mssg_downvote_' + val.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on responses" data-container="body" data-placement="bottom"></span></div>';
				}else if(downvoted.indexOf(val.id) != -1){
					res += '<span class="glyphicon glyphicon-menu-up js_mssg_upvote static_mssg_upvote" id="mssg_upvote_' + val.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on responses" data-container="body" data-placement="top"></span> <div class="upvote_count" id="mssg_votes_' + val.id + '">' + (val.upvotes - val.downvotes) + '</div> <span class="glyphicon glyphicon-menu-down js_mssg_downvote static_mssg_downvote" id="mssg_downvote_' + val.id + '" style="color:red;" data-toggle="tooltip" data-original-title="You must be logged in to vote on responses" data-container="body" data-placement="bottom"></span></div>';
				}else{
					res += '<span class="glyphicon glyphicon-menu-up js_mssg_upvote static_mssg_upvote" id="mssg_upvote_' + val.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on responses" data-container="body" data-placement="top"></span> <div class="upvote_count" id="mssg_votes_' + val.id + '">' + (val.upvotes - val.downvotes) + '</div> <span class="glyphicon glyphicon-menu-down js_mssg_downvote static_mssg_downvote" id="mssg_downvote_' + val.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on responses" data-container="body" data-placement="bottom"></span></div>';
				}
				res += '<div class="static_mssg_body js_mssg_body author_' + val.author + '">';
				res += '<div id="toggle_' + val.id + '" class="toggle_responses"> <span class="caret caret_tooltip" id="caret_' + val.id + '" data-toggle="tooltip" data-original-title="Hide Responses" data-container="body" data-placement="top"></span> </div>';
				if(val.message != 'This response has been deleted' && (module.serial_tracker == val.author || module.user_tracker == val.author)){
					res += '<span id="remove_' + val.id + '" class="glyphicon glyphicon-remove mssg_icon" data-mssg-serial="' + val.serial + '" style="margin-right:5px;" data-toggle="tooltip" title="Delete post" data-container="body" data-placement="top"></span>';	
				}
				res += '<strong class="mssg_op" data-author="' + val.author + '"><a href="//mutualcog.com/u/' + val.author + '" style="color:' + module.color_arr[val.serial % 7] + '"> ' + val.author;
				if(val.author == $('#chat_admin_info').text()){
					res += '<span class="glyphicon glyphicon-king"></span>';	
				}else if(val.author in module.mods){
					res += '<span class="glyphicon glyphicon-knight"></span>';	
				}
				res += '</a></strong> : ' + val.message;
				res += '<div class="time_box">';
				if($('.chat_status_indicator').hasClass('glyphicon-pause')){
					res += '<div class="static_reply"><a href="#" class="reply_link" data-mssg-id="' + val.id + '"><strong>Reply</strong></a></div>';
				}
				res += '<div class="static_tool"><a href="//mutualcog.com/profile/save/message/' + val.id + '"><strong>Save</strong></a></div>';
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

$('#search_input').on('keydown',function(e){
	if(e.keyCode == 13){  /*enter key*/
		if(selected_term == -1){
			window.location.href = '//mutualcog.com/search/result/' + $('#search_input').val();
		}else{
			location.assign($('li#search_' + selected_term).children('a').attr('href'));
		}	
		return false;
	}else if(e.keyCode == 38){  /*up arrow*/
		if(selected_term != 0){
			selected_term--;
			$('.community_results').css('background-color','');
			$('li#search_' + selected_term).css('background-color','#ddd');
			
		}
		return false;
	}else if(e.keyCode == 40){  /*down arrow*/
		if(selected_term != $('.community_results').length - 1){
			selected_term++;
			$('.community_results').css('background-color','');
			$('li#search_' + selected_term).css('background-color','#ddd');
		}
		return false;
	}
});

$('#search_input').on('keyup',function(e){
	var community = $(this).val();	
	if(e.keyCode == 13){  /*enter key*/
		return false;
	}else if(e.keyCode == 38 || e.keyCode == 40){  /*up arrow or down arrow*/
	}else{
		if(community.length > 2){
			$.ajax({
				type:'GET',
				data: {community:community},
				url:'//mutualcog.com/search/similar-entity',
				success:function(hresp){
					var content = '';
					var enter_user = 0;
					var enter_community = 0;
					var enter_post = 0;
					$.each(hresp,function(index,value){
						if(value.type == 'community'){
							if(enter_community == 0){
								content += '<div class="search_res_type"><strong>Communities</strong></div>';
								enter_community++;
							}
							content += '<li id="search_' + index + '" class="community_results"><a href="//mutualcog.com/c/' + value.name + '">' + value.name + '</a></li>';
						}else if(value.type == 'post'){
							if(enter_post == 0){
								content += '<div class="search_res_type"><strong>Posts</strong></div>';
								enter_post++;
							}
							if(value.live == 1){
								content += '<li id="search_' + index + '" class="community_results"><a href="//mutualcog.com/chat/live/' + value.id + '">' + value.name + '</a></li>';
							}else{
								content += '<li id="search_' + index + '" class="community_results"><a href="//mutualcog.com/chat/static/' + value.id + '">' + value.name + '</a></li>';
							}
						}else{
							if(enter_user == 0){
								content += '<div class="search_res_type"><strong>Users</strong></div>';
								enter_user++;
							}
							content += '<li id="search_' + index + '" class="community_results"><a href="//mutualcog.com/u/' + value.name + '">' + value.name + '</a></li>';
						}
					});
					content += '<div class="search_hint_cont"><div class="search_hint"><strong>Press enter for more results</strong></div></div>';
					content += '<li><a class="search_link" href="#" ><strong>List of advanced search keywords</strong></a></li>';
					if(content){
						$('#community_dropdown').show();
						if($('#community_dropdown').html() != content){
							$('#community_dropdown').html(content);
							selected_term = -1;
						}
					}else{
						$('#community_dropdown').hide();
						selected_term = -1;
					}
				},
				error:function(){
				}
			});
		}else{
			$('#community_dropdown').html('');
		}
	}
});

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
	if(e.which == 13 && $(this).val().trim() == ""){
		return false;
	}
	window.setTimeout(function(){
		if((e.which != 13 || pm_keys.indexOf(16) != -1) && $this.val().trim() != ""){
			$this.height(0);
			$this.height(self.scrollHeight - 10);
		}
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
				var pm_sent = processMessage($(this).val());
				$(this).css('height','');
				var mssg = '<div class="pm_mssg_cont tmp_message_' + module.tmp_mssg_cnt + '">';
				mssg += '<div class="pm_message pull-right" style="background-color:#eee;margin-left:30px;margin-right:5px;" title="' + moment().format("hh:mma") + '">' + pm_sent + '</div>';
				mssg += '</div>'; 
				$(this).val("");
				$('#pm_' + module.pm_info[1] + '_' + module.pm_info[2]).find('.pm_body_mssgs').append(mssg);
				module.socket.emit('send_pm',{message:pm_sent,pm_id:module.pm_info[2],friend_id:module.pm_info[1],user_id:module.user_id,tmp_mssg_cnt:module.tmp_mssg_cnt},function(info){
					var chat_cont = $('#pm_' + info.friend_id + '_' + info.pm_id);
					var tmp_message = chat_cont.find('.tmp_message_' + info.tmp_mssg_cnt);
					tmp_message.find('.pm_message').html(info.message);
					tmp_message.attr('class',tmp_message.attr('class').replace('tmp_message_' + info.tmp_mssg_cnt,''));
					if(info.unseen){
						chat_cont.find('.pm_unseen').show();
					}
				});
				module.tmp_mssg_cnt++;
				if(module.pm_scroll_inactive[chat_cont.attr('id')] == 0 || !(chat_cont.attr('id') in module.pm_scroll_inactive)){
					var pm_body = chat_cont.find('.pm_body');
					window.setTimeout(function(){
						pm_body.mCustomScrollbar('scrollTo','bottom',{scrollInertia:0});	
					},20);
				}
			}else{
				return false;
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

$('body').on('cut','.mobile_pm_text',function(e){
	var $this = $(this);
	var self = this;
	window.setTimeout(function(){
		$this.height(0);
		$this.height(self.scrollHeight - 20);
	},0);
});

$('body').on('paste','.mobile_pm_text',function(e){
	var $this = $(this);
	var self = this;
	window.setTimeout(function(){
		$this.height(0);
		$this.height(self.scrollHeight - 20);
	},0);
});

$('body').on('keydown','.mobile_pm_text',function(e){
	pm_keys.push(e.which);
	var $this = $(this);
	var self = this;
	if(e.which == 13 && $(this).val().trim() == ""){  /* 13 is enter */
		return false;
	}
	window.setTimeout(function(){
		if((e.which != 13 || pm_keys.indexOf(16) != -1) && $this.val().trim() != ""){
			$this.height(0);
			$this.height(self.scrollHeight - 20);
		}
	},0);
});

$('body').on('keyup','.mobile_pm_text',function(e){
	module.pm_info = $(this).parent().attr('id').split('_');
	var chat_cont = $(this).parents('.mobile_pm_window');
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
				module.socket.emit('not_typing',{pm_id:module.pm_info[3],friend_id:module.pm_info[2],user_id:module.user_id});
			}
			if($(this).val().trim() != ""){
				var pm_sent = processMessage($(this).val());
				$(this).css('height','');
				var mssg = '<div class="pm_mssg_cont tmp_message_' + module.tmp_mssg_cnt + '">';
				mssg += '<div class="pm_message pull-right" style="background-color:#eee;margin-left:30px;margin-right:5px;" title="' + moment().format("hh:mma") + '">' + pm_sent + '</div>';
				mssg += '</div>'; 
				$(this).val("");
				$('#mobile_pm_' + module.pm_info[2] + '_' + module.pm_info[3]).find('.pm_body_mssgs').append(mssg);
				module.socket.emit('send_pm',{message:pm_sent,pm_id:module.pm_info[3],friend_id:module.pm_info[2],user_id:module.user_id,tmp_mssg_cnt:module.tmp_mssg_cnt},function(info){
					var chat_cont = $('#mobile_pm_' + info.friend_id + '_' + info.pm_id);
					var tmp_message = chat_cont.find('.tmp_message_' + info.tmp_mssg_cnt);
					tmp_message.find('.pm_message').html(info.message);
					tmp_message.attr('class',tmp_message.attr('class').replace('tmp_message_' + info.tmp_mssg_cnt,''));
					if(info.unseen){
						chat_cont.find('.pm_unseen').show();
					}
				});
				module.tmp_mssg_cnt++;
				if(module.pm_scroll_inactive[chat_cont.attr('id')] == 0 || !(chat_cont.attr('id') in module.pm_scroll_inactive)){
					var pm_body = chat_cont.find('.mobile_pm_body');
					window.setTimeout(function(){
						pm_body.mCustomScrollbar('scrollTo','bottom',{scrollInertia:0});	
					},20);
				}
			}else{
				return false;
			}
			module.typ_cnt = 0;
		}else{
			if(module.typ_cnt == 0){
				module.socket.emit('is_typing',{pm_id:module.pm_info[3],friend_id:module.pm_info[2],user_id:module.user_id});
			}
			pm_keys.splice(keys.indexOf(e.which),1);
			module.typ_cnt = 4;
		}
	}else{
		if(module.typ_cnt == 0){
			module.socket.emit('is_typing',{pm_id:module.pm_info[3],friend_id:module.pm_info[2],user_id:module.user_id});
		}
		pm_keys.splice(pm_keys.indexOf(e.which),1);
		module.typ_cnt = 4;
	}
	return true;
});

$('.communities_input').on('keydown',function(e){
	if(e.keyCode == 13){  /*enter key*/
		if(selected_community != -1){
			var curr_val = $(this).val().split(' ');
			curr_val.pop();
			curr_val.push('#' + $('.suggested_communities').eq(selected_community).text());
			$(this).val(curr_val.join(' ') + ' #');
			$(this).focus();
			return false;		
		}
		return false;
	}else if(e.keyCode == 38){  /*up arrow*/
		if($('.popover').length != 0){
			if(selected_community != 0){
				selected_community -= 1;
				$('.suggested_communities').css('color','');
				$('.suggested_communities').eq(selected_community).css('color','#57bf4b');
			}
			return false;
		}
	}else if(e.keyCode == 40){  /*down arrow*/
		if($('.popover').length != 0){
			if(selected_community != $('.suggested_communities').length - 1){
				selected_community += 1;
				$('.suggested_communities').css('color','');
				$('.suggested_communities').eq(selected_community).css('color','#57bf4b');
			}
			return false;
		}
	}
});

$('.communities_input').on('keyup',function(e){
	if(e.keyCode == 32){  /*space bar*/
		if($(this).val().length == 1){
			$(this).val('');
		}else{
			var communities = $(this).val().split(" ");
			var hashcommunities = new Array();
			$.each(communities,function(index,value){
				value = value.replace('#','');
				hashcommunities.push('#' + value);
			});
			$(this).val(hashcommunities.join(' '));
			$(this).popover('destroy');
			selected_community = -1;
		}
	}else if(e.keyCode == 38 || e.keyCode == 40){
		/*up arrow or down arrow*/
	}else{
		var guess = $(this).val().split(' ');
		guess = guess.pop().replace('#','');
		if(guess.length > 2){
			var communities_input = $(this);
			$(this).on('blur',function(){
				if($('.popover').length){
					$(this).popover('hide');
				}
			});
			$.ajax({
				type:'GET',
				data: {community:guess.slice(0,-1)},
				url:'//mutualcog.com/community/similar-community',
				success:function(hresp){
					var content = '';
					$.each(hresp,function(index,value){
						content += '<div class="suggested_communities" id="' + value.id + '">' + value.name + '</div>';
					});
					if($('.popover').length == 0){
						if(content){
							communities_input.popover({html:true});
							communities_input.attr('data-content',content);
							communities_input.popover('show');
							$('.suggested_communities').click(function(){
								var curr_val = $('.communities_input').val().split(' ');
								curr_val.pop();
								curr_val.push('#' + $(this).text());
								communities_input.val(curr_val.join(' ') + ' #');
								communities_input.focus();
								communities_input.popover('destroy');
								selected_community = -1;
							});
							selected_community = -1;
						}
					}else{
						if(content){
							if($('.popover-content').html() != content){
								$('.popover-content').html(content);
								selected_community = -1;
								$('.suggested_communities').off('click');
								$('.suggested_communities').click(function(){
									var curr_val = $('.communities_input').val().split(' ');
									curr_val.pop();
									curr_val.push('#' + $(this).text());
									communities_input.val(curr_val.join(' ') + ' #');
									communities_input.focus();
									communities_input.popover('destroy');
									selected_community = -1;
								});
							}
						}else{
							communities_input.popover('destroy');
							selected_community = -1;
						}
					}
				},
				error:function(){
				}
			});
		}else{
			$(this).popover('destroy');
			selected_community = -1;
		}
	}
});

$('#mod_input').on('keydown',function(e){
	if(e.keyCode == 13){  /*enter key*/
		if(selected_mod != -1){
			var request_info = {community_id:$(this).attr('data-community-id'),community_name:$(this).attr('data-community-name'),user_id:$('.suggested_mods').eq(selected_mod).attr('id')};
			module.socket.emit('request_mod',request_info,function(success){
				if(success == 1){
					$('#mod_request_sent').text('Request sent');
					if(!$('#mod_request_sent').hasClass('base_green_color')){
						$('#mod_request_sent').removeClass('base_red_color');
						$('#mod_request_sent').addClass('base_green_color');
					}
				}else{
					$('#mod_request_sent').text('Limit reached');
					if(!$('#mod_request_sent').hasClass('base_red_color')){
						$('#mod_request_sent').removeClass('base_green_color');
						$('#mod_request_sent').addClass('base_red_color');
					}
				}
				$('#mod_request_sent').show('fade','slow',function(){
					window.setTimeout(function(){
						$('#mod_request_sent').hide('fade','slow');	
					},1500);
				});
			});
			$(this).popover('destroy');
			$(this).focus();
			selected_mod = -1;
		}
		return false;
	}else if(e.keyCode == 38){  /*up arrow*/
		if($('.popover').length != 0){
			if(selected_mod != 0){
				selected_mod += 1;
				$('.suggested_mods').css('color','');
				$('.suggested_mods').eq(selected_mod).css('color','#57bf4b');
			}
		}
		return false;
	}else if(e.keyCode == 40){  /*down arrow*/
		if($('.popover').length != 0){
			if(selected_mod != $('.suggested_mods').length - 1){
				selected_mod -= 1;
				$('.suggested_mods').css('color','');
				$('.suggested_mods').eq(selected_mod).css('color','#57bf4b');
			}
		}
		return false;
	}
});

$('#mod_input').on('keyup',function(e){
	if(e.keyCode == 32 || e.keyCode == 13){  /*space bar*/
		return false;
	}else if(e.keyCode == 38 || e.keyCode == 40){  /*up arrow or down arrow*/
		return false;
	}else{
		var mod = $(this).val();
		var community_id = $(this).attr('data-community-id');
		if(mod.length > 2){
			var mod_input = $(this);
			$(this).on('blur',function(){
				if($('.popover').length){
					$(this).popover('hide');
				}
			});
			$.ajax({
				type:'GET',
				data: {mod:mod,community_id:community_id},
				url:'//mutualcog.com/community/similar-mod',
				success:function(hresp){
					var content = '';
					$.each(hresp,function(index,value){
						content += '<div class="suggested_mods" id="' + value.id + '">' + value.name + '</div>';
					});
					if($('.popover').length == 0){
						if(content){
							mod_input.popover({html:true});
							mod_input.attr('data-content',content);
							mod_input.popover('show');
							$('.suggested_mods').click(function(){
								var request_info = {community_id:mod_input.attr('data-community-id'),community_name:mod_input.attr('data-community-name'),user_id:$('.suggested_mods').eq(selected_mod).attr('id')};
								module.socket.emit('request_mod',request_info,function(success){
									if(success){
										$('#mod_request_sent').text('Request sent');
										if(!$('#mod_request_sent').hasClass('base_green_color')){
											$('#mod_request_sent').removeClass('base_red_color');
											$('#mod_request_sent').addClass('base_green_color');
										}
									}else{
										$('#mod_request_sent').text('Limit reached');
										if(!$('#mod_request_sent').hasClass('base_red_color')){
											$('#mod_request_sent').removeClass('base_green_color');
											$('#mod_request_sent').addClass('base_red_color');
										}
									}
									$('#mod_request_sent').show('fade','slow',function(){
										window.setTimeout(function(){
											$('#mod_request_sent').hide('fade','slow');	
										},1500);
									});
								});
								mod_input.focus();
								mod_input.popover('destroy');
								selected_mod = -1;
							});
							selected_mod = -1;
						}
					}else{
						if(content){
							if($('.popover-content').html() != content){
								$('.popover-content').html(content);
								selected_mod = -1;
								$('.suggested_mods').off('click');
								$('.suggested_mods').click(function(){
									var request_info = {community_id:mod_input.attr('data-community-id'),community_name:mod_input.attr('data-community-name'),user_id:$('.suggested_mods').eq(selected_mod).attr('id')};
									module.socket.emit('request_mod',request_info,function(success){
										if(success){
											$('#mod_request_sent').text('Request sent');
											if(!$('#mod_request_sent').hasClass('base_green_color')){
												$('#mod_request_sent').removeClass('base_red_color');
												$('#mod_request_sent').addClass('base_green_color');
											}
										}else{
											$('#mod_request_sent').text('Limit reached');
											if(!$('#mod_request_sent').hasClass('base_red_color')){
												$('#mod_request_sent').removeClass('base_green_color');
												$('#mod_request_sent').addClass('base_red_color');
											}
										}
										$('#mod_request_sent').show('fade','slow',function(){
											window.setTimeout(function(){
												$('#mod_request_sent').hide('fade','slow');	
											},1500);
										});
									});
									mod_input.focus();
									mod_input.popover('destroy');
									selected_mod = -1;
								});
							}
						}else{
							mod_input.popover('destroy');
							selected_mod = -1;
						}
					}
				},
				error:function(){
				}
			});
		}else{
			$(this).popover('destroy');
			selected_mod = -1;
		}
	}
});

$('#admin_input').on('keydown',function(e){
	if(e.keyCode == 13){  /*enter key*/
		if(selected_admin != -1){
			var request_info = {community_id:$(this).attr('data-community-id'),community_name:$(this).attr('data-community-name'),user_id:$('.suggested_admin').eq(selected_admin).attr('id')};
			module.socket.emit('request_admin',request_info,function(success){
				if(success == 1){
					$('#admin_request_sent').text('Request sent');
					if(!$('#admin_request_sent').hasClass('base_green_color')){
						$('#admin_request_sent').removeClass('base_red_color');
						$('#admin_request_sent').addClass('base_green_color');
					}
				}else{
					$('#admin_request_sent').text('Limit reached');
					if(!$('#admin_request_sent').hasClass('base_red_color')){
						$('#admin_request_sent').removeClass('base_green_color');
						$('#admin_request_sent').addClass('base_red_color');
					}
				}
				$('#admin_request_sent').show('fade','slow',function(){
					window.setTimeout(function(){
						$('#admin_request_sent').hide('fade','slow');	
					},1500);
				});
			});
			$(this).popover('destroy');
			$(this).focus();
			selected_admin = -1;
		}
		return false;
	}else if(e.keyCode == 38){  /*up arrow*/
		if($('.popover').length != 0){
			if(selected_admin != 0){
				selected_admin += 1;
				$('.suggested_admin').css('color','');
				$('.suggested_admin').eq(selected_admin).css('color','#57bf4b');
			}
		}
		return false;
	}else if(e.keyCode == 40){  /*down arrow*/
		if($('.popover').length != 0){
			if(selected_admin != $('.suggested_admin').length - 1){
				selected_admin -= 1;
				$('.suggested_admin').css('color','');
				$('.suggested_admin').eq(selected_admin).css('color','#57bf4b');
			}
		}
		return false;
	}
});

$('#admin_input').on('keyup',function(e){
	if(e.keyCode == 32 || e.keyCode == 13){  /*space bar*/
		return false;
	}else if(e.keyCode == 38 || e.keyCode == 40){  /*up arrow or down arrow*/
		return false;
	}else{
		var admin = $(this).val();
		var community_id = $(this).attr('data-community-id');
		if(admin.length > 2){
			var admin_input = $(this);
			$(this).on('blur',function(){
				if($('.popover').length){
					$(this).popover('hide');
				}
			});
			$.ajax({
				type:'GET',
				data: {admin:admin,community_id:community_id},
				url:'//mutualcog.com/community/similar-admin',
				success:function(hresp){
					var content = '';
					$.each(hresp,function(index,value){
						content += '<div class="suggested_admin" id="' + value.id + '">' + value.name + '</div>';
					});
					if($('.popover').length == 0){
						if(content){
							admin_input.popover({html:true});
							admin_input.attr('data-content',content);
							admin_input.popover('show');
							$('.suggested_admin').click(function(){
								var request_info = {community_id:admin_input.attr('data-community-id'),community_name:admin_input.attr('data-community-name'),user_id:$('.suggested_admin').eq(selected_admin).attr('id')};
								module.socket.emit('request_admin',request_info,function(success){
									if(success){
										$('#admin_request_sent').text('Request sent');
										if(!$('#admin_request_sent').hasClass('base_green_color')){
											$('#admin_request_sent').removeClass('base_red_color');
											$('#admin_request_sent').addClass('base_green_color');
										}
									}else{
										$('#admin_request_sent').text('Limit reached');
										if(!$('#admin_request_sent').hasClass('base_red_color')){
											$('#admin_request_sent').removeClass('base_green_color');
											$('#admin_request_sent').addClass('base_red_color');
										}
									}
									$('#admin_request_sent').show('fade','slow',function(){
										window.setTimeout(function(){
											$('#admin_request_sent').hide('fade','slow');	
										},1500);
									});
								});
								admin_input.focus();
								admin_input.popover('destroy');
								selected_admin = -1;
							});
							selected_admin = -1;
						}
					}else{
						if(content){
							if($('.popover-content').html() != content){
								$('.popover-content').html(content);
								selected_admin = -1;
								$('.suggested_admin').off('click');
								$('.suggested_admin').click(function(){
									var request_info = {community_id:admin_input.attr('data-community-id'),community_name:admin_input.attr('data-community-name'),user_id:$('.suggested_admin').eq(selected_admin).attr('id')};
									module.socket.emit('request_admin',request_info,function(success){
										if(success){
											$('#admin_request_sent').text('Request sent');
											if(!$('#admin_request_sent').hasClass('base_green_color')){
												$('#admin_request_sent').removeClass('base_red_color');
												$('#admin_request_sent').addClass('base_green_color');
											}
										}else{
											$('#admin_request_sent').text('Limit reached');
											if(!$('#admin_request_sent').hasClass('base_red_color')){
												$('#admin_request_sent').removeClass('base_green_color');
												$('#admin_request_sent').addClass('base_red_color');
											}
										}
										$('#admin_request_sent').show('fade','slow',function(){
											window.setTimeout(function(){
												$('#admin_request_sent').hide('fade','slow');	
											},1500);
										});
									});
									admin_input.focus();
									admin_input.popover('destroy');
									selected_admin = -1;
								});
							}
						}else{
							admin_input.popover('destroy');
							selected_admin = -1;
						}
					}
				},
				error:function(){
				}
			});
		}else{
			$(this).popover('destroy');
			selected_admin = -1;
		}
	}
});

/* Sends a message to the server via module.sockets*/
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
							module.socket.emit('message_sent',{message:mssg_sent,responseto:0,y_dim:0,parent:0,tmp_mssg_cnt:module.tmp_mssg_cnt},function(info){
								$('.enter_hint').text('Sent');
								var tmp_message = $('#chat_display').find('.tmp_chat_mssg_' + info.tmp_mssg_cnt);
								tmp_message.removeClass('tmp_chat_mssg_' + info.tmp_mssg_cnt);
								tmp_message.attr('id','mssg_cont_' + info.id);
								tmp_message.find('.js_mssg').attr('id','message_' + info.id);
								tmp_message.find('.js_mssg_upvote').attr('id','mssg_upvote_' + info.id);
								tmp_message.find('.upvote_count').attr('id','mssg_votes_' + info.id);
								tmp_message.find('.js_mssg_downvote').attr('id','mssg_downvote_' + info.id);
								tmp_message.find('.toggle_responses').attr('id','toggle_' + info.id);
								tmp_message.find('.glyphicon-remove').attr('id','remove_' + info.id);
								tmp_message.find('.reply_link').attr('data-mssg-id',info.id);
							});
							module.tmp_mssg_cnt++;
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
							module.socket.emit('message_sent',{message:mssg_sent,responseto:responseto,y_dim:y_dim,parent:resp_parent,tmp_mssg_cnt:module.tmp_mssg_cnt},function(info){
								$('.enter_hint').text('Sent');
								var tmp_message = $('#chat_display').find('.tmp_chat_message_' + info.tmp_mssg_cnt);
								tmp_message.removeClass('tmp_chat_mssg_' + info.tmp_mssg_cnt);
								tmp_message.attr('id','mssg_cont_' + info.id);
								tmp_message.find('.js_mssg').attr('id','message_' + info.id);
								tmp_message.find('.js_mssg_upvote').attr('id','mssg_upvote_' + info.id);
								tmp_message.find('.upvote_count').attr('id','mssg_votes_' + info.id);
								tmp_message.find('.js_mssg_downvote').attr('id','mssg_downvote_' + info.id);
								tmp_message.find('.toggle_responses').attr('id','toggle_' + info.id);
								tmp_message.find('.glyphicon-remove').attr('id','remove_' + info.id);
								tmp_message.find('.reply_link').attr('data-mssg-id',info.id);
							});	
							module.tmp_mssg_cnt++;
						}
						if(!module.stop_scroll){
							module.scroll_mod_active = 0;
							$('.chat_main').mCustomScrollbar('scrollTo','bottom',{scrollInertia:0});	
							window.setTimeout(function(){
								module.scroll_mod_active = 1;
							},100);
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


$('.modal').on('hide.bs.modal',function(){
	$('.form-control').tooltip('destroy');
});

$('#search_input').on('focus',function(e){
	e.stopPropagation();
	if($('#search_input').val() == ""){
		$('#community_dropdown').html('');
	}
	$(this).dropdown();
	$('#community_dropdown').show();
});

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

$('#mssg_requests').blur(function(){
	$(this).popover('hide');
});
$('#global_requests').blur(function(){
	$(this).popover('hide');
});
$('#friend_requests').blur(function(){
	$(this).popover('hide');
});

$('#login_form').submit(function(){
	var username = $('#username').val();
	var pass = $('#pass').val();
	if(username.length > 0 && pass.length > 0){
		var res = validateLogin(username,pass,0);
		if(!res){
			return false;
		}
	}else{
		return false;
	}
	return true;
});

$('#mobile_login_form').submit(function(){
	var username = $('#mobile_username').val();
	var pass = $('#mobile_pass').val();
	if(username.length > 0 && pass.length > 0){
		var res = validateLogin(username,pass,1);
		if(!res){
			return false;
		}
	}else{
		return false;
	}
	return true;
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

$('#home_form_v3').submit(function(){
	var title = $('#Title_v3').val();
	var link = $('#Link_v3').val();
	var communities = $('#Communities_v3').val();
	var desc = $('#description_v3').val();
	$('.form_error').hide();
	$('.form-group').attr('class','form-group');
	if(title.length < 5 || title.length > module.max_title_length){
		$('#Title_v3').attr('data-original-title','Title must be between 5 and ' + module.max_title_length + ' characters');
		$('#Title_v3').tooltip('show');
		$('#title_group_v3').attr('class','form-group has-error');
		return false;
	}
	if(communities.split(' ')[0] == "" || communities.split(' ').length > 5){
		$('#communities_group_v3').attr('class','form-group has-error');		
		$('#Communities_v3').attr('data-original-title','Must have at least 1 community but less than 6');
		$('#Communities_v3').tooltip({placement:'bottom',trigger:'focus'});
		$('#Communities_v3').tooltip('show');
		return false;
	}else{
		communities = communities.split(' ');
		$.each(communities,function(index,value){
			value = value.replace('#','');
			if((value.length < 3 || value.length > 20) && value.length != 0){
				$('#communities_group_v3').attr('class','form-group has-error');
				$('#Communities_v3').attr('data-original-title','Communities must be between 3 and 20 characters');
				$('#Communities_v3').tooltip({placement:'bottom',trigger:'focus'});
				$('#Communities_v3').tooltip('show');
				return false;
			}
		});
	}
	if(desc.length > module.max_static_length){
		$('#description_group_v3').attr('class','form-group has-error');
		$('#description_v3').tooltip('show');
	}
	$('#home_form_v3').append('<input type="hidden" name="js_key" value="js_enabled" id="js_key">');
	return true;
});

$('#home_form_v2').submit(function(){
	if(cookiesEnabled()){
		var title = $('#Title_v2').val();
		var link = $('#Link_v2').val();
		var communities = $('#Communities_v2').val();
		var desc = $('#description').val();
		$('.form_error').hide();
		$('.form-group').attr('class','form-group');
		if(title.length < 5 || title.length > module.max_title_length){
			$('#Title_v2').attr('data-original-title','Title must be between 5 and ' + module.max_title_length + ' characters');
			$('#Title_v2').tooltip('show');
			$('#title_group_v2').attr('class','form-group has-error');
			return false;
		}
		if(communities.split(' ')[0] == "" || communities.split(' ').length > 5){
			$('#communities_group_v2').attr('class','form-group has-error');		
			$('#Communities_v2').attr('data-original-title','Must have at least 1 community but less than 6');
			$('#Communities_v2').tooltip({placement:'bottom',trigger:'focus'});
			$('#Communities_v2').tooltip('show');
			return false;
		}else{
			communities = communities.split(' ');
			$.each(communities,function(index,value){
				value = value.replace('#','');
				if((value.length < 3 || value.length > 20) && value.length != 0){
					$('#communities_group_v2').attr('class','form-group has-error');
					$('#Communities_v2').attr('data-original-title','Communities must be between 3 and 20 characters');
					$('#Communities_v2').tooltip({placement:'bottom',trigger:'focus'});
					$('#Communities_v2').tooltip('show');
					return false;
				}
			});
		}
		if(desc.length > module.max_static_length){
			$('#description_group').attr('class','form-group has-error');
			$('#description').tooltip('show');
		}
		$('#home_form_v2').append('<input type="hidden" name="js_key" value="js_enabled" id="js_key">');
		return true;
	}else{
		$('#Title_v2').attr('data-original-title','You must enable cookies to post chats');
		$('#Title_v2').tooltip('show');
		return false;
	}
});

$('#community_edit_form').submit(function(){
	var desc = $('#edit_community_desc').val();
	var info = $('#edit_community_info').val();
	if(desc.length > module.max_static_length){
		$('#community_desc_group').attr('class','form-group has-error');
		$('#edit_community_desc').tooltip('show');
		return false;
	}
	if(info.length > module.max_info_length){
		$('#community_info_group').attr('class','form-group has-error');
		$('#edit_community_info').tooltip('show');
		return false;
	}
	return true;
});

$('#community_create_form').submit(function(){
	var name = $('#create_community_name').val();
	var desc = $('#create_community_desc').val();
	var info = $('#create_community_info').val();
	if(name.length < 3 || name.length > 20){
		$('#create_name_group').attr('class','form-group has-error');
		$('#create_community_name').attr('data-original-title','Communities must be between 3 and 20 characters');
		$('#create_community_name').tooltip('show');
		return false;
	}
	if(!validateCommunity(name)){
		$('#create_name_group').attr('class','form-group has-error');
		$('#create_community_name').attr('data-original-title','Communities must be unique');
		$('#create_community_name').tooltip('show');
		return false;
	}
	if(desc.length > module.max_static_length){
		$('#create_desc_group').attr('class','form-group has-error');
		$('#create_community_desc').tooltip('show');
		return false;
	}
	if(info.length > module.max_info_length){
		$('#create_info_group').attr('class','form-group has-error');
		$('#create_community_info').tooltip('show');
		return false;
	}
	return true;
});

$('body').on('submit','.reply_forms',function(){
	var author = $(this).parent().find('.mssg_op').attr('data-author');
	if(author !== module.user_tracker && author.match(/[a-zA-Z]/g)){
		module.socket.emit('notify_response',$(this).children('#reply_to').val());
	}
});
