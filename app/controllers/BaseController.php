<?php

class BaseController extends Controller {

	protected $base_url = 'http://localhost/laravel';
	protected $site_url = 'http://mutualcog.com';
	protected $file_url = '/var/www/laravel';

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
			View::share('logged_in','0');
		}
		View::share('base',$this->base_url);
		View::share('site',$this->site_url);
		View::share('version','v=.1');
		View::share('server_time',date(DATE_ATOM));
		View::share('serial',Session::get('unique_serial'));
		View::share('serial_id',Session::get('serial_id'));
	}

	protected function setupLayout()
	{
		if ( ! is_null($this->layout))
		{
			$this->layout = View::make($this->layout);
		}
	}

}
