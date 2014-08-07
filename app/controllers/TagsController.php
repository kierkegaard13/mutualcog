<?php

class TagsController extends BaseController {

	public function getSimilarTag(){
		$input = htmlentities(Input::get('tag'));
		$res_arr = array();
		$tag = new Tags();
		$tag = $tag->where('name','LIKE','%' . $input . '%')->take(5)->get();
		foreach($tag as $t){
			$res_arr[] = array('id' => $t->id,'name' => $t->name,'type' => 'tag');
		}
		$people = new User();
		$people = $people->where('name','LIKE','%' . $input . '%')->take(5)->get();
		foreach($people as $person){
			$res_arr[] = array('id' => $person->id,'name' => $person->name,'type' => 'person');
		}
		return $res_arr;
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
		if(Session::has('curr_page')){
			return Redirect::to(Session::get('curr_page'));
		}
		return Redirect::to('home');
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
		if(Session::has('curr_page')){
			return Redirect::to(Session::get('curr_page'));
		}
		return Redirect::to('home');
	}

	public function postEditTag(){
		if(Auth::check()){
			$tag_id = htmlentities(Input::get('tag_id'));
			$description = htmlentities(Input::get('description'));
			$raw_info = htmlentities(Input::get('info'));
			$tag = Tags::find($tag_id);
			if($tag){
				if(Auth::user()->tag_admin == $tag_id){
					$tag->description = $description;
					$tag->raw_info = $raw_info;
					$tag->info = $this->parseText($raw_info);
					$tag->save();
				}
			}
		}
		if(Session::has('curr_page')){
			return Redirect::to(Session::get('curr_page'));
		}
		return Redirect::to('home');
	}
}

