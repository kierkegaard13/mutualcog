<?php

class TagsController extends BaseController {

	public function getAssignAdmin($user_id,$tag_id){
		if(Auth::check()){
			$tag = Tags::find($tag_id);
			$user_to_tag = UsersToTags::whereuser_id($user_id)->wheretag_id($tag_id)->first();
			if(Auth::user()->owned() < 1 && $tag && Auth::user()->id == $user_id && $user_to_tag){
				if($user_to_tag->is_mod){
					$user_to_tag->is_mod = 0;
				}
				$user_to_tag->is_admin = 1;
				$user_to_tag->save();
			}
		}
		if(Session::has('curr_page')){
			return Redirect::to(Session::get('curr_page'));
		}
		return Redirect::to('home');
	}

	public function getAcceptMod($request_id,$tag_id){
		if(!isset($request_id) || !isset($tag_id)){
			return App::abort(404,'You seem to have entered an invalid URL');
		}
		$request = Requests::find($request_id);
		if(Auth::check() && $request){
			$friend_id = $request->sender_id;
			if(Auth::user()->id != $friend_id && Auth::user()->id == $request->user_id){
				$user_to_tag = UsersToTags::whereuser_id(Auth::user()->id)->wheretag_id($tag_id)->first();
				$user_to_tag->is_mod = 1;
				$user_to_tag->save();
				$request->delete();
			}
		}
		if(Session::has('curr_page')){
			return Redirect::to(Session::get('curr_page'));
		}
		return Redirect::to('home');
	}

	public function getDeclineMod($request_id,$tag_id){
		if(!isset($request_id) || !isset($tag_id)){
			return App::abort(404,'You seem to have entered an invalid URL');
		}
		$request = Requests::find($request_id);
		if(Auth::check() && $request){
			$friend_id = $request->sender_id;
			if(Auth::user()->id != $friend_id && Auth::user()->id == $request->user_id){
				$request->delete();
			}
		}
		if(Session::has('curr_page')){
			return Redirect::to(Session::get('curr_page'));
		}
		return Redirect::to('home');
	}

	public function getRemoveMod($mod_id,$tag_id){
		if(Auth::check()){
			if(Auth::user()->tag_admin == $tag_id || Auth::user()->id == $mod_id){
				$user_to_tag = UsersToTags::whereuser_id($mod_id)->wheretag_id($tag_id)->first();
				$user_to_tag->is_mod = 0;
				$user_to_tag->save();
			}
		}
		if(Session::has('curr_page')){
			return Redirect::to(Session::get('curr_page'));
		}
		return Redirect::to('home');
	}

	public function getSimilarTag(){
		$input = htmlentities(Input::get('tag'));
		$res_arr = array();
		$tag = new Tags();
		$tag = $tag->where('name','LIKE','%' . $input . '%')->take(5)->get();
		foreach($tag as $t){
			$res_arr[] = array('id' => $t->id,'name' => $t->name);
		}
		return $res_arr;
	}

	public function getSimilarEntity(){
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

	public function getSimilarUser(){
		$mod_input = htmlentities(Input::get('mod'));
		$tag_id = htmlentities(Input::get('tag_id'));
		$res_arr = array();
		$mod = new User();
		$mod = $mod->select('users.*')->where('name','LIKE','%' . $mod_input . '%')->join('users_to_tags','users_to_tags.user_id','=','users.id')->where('users_to_tags.tag_id',$tag_id)->take(5)->get();
		foreach($mod as $m){
			$res_arr[] = array('id' => $m->id,'name' => $m->name);
		}
		return $res_arr;
	}

	public function getSubscribe($tag_id){
		if(Auth::check()){
			$usertag = new UsersToTags();
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

