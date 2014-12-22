<?php

class Privacy extends BaseController {

	public function getIndex(){
		$view = View::make('privacy');
		Session::put('curr_page',URL::full());
		return $view;
	}

}
