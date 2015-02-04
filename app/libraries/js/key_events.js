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

