<?php

class TagsController extends BaseController {

	public function getSimilarTag(){
		$input = htmlentities(Input::get('tag'));
		$tag_arr = array();
		$tag = new Tags();
		$tag = $tag->where('name','LIKE','%' . $input . '%')->take(5)->get();
		foreach($tag as $t){
			$tag_arr[] = array('id' => $t->id,'name' => $t->name,'chat_id' => $t->chat_id);
		}
		return $tag_arr;
	}
}

