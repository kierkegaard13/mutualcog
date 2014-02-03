var selected_tag = -1;

updateChatTimes = function(){
	$.each($('.chat_time'),function(index,value){
		$(this).text(moment.utc($(this).attr('id')).fromNow());
	});
	if($('.last_login').length){
		$('.last_login').html('<strong>Last login: </strong>' + moment.utc($('.last_login').attr('id')).fromNow());
	}
}

$(document).ready(function(){
	updateChatTimes();
	setInterval(updateChatTimes,60000);
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

$('#Tags').on('keydown',function(e){
	if(e.keyCode == 13){  /*enter key*/
		if(selected_tag != -1){
			var curr_val = $('#Tags').val().split(' ');
			curr_val.pop();
			curr_val.push('#' + $('.suggested_tags').eq(selected_tag).text());
			$('#Tags').val(curr_val.join(' ') + ' #');
			$('#Tags').focus();
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

$('#Tags').on('keyup',function(e){
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
							$('#Tags').popover({html:true});
							$('#Tags').attr('data-content',content);
							$('#Tags').popover('show');
							$('.suggested_tags').click(function(){
								var curr_val = $('#Tags').val().split(' ');
								curr_val.pop();
								curr_val.push('#' + $(this).text());
								$('#Tags').val(curr_val.join(' ') + ' #');
								$('#Tags').focus();
								$('#Tags').popover('destroy');
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
									var curr_val = $('#Tags').val().split(' ');
									curr_val.pop();
									curr_val.push('#' + $(this).text());
									$('#Tags').val(curr_val.join(' ') + ' #');
									$('#Tags').focus();
									$('#Tags').popover('destroy');
									selected_tag = -1;
								});
							}
						}else{
							$('#Tags').popover('destroy');
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
