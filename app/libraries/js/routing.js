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
