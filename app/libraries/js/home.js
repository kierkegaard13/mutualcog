var selected_community = -1;
var selected_mod = -1;
var selected_admin = -1;

$(document).ready(function(){
	$('.advanced_cog').tooltip();
	$('#pause_chat').tooltip();
	$('.chat_content').on('click','.mssg_icon',deleteIt);
	$('.glyphicon-info-sign').tooltip();
	$.each($('.interaction_time'),function(index,value){
		$(this).text(moment.utc($(this).attr('id')).fromNow());
	});
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
	$('.toggle_description').click(function(){
		var descr = $(this).parent().parent().find('.description_cont');
		if(descr.css('display') == 'none'){
			$(this).html('Hide description'); 
			descr.css('display','block');
		}else{
			$(this).html('Show description'); 
			descr.css('display','none');
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
	var reply_form = $('#reply_form').clone();
	$('.remove_mod').tooltip();
	$('#subscribe_btn').click(function(){
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
	$('#advanced_create').click(function(e){
		$('#advanced_modal').modal();
		return false;
	});
	$('#community_edit').click(function(e){
		var community_cont = $(this).parents('.side_content');
		$('#input_community_id').val(community_cont.find('#community_id_str').text());
		$('#input_community_info').val(community_cont.find('#community_info_str').text());
		$('#input_community_desc').val(community_cont.find('#community_desc_str').text());
		$('#community_edit_modal').modal();
		return false;
	});
	$('.edit_chat_link').click(function(e){
		var chat_cont = $(this).parents('.chat_title_box');
		$('#Title_v3').val(chat_cont.find('.chat_title_str').text());
		$('#Link_v3').val(chat_cont.find('.chat_link_str').text());
		$('#Communities_v3').val(chat_cont.find('.chat_community_str').text());
		$('#description_v3').val(chat_cont.find('.chat_desc_str').text());
		$('#form_chat_id').val(chat_cont.find('.chat_id_str').text());
		if(chat_cont.find('.chat_live_str').text() == 1){
			$('#live_status_v3').attr('checked',true);
		}else{
			$('#live_status_v3').attr('checked',false);
		}
		if(chat_cont.find('.chat_nsfw_str').text() == 1){
			$('#nsfw_v3').attr('checked',true);
		}else{
			$('#nsfw_v3').attr('checked',false);
		}
		$('#edit_modal').modal();
		return false;
	});
	$('.remove_mod').click(function(e){
		var community_id = $(this).attr('id').split('_')[3];
		var user_id = $(this).attr('id').split('_')[2];
		window.location.href = '//mutualcog.com/community/remove-mod/' + user_id + '/' + community_id; 
	});
	$('.remove_chat_link').click(function(e){
		$('#remove_modal').modal();
		$('#remove_chat_final').attr('href',$(this).attr('data-remove-link'));
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
	$('body').on('submit','.reply_forms',function(){
		module.socket.emit('notify_response',$(this).children('#reply_to').val());
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

$(window).on('click',function(e){
	$('#community_dropdown').hide();
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

