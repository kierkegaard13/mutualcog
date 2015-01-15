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
