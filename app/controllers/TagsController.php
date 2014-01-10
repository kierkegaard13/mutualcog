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

	public function getSubscribe($tag_id){
		if(Auth::check()){
			$usertag = new UsersToTags();
			$usertag->tag_id = htmlentities($tag_id);
			$usertag->user_id = Auth::user()->id;
			$usertag->score = 1;
			$usertag->save();
		}
		return Redirect::to(Session::get('curr_page'));
	}

	public function getUnsubscribe($tag_id){
		$usertag = UsersToTags::whereuser_id(Auth::user()->id)->wheretag_id($tag_id)->first();
		if($usertag){
			$usertag->delete();
		}
		return Redirect::to(Session::get('curr_page'));
	}
}

