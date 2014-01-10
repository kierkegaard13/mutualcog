<?php

class Privacy extends BaseController {

	public function getIndex(){
		$view = View::make('privacy');
		$tags = Tags::take(20)->orderBy('popularity','desc')->paginate(25);
		$view['tags'] = $tags;
		Session::put('curr_page',URL::full());
		return $view;
	}

}
