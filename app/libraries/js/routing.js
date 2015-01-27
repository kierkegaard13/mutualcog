$('body').on('click','.mutual_route',function(){
	var route_url = $(this).attr('href');
	var route_uri = route_url.replace('//','');
	route_uri = route_uri.slice(route_uri.indexOf('/'));
	$('.mutual_route').removeClass('highlight_light_blue');
	$(this).addClass('highlight_light_blue');
	$.ajax({
		type:'GET',
		url:route_url,
		success:function(hresp){
			module.url_state.unshift({html:$('#main').html(),url:document.URL,side:$('#side').html()});
			window.history.pushState(null,null,route_uri);	
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
				$('#community_sub_box').show();
				$('#community_info_box').show();
			}else{
				$('#community_sub_box').hide();
				$('#community_info_box').hide();
			}
			startup();
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
	var state = module.url_state.shift();
	$('#main').html(state.html);
	$('#side').html(state.side);
};
