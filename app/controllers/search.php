<?php

class Search extends BaseController {

	public function getIndex()
	{
		$view = View::make('search');
		$tags = Tags::take(20)->orderBy('popularity','desc')->paginate(25);
		Session::put('curr_page',URL::full());
		$view['tags'] = $tags;
		$view['search_page'] = 1;
		return $view;
	}
}
