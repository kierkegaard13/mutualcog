<?php

class Terms extends BaseController {

	public function getIndex(){
		$view = View::make('terms');
		$communities = Communities::take(30)->orderBy('popularity','desc')->paginate(25);
		$view['communities'] = $communities;
		Session::put('curr_page',URL::full());
		return $view;
	}

}
