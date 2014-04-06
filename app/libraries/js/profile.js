updateChatTimes = function(){
	$.each($('.interaction_time'),function(index,value){
			$(this).text(moment.utc($(this).attr('id')).fromNow());
			});
}

$(document).ready(function(){
	updateChatTimes();
	setInterval(updateChatTimes,60000);
	setTimeout(function(){
		$.ajax({
			type:'GET',
			data:{profile_id:$('.profile_name').attr('id')},
			url:'//mutualcog.com/profile/profile-visit',	
			success:function(){
				return true;
			},
			error:function(){}
		});	
	},15000);
	$('button#save_about').click(function(){
		$.ajax({
			type:'POST',
			data: {about:$('#detail_text').val(),id:$('.profile_name').attr('id')},
			url:'//mutualcog.com/profile/about',
			success:function(hresp){
				$('#edit_box').hide();
				$('#about_details').html(hresp);
				$('#about_details').show();
			},
			error:function(){
			}
		});
	});
	if($('#about_details').hasClass('edit_about')){
		$('#about_details').tooltip();
		$('#about_details').click(function(){
			$(this).hide();
			$('#edit_box').show();
		});
	}
	$('.p_chat_mssg').click(function(){
		window.location.href = "//mutualcog.com/chat/live/" + $('.chat_id_' + $(this).attr('id')).attr('id');
	});
});

