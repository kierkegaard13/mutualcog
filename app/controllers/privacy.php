<?php

class Privacy extends BaseController {

	public function getIndex(){
		$view = View::make('privacy');
		Session::put('curr_page',URL::full());
		$view['is_live_chat'] = 0;
		$view['is_static_chat'] = 0;
		$view['is_community'] = 0;
		return $view;
	}

}
