var selected_tag = -1;
var selected_mod = -1;

$(document).ready(function(){
	$('.chat_status_indicator').tooltip();
	$('.advanced_cog').tooltip();
	$('#pause_chat').tooltip();
	$('.mssg_upvote').on('click',upvoteMssg);
	$('.mssg_downvote').on('click',downvoteMssg);
	$('#user_props').change(function(){
		module.socket.emit('change_user_props',{props:$(this).val()});
	});
	var reply_form = $('#reply_form').clone();
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
	$('a#tag_edit').click(function(e){
		var tag_cont = $(this).parents('.side_content');
		$('#input_tag_id').val(tag_cont.find('#tag_id_str').text());
		$('#input_tag_info').val(tag_cont.find('#tag_info_str').text());
		$('#input_tag_desc').val(tag_cont.find('#tag_desc_str').text());
		$('#tag_edit_modal').modal();
		return false;
	});
	$('a.edit_chat_link').click(function(e){
		var chat_cont = $(this).parents('.chat_title_box');
		$('#Title_v3').val(chat_cont.find('.chat_title_str').text());
		$('#Link_v3').val(chat_cont.find('.chat_link_str').text());
		$('#Tags_v3').val(chat_cont.find('.chat_tag_str').text());
		$('#description_v3').val(chat_cont.find('.chat_desc_str').text());
		$('#live_status_v3').val(chat_cont.find('.chat_live_str').text());
		$('#form_chat_id').val(chat_cont.find('.chat_id_str').text());
		$('#edit_modal').modal();
		return false;
	});
	$('a.remove_chat_link').click(function(e){
		var remove_link = $('#remove_modal').find('#remove_chat_final');
		remove_link.attr('href',$(this).attr('data-remove-link'));
		$('#remove_modal').modal();
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

$('#home_form_v3').submit(function(){
	if(cookiesEnabled()){
		var submit = 1;
		var title = $('#Title_v3').val();
		var tags = $('#Tags_v3').val();
		$('.form_error').hide();
		$('.form-group').attr('class','form-group');
		if(title.length < 3 || title.length > 180){
			$('#Title_v3').attr('data-original-title','Title must be longer than 2 characters but less than 180');
			$('#Title_v3').tooltip('show');
			$('#title_group_v3').attr('class','form-group has-error');
			submit = 0;
		}
		if(tags.split(' ')[0] == "" || tags.split(' ').length > 5){
			$('#tags_group_v3').attr('class','form-group has-error');		
			$('#Tags_v3').attr('data-original-title','Must have at least 1 tag but less than 6');
			$('#Tags_v3').tooltip({placement:'bottom',trigger:'focus'});
			$('#Tags_v3').tooltip('show');
			submit = 0;
		}else{
			tags = tags.split(' ');
			$.each(tags,function(index,value){
				value = value.substr(1);
				if((value.length < 3 || value.length > 19) && value.length != 0){
					$('#tags_group_v3').attr('class','form-group has-error');
					$('#Tags_v3').attr('data-original-title','Tags must be longer than 2 characters but less than 20');
					$('#Tags_v3').tooltip({placement:'bottom',trigger:'focus'});
					$('#Tags_v3').tooltip('show');
					submit = 0;
					return false;
				}
			});
		}
		if(submit){
			$('#home_form_v3').append('<input type="hidden" name="js_key" value="js_enabled" id="js_key">');
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

$(window).on('click',function(e){
	$('#tag_dropdown').hide();
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
				$('.suggested_tags').removeClass('base_green_color');
				$('.suggested_tags').eq(selected_tag).addClass('base_green_color');
			}
			return false;
		}
	}else if(e.keyCode == 40){  /*down arrow*/
		if($('.popover').length != 0){
			if(selected_tag != $('.suggested_tags').length - 1){
				selected_tag += 1;
				$('.suggested_tags').removeClass('base_green_color');
				$('.suggested_tags').eq(selected_tag).addClass('base_green_color');
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

$('#mod_input').on('keydown',function(e){
	if(e.keyCode == 13){  /*enter key*/
		if(selected_mod != -1){
			var request_info = {user_id:$('.suggested_mods').eq(selected_mod).attr('id'),user:$('.suggested_mods').eq(selected_mod).text(),sender_id:module.user_id,sender:module.user_tracker,tag_id:$(this).attr('data-tag-id'),tag_name:$(this).attr('data-tag-name')};
			module.socket.emit('request_mod',request_info,function(){
				$('#mod_request_sent').show('fade',function(){
					window.setTimeout(function(){
						$('#mod_request_sent').hide('fade');
					},1500);
				});
			});
			$(this).popover('destroy');
			$(this).val('');
			$(this).focus();
		}
		return false;
	}else if(e.keyCode == 38){  /*up arrow*/
		if($('.popover').length != 0){
			if(selected_mod != 0){
				selected_mod += 1;
				$('.suggested_mods').removeClass('base_green_color');
				$('.suggested_mods').eq(selected_mod).addClass('base_green_color');
			}
			return false;
		}
	}else if(e.keyCode == 40){  /*down arrow*/
		if($('.popover').length != 0){
			if(selected_mod != $('.suggested_mods').length - 1){
				selected_mod -= 1;
				$('.suggested_mods').removeClass('base_green_color');
				$('.suggested_mods').eq(selected_mod).addClass('base_green_color');
			}
			return false;
		}
	}
});

$('#mod_input').on('keyup',function(e){
	if(e.keyCode == 32 || e.keyCode == 13){  
		/*space bar*/
	}else if(e.keyCode == 38 || e.keyCode == 40){
		/*up arrow or down arrow*/
	}else{
		var guess = $(this).val();
		if(guess.length > 2){
			var mods_input = $(this);
			var tag_id = $(this).attr('data-tag-id');
			$(this).on('blur',function(){
				if($('.popover').length){
					$(this).popover('hide');
				}
			});
			$.ajax({
				type:'GET',
				data: {mod:guess,tag_id:tag_id},
				url:'//mutualcog.com/tags/similar-user',
				success:function(hresp){
					var content = '';
					$.each(hresp,function(index,value){
						content += '<div class="suggested_mods" id="' + value.id + '">' + value.name + '</div>';
					});
					if($('.popover').length == 0){
						if(content){
							mods_input.popover({html:true});
							mods_input.attr('data-content',content);
							mods_input.popover('show');
							$('.suggested_mods').click(function(){
								var request_info = {user_id:$('.suggested_mods').eq(selected_mod).attr('id'),user:$('.suggested_mods').eq(selected_mod).text(),sender_id:module.user_id,sender:module.user_tracker,tag_id:$(this).attr('data-tag-id'),tag_name:$(this).attr('data-tag-name')};
								module.socket.emit('request_mod',request_info,function(){
									$('#mod_request_sent').show('fade',function(){
										window.setTimeout(function(){
											$('#mod_request_sent').hide('fade');
										},1500);
									});
								});
								mods_input.focus();
								mods_input.popover('destroy');
								mods_input.val('');
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
									var request_info = {user_id:$('.suggested_mods').eq(selected_mod).attr('id'),user:$('.suggested_mods').eq(selected_mod).text(),sender_id:module.user_id,sender:module.user_tracker,tag_id:$(this).attr('data-tag-id'),tag_name:$(this).attr('data-tag-name')};
									module.socket.emit('request_mod',request_info,function(){
										$('#mod_request_sent').show('fade',function(){
											window.setTimeout(function(){
												$('#mod_request_sent').hide('fade');
											},1500);
										});
									});
									mods_input.focus();
									mods_input.popover('destroy');
									mods_input.val('');
									selected_mod = -1;
								});
							}
						}else{
							mods_input.popover('destroy');
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

