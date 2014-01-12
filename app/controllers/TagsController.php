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
			$tag = Tags::find($tag_id);
			if($tag->admin == '0' && Auth::user()->owned() < 3){
				$usertag->is_admin = 1;
				$tag->admin = Auth::user()->name;
				$tag->save();
			}
			$usertag->tag_id = htmlentities($tag_id);
			$usertag->user_id = Auth::user()->id;
			$usertag->score = 1;
			$usertag->save();
		}
		return Redirect::to(Session::get('curr_page'));
	}

	public function getUnsubscribe($tag_id){
		if(Auth::check()){
			$usertag = UsersToTags::whereuser_id(Auth::user()->id)->wheretag_id($tag_id)->first();
			$tag = Tags::find($tag_id);
			if($tag->admin == Auth::user()->name){
				$tag->admin = '0';
				$tag->save();
			}
			if($usertag){
				$usertag->delete();
			}
		}
		return Redirect::to(Session::get('curr_page'));
	}
}

