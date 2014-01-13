var buildify = require('buildify');

buildify.task({
	name:'concat',
	task:function(){
		buildify().concat(['jquery-1.10.2.min.js','moment.min.js'])
			.save('common_alt.min.js');
		buildify().concat('common.js')
			.uglify()
			.save('common.min.js');
		buildify().concat(['jquery-1.10.2.min.js','jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.min.js','moment.min.js'])
			.save('chat_alt.min.js');
		buildify().load('chat.js')
			.uglify()
			.save('chat.min.js');
		buildify().load('info.js')
			.uglify()
			.save('info.min.js');
	}
});

buildify.task({
	name:'replace',
	task:function(){
		buildify().load('common.min.js')
			.perform(function(content){
				return content.replace(/mutualcog\.com/g,'www.mutualcog.com');
			})
			.save('common.min.js');
		buildify().load('chat.min.js')
			.perform(function(content){
				return content.replace(/mutualcog\.com/g,'www.mutualcog.com');
			})
			.save('chat.min.js');
		buildify().load('info.min.js')
			.perform(function(content){
				return content.replace(/mutualcog\.com/g,'www.mutualcog.com');
			})
			.save('info.min.js');
		buildify().load('profile.min.js')
			.perform(function(content){
				return content.replace(/mutualcog\.com/g,'www.mutualcog.com');
			})
			.save('profile.min.js');
	}
});

