<?php

class Terms extends BaseController {

	public function getIndex(){
		$view = View::make('terms');
		Session::put('curr_page',URL::full());
		return $view;
	}

}
