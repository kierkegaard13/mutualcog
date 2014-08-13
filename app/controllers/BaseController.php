<?php

class BaseController extends Controller {

	protected $base_url = 'http://localhost/laravel';
	protected $site_url = 'http://mutualcog.com';
	protected $io_url = 'localhost:3000';
	protected $file_url = '/var/www/laravel';
	protected $max_title_length = 300;
	protected $max_chat_mssg_length = 2500;
	protected $max_static_length = 10000;
	protected $max_description_length = 100;
	protected $max_info_length = 10000;
	protected $max_user_length = 20;


	/**
	 * Setup the layout used by the controller.
	 *
	 * @return void
	 */
	public function __construct(){
		if(Auth::check()){
			View::share('user',Auth::user());
			View::share('logged_in','1');
		}else{
			View::share('user','');
			View::share('logged_in','0');
		}
		$this->sid = Session::getId();
		View::share('sid',$this->sid);
		View::share('base',$this->base_url);
		View::share('site',$this->site_url);
		View::share('io_url',$this->io_url);
		View::share('curr_tag_id','');
		View::share('version','v=.3');
		View::share('server_time',date(DATE_ATOM));
		View::share('serial',Session::get('unique_serial'));
		View::share('serial_id',Session::get('serial_id'));
		View::share('max_title_length',$this->max_title_length);
		View::share('max_chat_mssg_length',$this->max_chat_mssg_length);
		View::share('max_static_length',$this->max_static_length);
		View::share('max_description_length',$this->max_description_length);
		View::share('max_info_length',$this->max_info_length);
		View::share('max_user_length',$this->max_user_length);
	}

	public function parseText($text){
		$text = Parsedown::instance()->set_breaks_enabled(true)->parse($text);
		$reg1 = '/(\s)(https?:\/\/)?([\da-z-\.]+)\.([a-z]{2,6})([\/\w\.-]*)*\/?/';
		$reg2 = '/>(https?:\/\/)?([\da-z-\.]+)\.([a-z]{2,6})([\/\w\.-]*)*\/?/';
		$reg3 = '/(img)(\s)(alt)/';
		$text = preg_replace('/^<p>/','',$text);
		$text = preg_replace('/<\/p>$/','',$text);
		$text = preg_replace($reg1,"$1<a class='chat_link' href='\/\/$3.$4$5'>$3.$4$5</a>",$text);
		$text = preg_replace($reg2,"><a class='chat_link' href='\/\/$2.$3$4'>$2.$3$4</a>",$text);
		$text = preg_replace($reg3,"$1$2style='max-width:300px;max-height:200px;margin-bottom:5px;' $3",$text);
		if(preg_match("/\/p\/([^\s]*)(<)/",$text)){
			$text = preg_replace("/\/p\/([^\s]*)(<)/","<a class='chat_link' href='\/\/mutualcog.com/p/$1'>/p/$1</a>$2",$text);
		}else{
			$text = preg_replace("/\/p\/([^\s]*)(\s*)/","<a class='chat_link' href='\/\/mutualcog.com/p/$1'>/p/$1</a>$2",$text);
		}
		if(preg_match("/\/t\/([^\s]*)(<)/",$text)){
			$text = preg_replace("/\/t\/([^\s]*)(<)/","<a class='chat_link' href='\/\/mutualcog.com/t/$1'>/t/$1</a>$2",$text);
		}else{
			$text = preg_replace("/\/t\/([^\s]*)(\s*)/","<a class='chat_link' href='\/\/mutualcog.com/t/$1'>/t/$1</a>$2",$text);
		}
		if(preg_match("/\@([^\s]*)(<)/",$text)){
			$text = preg_replace("/\@([^\s]*)(<)/","<a class='chat_link' href='\/\/mutualcog.com/p/$1'>@$1</a>$2",$text);
		}else{
			$text = preg_replace("/\@([^\s]*)(\s*)/","<a class='chat_link' href='\/\/mutualcog.com/p/$1'>@$1</a>$2",$text);
		}
		if(preg_match("/\#([^\s]*)(<)/",$text)){
			$text = preg_replace("/\#([^\s]*)(<)/","<a class='chat_link' href='\/\/mutualcog.com/t/$1'>#$1</a>$2",$text);
		}else{
			$text = preg_replace("/\#([^\s]*)(\s*)/","<a class='chat_link' href='\/\/mutualcog.com/t/$1'>#$1</a>$2",$text);
		}
		$patterns = array('/&gt;:\\|/','/&gt;:\\(/','/&lt;3/','/:\\)/','/:D/','/:\\|/',"/:\\'\\(/",'/:O/','/:P/','/T_T/','/:\\(/','/:\\//');
		$replace = array(
			'<img style="height:18px;" src="//dev.mutualcog.com/laravel/app/emoji/angry.png"></img>',
			'<img style="height:18px;" src="//dev.mutualcog.com/laravel/app/emoji/rage.png"></img>',
			'<img style="height:18px;" src="//dev.mutualcog.com/laravel/app/emoji/heart.png"></img>',
			'<img style="height:18px;" src="//dev.mutualcog.com/laravel/app/emoji/smile.png"></img>',
			'<img style="height:18px;" src="//dev.mutualcog.com/laravel/app/emoji/smiley.png"></img>',
			'<img style="height:18px;" src="//dev.mutualcog.com/laravel/app/emoji/neutral_face.png"></img>',
			'<img style="height:18px;" src="//dev.mutualcog.com/laravel/app/emoji/cry.png"></img>',
			'<img style="height:18px;" src="//dev.mutualcog.com/laravel/app/emoji/open_mouth.png"></img>',
			'<img style="height:18px;" src="//dev.mutualcog.com/laravel/app/emoji/stuck_out_tongue_closed_eyes.png"></img>',
			'<img style="height:18px;" src="//dev.mutualcog.com/laravel/app/emoji/sob.png"></img>',
			'<img style="height:18px;" src="//dev.mutualcog.com/laravel/app/emoji/disappointed.png"></img>',
			'<img style="height:18px;" src="//dev.mutualcog.com/laravel/app/emoji/confused.png"></img>'
		);
		$text = preg_replace($patterns,$replace,$text);
		return $text;
	}

	protected function setupLayout()
	{
		if ( ! is_null($this->layout))
		{
			$this->layout = View::make($this->layout);
		}
	}

}
