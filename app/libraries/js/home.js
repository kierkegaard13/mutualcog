var selected_tag = -1;
var selected_mod = -1;

$(document).ready(function(){
	$('.chat_status_indicator').tooltip();
	$('.advanced_cog').tooltip();
	$('#pause_chat').tooltip();
	$('.chat_content').on('click','.mssg_icon',deleteIt);
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
					res += '<div class="response_to_' + val.responseto + ' mssg_cont y_' + val.y_dim + ' parent_' + val.parent + ' pad_l_10" id="mssg_cont_' + val.id + '">';
					res += '<div class="mssg_cont_inner"><div class="chat_mssg" id="message_' + val.id + '"> <div class="row" style="margin:0;"> <div class="mssg_body_cont"> <div class="chat_vote_box">';
					if(upvoted.indexOf(val.id) != -1){
						res += '<span class="glyphicon glyphicon-chevron-up mssg_upvote" id="mssg_upvote_' + val.id + '" style="color:#57bf4b" data-toggle="tooltip" data-original-title="You must be logged in to vote on responses" data-container="body" data-placement="top"></span> <div class="upvote_count" id="mssg_votes_' + val.id + '">' + (val.upvotes - val.downvotes) + '</div> <span class="glyphicon glyphicon-chevron-down mssg_downvote" id="mssg_downvote_' + val.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on responses" data-container="body" data-placement="bottom"></span></div>';
					}else if(downvoted.indexOf(val.id) != -1){
						res += '<span class="glyphicon glyphicon-chevron-up mssg_upvote" id="mssg_upvote_' + val.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on responses" data-container="body" data-placement="top"></span> <div class="upvote_count" id="mssg_votes_' + val.id + '">' + (val.upvotes - val.downvotes) + '</div> <span class="glyphicon glyphicon-chevron-down mssg_downvote" id="mssg_downvote_' + val.id + '" style="color:red;" data-toggle="tooltip" data-original-title="You must be logged in to vote on responses" data-container="body" data-placement="bottom"></span></div>';
					}else{
						res += '<span class="glyphicon glyphicon-chevron-up mssg_upvote" id="mssg_upvote_' + val.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on responses" data-container="body" data-placement="top"></span> <div class="upvote_count" id="mssg_votes_' + val.id + '">' + (val.upvotes - val.downvotes) + '</div> <span class="glyphicon glyphicon-chevron-down mssg_downvote" id="mssg_downvote_' + val.id + '" data-toggle="tooltip" data-original-title="You must be logged in to vote on responses" data-container="body" data-placement="bottom"></span></div>';
					}
					res += '<div class="mssg_body author_' + val.author + '">';
					res += '<div id="toggle_' + val.id + '" class="toggle_responses"> <span class="caret caret_tooltip" id="caret_' + val.id + '" data-toggle="tooltip" data-original-title="Hide Responses" data-container="body" data-placement="top"></span> </div>';
					if(val.message != 'This response has been deleted' && (module.serial_tracker == val.author || module.user_tracker == val.author)){
						res += '<span id="remove_' + val.id + '" class="glyphicon glyphicon-remove mssg_icon" data-mssg-serial="' + val.serial + '" style="margin-right:5px;" data-toggle="tooltip" title="Delete post" data-container="body" data-placement="top"></span>';	
					}
					if(val.author == $('#chat_admin_info').text()){
						res += '<span class="glyphicon glyphicon-star"></span>';	
					}
					res += '<strong class="mssg_op" data-author="' + val.author + '" style="color:' + module.color_arr[val.serial % 7] + '"> ' + val.author + ' (<span class="response_count" id="' + val.id + '">' + val.responses + '</span>)</strong> : ' + val.message;
					res += '<div class="time_box">';
					if($('.chat_status_indicator').hasClass('glyphicon-pause')){
						res += '<div class="reply"><a href="#" class="reply_link" data-mssg-id="' + val.id + '"><strong>Reply</strong></a></div>';
					}
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
	$('#user_props').change(function(){
		module.socket.emit('change_user_props',{props:$(this).val()});
	});
	var reply_form = $('#reply_form').clone();
	$('.remove_mod').tooltip();
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
	$('.remove_mod').click(function(e){
		var tag_id = $(this).attr('id').split('_')[3];
		var user_id = $(this).attr('id').split('_')[2];
		window.location.href = '//mutualcog.com/tags/remove-mod/' + user_id + '/' + tag_id; 
	});
	$('a.remove_chat_link').click(function(e){
		var remove_link = $('#remove_modal').find('#remove_chat_final');
		var remove_link_href = remove_link.attr('href');
		if($(this).attr('data-chat-id').split('_')[0] == 'soft'){
			remove_link.attr('href',remove_link_href.substring(0,remove_link_href.lastIndexOf('/') - 11) + 'soft-remove/' + $(this).attr('data-chat-id').split('_')[1]);
		}else{
			remove_link.attr('href',remove_link_href.substring(0,remove_link_href.lastIndexOf('/') - 11) + 'hard-remove/' + $(this).attr('data-chat-id').split('_')[1]);
		}
		$('#remove_modal').modal();
		return false;
	});
	$('.reply_link').on('click',function(){
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
});

module.socket.on('connect',function() {
	console.log('Client has connected');
	module.connected = 1;
	if(module.chat_id){
		module.socket.emit('room',module.chat_id);
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

function validateLink(link){
	var response = $.ajax({
		type:'GET',
		data:{link:link},
		url:'//mutualcog.com/chats/validate-link',
		async:false,
	}).responseText;
	if(response == 1){
		return 1;
	}else{
		return 0;
	}
}

$('#home_form_v2').submit(function(){
	if(cookiesEnabled()){
		var title = $('#Title_v2').val();
		var link = $('#Link_v2').val();
		var tags = $('#Tags_v2').val();
		var desc = $('#description').val();
		$('.form_error').hide();
		$('.form-group').attr('class','form-group');
		if(title.length < 5 || title.length > module.max_title_length){
			$('#Title_v2').attr('data-original-title','Title must be between 5 and ' + module.max_title_length + ' characters');
			$('#Title_v2').tooltip('show');
			$('#title_group_v2').attr('class','form-group has-error');
			return false;
		}
		if(link.length > 0){
			var res = validateLink(link);
			if(!res){
				$('#link_group_v2').attr('class','form-group has-error');
				$('#Link_v2').tooltip('show');
				return false;
			}
		}
		if(tags.split(' ')[0] == "" || tags.split(' ').length > 5){
			$('#tags_group_v2').attr('class','form-group has-error');		
			$('#Tags_v2').attr('data-original-title','Must have at least 1 tag but less than 6');
			$('#Tags_v2').tooltip({placement:'bottom',trigger:'focus'});
			$('#Tags_v2').tooltip('show');
			return false;
		}else{
			tags = tags.split(' ');
			$.each(tags,function(index,value){
				value = value.substr(1);
				if((value.length < 3 || value.length > 20) && value.length != 0){
					$('#tags_group_v2').attr('class','form-group has-error');
					$('#Tags_v2').attr('data-original-title','Tags must be between 3 and 20 characters');
					$('#Tags_v2').tooltip({placement:'bottom',trigger:'focus'});
					$('#Tags_v2').tooltip('show');
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

$('#home_form_v3').submit(function(){
	var title = $('#Title_v3').val();
	var link = $('#Link_v3').val();
	var tags = $('#Tags_v3').val();
	var desc = $('#description_v3').val();
	$('.form_error').hide();
	$('.form-group').attr('class','form-group');
	if(title.length < 5 || title.length > module.max_title_length){
		$('#Title_v3').attr('data-original-title','Title must be between 5 and ' + module.max_title_length + ' characters');
		$('#Title_v3').tooltip('show');
		$('#title_group_v3').attr('class','form-group has-error');
		return false;
	}
	if(link.length > 0){
		var res = validateLink(link);
		if(!res){
			$('#link_group_v3').attr('class','form-group has-error');
			$('#Link_v3').tooltip('show');
			return false;
		}
	}
	if(tags.split(' ')[0] == "" || tags.split(' ').length > 5){
		$('#tags_group_v3').attr('class','form-group has-error');		
		$('#Tags_v3').attr('data-original-title','Must have at least 1 tag but less than 6');
		$('#Tags_v3').tooltip({placement:'bottom',trigger:'focus'});
		$('#Tags_v3').tooltip('show');
		return false;
	}else{
		tags = tags.split(' ');
		$.each(tags,function(index,value){
			value = value.substr(1);
			if((value.length < 3 || value.length > 20) && value.length != 0){
				$('#tags_group_v3').attr('class','form-group has-error');
				$('#Tags_v3').attr('data-original-title','Tags must be between 3 and 20 characters');
				$('#Tags_v3').tooltip({placement:'bottom',trigger:'focus'});
				$('#Tags_v3').tooltip('show');
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

$('#tag_edit_form').submit(function(){
	var desc = $('#edit_tag_desc').val();
	var info = $('#edit_tag_info').val();
	if(desc.length > module.max_static_length){
		$('#tag_desc_group').attr('class','form-group has-error');
		$('#edit_tag_desc').tooltip('show');
		return false;
	}
	if(info.length > module.max_info_length){
		$('#tag_info_group').attr('class','form-group has-error');
		$('#edit_tag_info').tooltip('show');
		return false;
	}
	return true;
});

function validateTag(tag){
	var response = $.ajax({
		type:'GET',
		data:{tag:tag},
		url:'//mutualcog.com/tags/validate-name',
		async:false,
	}).responseText;
	if(response == 1){
		return 1;
	}else{
		return 0;
	}
}

$('#tag_create_form').submit(function(){
	var name = $('#create_tag_name').val();
	var desc = $('#create_tag_desc').val();
	var info = $('#create_tag_info').val();
	if(name.length < 3 || name.length > 20){
		$('#create_name_group').attr('class','form-group has-error');
		$('#create_tag_name').attr('data-original-title','Tags must be between 3 and 20 characters');
		$('#create_tag_name').tooltip('show');
		return false;
	}
	if(!validateTag(name)){
		$('#create_name_group').attr('class','form-group has-error');
		$('#create_tag_name').attr('data-original-title','Tags must be unique');
		$('#create_tag_name').tooltip('show');
		return false;
	}
	if(desc.length > module.max_static_length){
		$('#create_desc_group').attr('class','form-group has-error');
		$('#create_tag_desc').tooltip('show');
		return false;
	}
	if(info.length > module.max_info_length){
		$('#create_info_group').attr('class','form-group has-error');
		$('#create_tag_info').tooltip('show');
		return false;
	}
	return true;
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
				$('.suggested_tags').css('color','');
				$('.suggested_tags').eq(selected_tag).css('color','#57bf4b');
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

$('#mod_input').on('keydown',function(e){
	if(e.keyCode == 13){  /*enter key*/
		if(selected_mod != -1){
			var request_info = {tag_id:$(this).attr('data-tag-id'),tag_name:$(this).attr('data-tag-name'),user_id:$('.suggested_mods').eq(selected_mod).attr('id')};
			module.socket.emit('request_mod',request_info,function(){
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
		var tag_id = $(this).attr('data-tag-id');
		if(mod.length > 2){
			var mod_input = $(this);
			$(this).on('blur',function(){
				if($('.popover').length){
					$(this).popover('hide');
				}
			});
			$.ajax({
				type:'GET',
				data: {mod:mod,tag_id:tag_id},
				url:'//mutualcog.com/tags/similar-user',
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
								var request_info = {tag_id:mod_input.attr('data-tag-id'),tag_name:mod_input.attr('data-tag-name'),user_id:$('.suggested_mods').eq(selected_mod).attr('id')};
								module.socket.emit('request_mod',request_info,function(){
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
									var request_info = {tag_id:mod_input.attr('data-tag-id'),tag_name:mod_input.attr('data-tag-name'),user_id:$('.suggested_mods').eq(selected_mod).attr('id')};
									module.socket.emit('request_mod',request_info,function(){
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

