<?php

class TagsController extends BaseController {

	public function getAssignAdmin($tag_id){
		if(Auth::check()){
			$tag = Tags::find($tag_id);
			$user_to_tag = UsersToTags::whereuser_id(Auth::user()->id)->wheretag_id($tag_id)->first();
			$owner = UsersToTags::wheretag_id($tag_id)->whereis_admin('1')->first();
			if(Auth::user()->owned() < 1 && $user_to_tag && !$owner){
				if($user_to_tag->is_mod){
					$user_to_tag->is_mod = 0;
				}
				$user_to_tag->is_admin = 1;
				$user_to_tag->save();
			}
		}
		return $this->returnToCurrPage();
	}

	public function getAcceptMod($request_id,$tag_id){
		if(!isset($request_id) || !isset($tag_id)){
			return App::abort(404,'You seem to have entered an invalid URL');
		}
		$request = Notifications::find($request_id);
		if(Auth::check() && $request){
			$sender_id = $request->sender_id;
			if(Auth::user()->id != $sender_id && Auth::user()->id == $request->user_id){
				$user_to_tag = UsersToTags::whereuser_id(Auth::user()->id)->wheretag_id($tag_id)->first();
				$tag = Tags::find($tag_id);
				if($user_to_tag && count($tag->moderators()) <= 20){
					$user_to_tag->is_mod = 1;
					$user_to_tag->save();
				}
				$request->delete();
			}
		}
		return $this->returnToCurrPage();
	}

	public function getDeclineMod($request_id,$tag_id){
		if(!isset($request_id) || !isset($tag_id)){
			return App::abort(404,'You seem to have entered an invalid URL');
		}
		$request = Notifications::find($request_id);
		if(Auth::check() && $request){
			$sender_id = $request->sender_id;
			if(Auth::user()->id != $sender_id && Auth::user()->id == $request->user_id){
				$request->delete();
			}
		}
		return $this->returnToCurrPage();
	}

	public function getAcceptAdmin($request_id,$tag_id){
		if(!isset($request_id) || !isset($tag_id)){
			return App::abort(404,'You seem to have entered an invalid URL');
		}
		$request = Notifications::find($request_id);
		if(Auth::check() && $request){
			$sender_id = $request->sender_id;
			if(Auth::user()->id != $sender_id && Auth::user()->id == $request->user_id){
				$user_to_tag = UsersToTags::whereuser_id(Auth::user()->id)->wheretag_id($tag_id)->first();
				$tag = Tags::find($tag_id);
				$owner = UsersToTags::wheretag_id($tag_id)->whereis_admin('1')->first();
				if($user_to_tag && $owner){
					$owner->is_admin = 0;
					$owner->save();
					$user_to_tag->is_mod = 0;
					$user_to_tag->is_admin = 1;
					$user_to_tag->save();
				}
				$request->delete();
			}
		}
		return $this->returnToCurrPage();
	}

	public function getDeclineAdmin($request_id,$tag_id){
		if(!isset($request_id) || !isset($tag_id)){
			return App::abort(404,'You seem to have entered an invalid URL');
		}
		$request = Notifications::find($request_id);
		if(Auth::check() && $request){
			$sender_id = $request->sender_id;
			if(Auth::user()->id != $sender_id && Auth::user()->id == $request->user_id){
				$request->delete();
			}
		}
		return $this->returnToCurrPage();
	}

	public function getRemoveMod($mod_id,$tag_id){
		if(Auth::check()){
			if(Auth::user()->tag_admin == $tag_id || Auth::user()->id == $mod_id){
				$user_to_tag = UsersToTags::whereuser_id($mod_id)->wheretag_id($tag_id)->first();
				$user_to_tag->is_mod = 0;
				$user_to_tag->save();
			}
		}
		return $this->returnToCurrPage();
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

	public function getSimilarMod(){
		$mod_input = htmlentities(Input::get('mod'));
		$tag_id = htmlentities(Input::get('tag_id'));
		$res_arr = array();
		$mod = new User();
		$mod = $mod->select('users.*')->where('name','LIKE','%' . $mod_input . '%')->join('users_to_tags','users_to_tags.user_id','=','users.id')->where('users_to_tags.tag_id',$tag_id)->where('users_to_tags.is_admin','0')->where('users_to_tags.is_mod','0')->take(5)->get();
		foreach($mod as $m){
			$res_arr[] = array('id' => $m->id,'name' => $m->name);
		}
		return $res_arr;
	}

	public function getSimilarAdmin(){
		$admin_input = htmlentities(Input::get('admin'));
		$tag_id = htmlentities(Input::get('tag_id'));
		$res_arr = array();
		$admin = new User();
		$admin = $admin->select('users.*')->where('name','LIKE','%' . $admin_input . '%')->join('users_to_tags','users_to_tags.user_id','=','users.id')->where('users_to_tags.tag_id',$tag_id)->where('users_to_tags.is_admin','0')->take(5)->get();
		foreach($admin as $a){
			$res_arr[] = array('id' => $a->id,'name' => $a->name);
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
		return $this->returnToCurrPage();
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
		return $this->returnToCurrPage();
	}

	public function getValidateName(){
		$validator = Validator::make(
				array(
					'name' => htmlentities(Input::get('name')) 
				     ),
				array(
					'name' => 'required|unique:tags'
				     )
				);
		if($validator->fails()){
			return 0;
		}else{
			return 1;
		}
	}

	public function postEditTag(){
		if(Auth::check()){
			$tag_id = htmlentities(Input::get('tag_id'));
			$description = htmlentities(Input::get('description'));
			$raw_info = htmlentities(Input::get('info'));
			$validator = Validator::make(
					array(
						'id' => $tag_id,
						'description' => $description,
						'info' => $raw_info
					     ),
					array(
						'id' => 'required',
						'description' => "max:$this->max_description_length",
						'info' => "max:$this->max_info_length"
					     )
					);
			if(!$validator->fails()){
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
		}
		return $this->returnToCurrPage();
	}

	public function postCreateTag(){
		if(Auth::check()){
			$tag_name = htmlentities(Input::get('tag_name'));
			$tag_desc = htmlentities(Input::get('description'));
			$raw_info = htmlentities(Input::get('info'));
			$validator = Validator::make(
					array(
						'name' => $tag_name,
						'description' => $tag_desc,
						'info' => $raw_info
					     ),
					array(
						'name' => 'required|between:3,20|unique:tags',
						'description' => "max:$this->max_description_length",
						'info' => "max:$this->max_info_length"
					     )
					);
			if(!$validator->fails()){
				$tag = new Tags();
				$tag->name = str_replace('#','',$tag_name);
				$tag->description = $tag_desc;
				$tag->raw_info = $raw_info;
				$tag->info = $this->parseText($raw_info);
				$tag->admin = Auth::user()->name;
				$tag->admin_id = Auth::user()->id;
				$tag->save();
				$tag = $tag->findAll();
				$user_to_tag = new UsersToTags();
				$user_to_tag->user_id = Auth::user()->id;
				$user_to_tag->tag_id = $tag->id;
				$user_to_tag->is_admin = 1;
				$user_to_tag->save();
			}
		}
		return Redirect::to("/t/$tag->name");
	}
}

