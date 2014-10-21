<?php

class Privacy extends BaseController {

	public function getIndex(){
		$view = View::make('privacy');
		$communities = Communities::take(30)->orderBy('popularity','desc')->paginate(25);
		$view['communities'] = $communities;
		Session::put('curr_page',URL::full());
		return $view;
	}

}
