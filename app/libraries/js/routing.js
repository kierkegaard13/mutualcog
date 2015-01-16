$('body').on('click','.mutual_route',function(){
	var route_url = $(this).attr('href');
	var route_uri = route_url.replace('//','');
	route_uri = route_uri.slice(route_uri.indexOf('/'));
	$(this).addClass('highlight_light_blue');
	$.ajax({
		type:'GET',
		url:route_url,
		success:function(hresp){
			module.url_state.unshift({html:$('#main').html(),url:document.URL});
			window.history.pushState(null,null,route_uri);	
			$('#main').html(hresp);
			startup();
		}
	});
	return false;
});

window.onpopstate = function(e){
	var state = module.url_state.shift();
	$('#main').html(state.html);
};
