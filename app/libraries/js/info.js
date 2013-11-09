$('#feedback_form').submit(function(){
	var submit = 1;
	var type = $('#Type').val();
	var text = $('#Text').val();
	if(type == ""){
		$('#Type').tooltip('show');
		$('#type_group').attr('class','form-group has-error');
		submit = 0;
	}
	if(text.length < 20){
		$('#Text').tooltip('show');
		$('#text_group').attr('class','form-group has-error');
		submit = 0;
	}	
	if(submit){
		return true;
	}else{
		return false;
	}
});
