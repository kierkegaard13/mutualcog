updateChatTimes = function(){
	$.each($('.chat_time'),function(index,value){
			$(this).text(moment.utc($(this).attr('id')).fromNow());
			});
	$.each($('.interaction_time'),function(index,value){
			$(this).text(moment.utc($(this).attr('id')).fromNow());
			});
	$.each($('.time'),function(index,value){
			$(this).text(moment.utc($(this).attr('id')).fromNow());
			});
	if($('.last_login').length){
		$('.last_login').html('<b>Last login: </b>' + moment.utc($('.last_login').attr('id')).fromNow());
	}
}

$(document).ready(function(){
	updateChatTimes();
	setInterval(updateChatTimes,60000);
	setTimeout(function(){
		$.ajax({
			type:'GET',
			data:{profile_id:$('.profile_name').attr('id')},
			url:'//mutualcog.com/profile/profilevisit',	
			success:function(){
				return true;
			},
			error:function(){}
		});	
	},15000);
	$('.chat_mssg').click(function(){
		window.location.href = "//mutualcog.com/chat/open/" + $('.chat_id_' + $(this).attr('id')).attr('id');
	});
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
		error:function(){}
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
	if(e.keyCode == 13){  //enter key
		if(selected_term == -1){
		}else{
			location.assign($('li#search_' + selected_term).children('a').attr('href'));
		}	
		return false;
	}else if(e.keyCode == 38){  //up arrow
		if(selected_term != 0){
			selected_term--;
			$('.tag_results').css('background-color','');
			$('li#search_' + selected_term).css('background-color','#f5f5f5');
			
		}
		return false;
	}else if(e.keyCode == 40){  //down arrow
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
	if(e.keyCode == 13){  //enter key
		return false;
	}else if(e.keyCode == 38 || e.keyCode == 40){  //up arrow or down arrow
	}else{
		if(tag.length > 2){
			$.ajax({
				type:'GET',
				data: {tag:tag},
				url:'//mutualcog.com/tags/similar-tag',
				success:function(hresp){
					var content = '';
					$.each(hresp,function(index,value){
						content += '<li id="search_' + index + '" class="tag_results"><a href="//mutualcog.com/tags/tag/' + value.name + '">' + value.name + '</a></li>';
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

