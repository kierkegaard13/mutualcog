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
