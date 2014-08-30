var buildify = require('buildify');

buildify.task({
	name:'concat',
	task:function(){
		buildify().concat(['common.js','home.js'])
			.uglify()
			.save('home.min.js');
		buildify().concat(['common.js','chat.js'])
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
		buildify().load('home.min.js')
			.perform(function(content){
				content = content.replace(/mutualcog\.com/g,'www.mutualcog.com');
				return content.replace(/localhost/g,'dev.mutualcog.com');
			})
			.save('home.min.js');
		buildify().load('chat.min.js')
			.perform(function(content){
				content = content.replace(/mutualcog\.com/g,'www.mutualcog.com');
				return content.replace(/localhost/g,'dev.mutualcog.com');
			})
			.save('chat.min.js');
		buildify().load('info.min.js')
			.perform(function(content){
				content = content.replace(/mutualcog\.com/g,'www.mutualcog.com');
				return content.replace(/localhost/g,'dev.mutualcog.com');
			})
			.save('info.min.js');
	}
});

