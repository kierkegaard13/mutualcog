<?php

class Community extends BaseController {

	public function getAssignAdmin($community_id){
		if(Auth::check()){
			$community = Communities::find($community_id);
			$user_to_community = UsersToCommunities::whereuser_id(Auth::user()->id)->wherecommunity_id($community_id)->first();
			$owner = UsersToCommunities::wherecommunity_id($community_id)->whereis_admin('1')->first();
			if(Auth::user()->owned() < 1 && $user_to_community && !$owner){
				if($user_to_community->is_mod){
					$user_to_community->is_mod = 0;
				}
				$user_to_community->is_admin = 1;
				$user_to_community->save();
			}
		}
		return $this->returnToCurrPage();
	}

	public function getAcceptMod($request_id,$community_id){
		if(!isset($request_id) || !isset($community_id)){
			return App::abort(404,'You seem to have entered an invalid URL');
		}
		$request = Notifications::find($request_id);
		if(Auth::check() && $request){
			$sender_id = $request->sender_id;
			if(Auth::user()->id != $sender_id && Auth::user()->id == $request->user_id){
				$user_to_community = UsersToCommunities::whereuser_id(Auth::user()->id)->wherecommunity_id($community_id)->first();
				$community = Communities::find($community_id);
				if($user_to_community && count($community->moderators()) <= 20){
					$user_to_community->is_mod = 1;
					$user_to_community->save();
				}
				$request->delete();
			}
		}
		return $this->returnToCurrPage();
	}

	public function getDeclineMod($request_id,$community_id){
		if(!isset($request_id) || !isset($community_id)){
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

	public function getAcceptAdmin($request_id,$community_id){
		if(!isset($request_id) || !isset($community_id)){
			return App::abort(404,'You seem to have entered an invalid URL');
		}
		$request = Notifications::find($request_id);
		if(Auth::check() && $request){
			$sender_id = $request->sender_id;
			if(Auth::user()->id != $sender_id && Auth::user()->id == $request->user_id){
				$user_to_community = UsersToCommunities::whereuser_id(Auth::user()->id)->wherecommunity_id($community_id)->first();
				$community = Communities::find($community_id);
				$owner = UsersToCommunities::wherecommunity_id($community_id)->whereis_admin('1')->first();
				if($user_to_community && $owner){
					$owner->is_admin = 0;
					$owner->save();
					$user_to_community->is_mod = 0;
					$user_to_community->is_admin = 1;
					$user_to_community->save();
				}
				$request->delete();
			}
		}
		return $this->returnToCurrPage();
	}

	public function getDeclineAdmin($request_id,$community_id){
		if(!isset($request_id) || !isset($community_id)){
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

	public function getRemoveMod($mod_id,$community_id){
		if(Auth::check()){
			if(Auth::user()->community_admin == $community_id || Auth::user()->id == $mod_id){
				$user_to_community = UsersToCommunities::whereuser_id($mod_id)->wherecommunity_id($community_id)->first();
				$user_to_community->is_mod = 0;
				$user_to_community->save();
			}
		}
		return $this->returnToCurrPage();
	}

	public function getPinPost($chat_id,$community_id){
		$chat = ChatsToCommunities::wherechat_id($chat_id)->wherecommunity_id($community_id)->first();
		if($chat){
			$chat->pinned = 1;
			$chat->save();
		}
		return $this->returnToCurrPage();
	}

	public function getUnpinPost($chat_id,$community_id){
		$chat = ChatsToCommunities::wherechat_id($chat_id)->wherecommunity_id($community_id)->first();
		if($chat){
			$chat->pinned = 0;
			$chat->save();
		}
		return $this->returnToCurrPage();
	}

	public function getSimilarTag(){
		$input = htmlentities(Input::get('community'));
		$res_arr = array();
		$community = new Communities();
		$community = $community->where('name','LIKE','%' . $input . '%')->take(5)->get();
		foreach($community as $t){
			$res_arr[] = array('id' => $t->id,'name' => $t->name);
		}
		return $res_arr;
	}

	public function getSimilarMod(){
		$mod_input = htmlentities(Input::get('mod'));
		$community_id = htmlentities(Input::get('community_id'));
		$res_arr = array();
		$mod = new User();
		$mod = $mod->select('users.*')->where('name','LIKE','%' . $mod_input . '%')->join('users_to_communities','users_to_communities.user_id','=','users.id')->where('users_to_communities.community_id',$community_id)->where('users_to_communities.is_admin','0')->where('users_to_communities.is_mod','0')->take(5)->get();
		foreach($mod as $m){
			$res_arr[] = array('id' => $m->id,'name' => $m->name);
		}
		return $res_arr;
	}

	public function getSimilarAdmin(){
		$admin_input = htmlentities(Input::get('admin'));
		$community_id = htmlentities(Input::get('community_id'));
		$res_arr = array();
		$admin = new User();
		$admin = $admin->select('users.*')->where('name','LIKE','%' . $admin_input . '%')->join('users_to_communities','users_to_communities.user_id','=','users.id')->where('users_to_communities.community_id',$community_id)->where('users_to_communities.is_admin','0')->take(5)->get();
		foreach($admin as $a){
			$res_arr[] = array('id' => $a->id,'name' => $a->name);
		}
		return $res_arr;
	}

	public function getSubscribe($community_id){
		if(Auth::check()){
			$usercommunity = new UsersToCommunities();
			$usercommunity->community_id = htmlentities($community_id);
			$usercommunity->user_id = Auth::user()->id;
			if($usercommunity->findAll()){
				return $this->returnToCurrPage();
			}
			$usercommunity->score = 1;
			$usercommunity->save();
		}
		return $this->returnToCurrPage();
	}

	public function getUnsubscribe($community_id){
		if(Auth::check()){
			$usercommunity = UsersToCommunities::whereuser_id(Auth::user()->id)->wherecommunity_id($community_id)->first();
			$community = Communities::find($community_id);
			if($community->admin == Auth::user()->name){
				$community->admin = '0';
				$community->save();
			}
			if($usercommunity){
				$usercommunity->delete();
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
					'name' => 'required|unique:communities'
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
			$community_id = htmlentities(Input::get('community_id'));
			$description = htmlentities(Input::get('description'));
			$raw_info = htmlentities(Input::get('info'));
			$validator = Validator::make(
					array(
						'id' => $community_id,
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
				$community = Communities::find($community_id);
				if($community){
					if(Auth::user()->community_admin == $community_id){
						$community->description = $description;
						$community->raw_info = $raw_info;
						$community->info = $this->parseText($raw_info);
						$community->save();
					}
				}
			}
		}
		return $this->returnToCurrPage();
	}

	public function postCreateTag(){
		if(Auth::check()){
			$community_name = htmlentities(Input::get('community_name'));
			$community_desc = htmlentities(Input::get('description'));
			$raw_info = htmlentities(Input::get('info'));
			$community_tier = 0;
			if(Auth::user()->is_admin || Auth::user()->is_mod){
				$community_tier = htmlentities(Input::get('community_tier'));
			}
			$validator = Validator::make(
					array(
						'name' => $community_name,
						'description' => $community_desc,
						'info' => $raw_info
					     ),
					array(
						'name' => 'required|between:3,20|unique:communities',
						'description' => "max:$this->max_description_length",
						'info' => "max:$this->max_info_length"
					     )
					);
			if(!$validator->fails()){
				$community = new Communities();
				$community->name = str_replace('#','',$community_name);
				$community->description = $community_desc;
				$community->raw_info = $raw_info;
				$community->info = $this->parseText($raw_info);
				$community->admin = Auth::user()->name;
				$community->admin_id = Auth::user()->id;
				$community->tier = $community_tier;
				$community->save();
				$community = $community->findAll();
				$user_to_community = new UsersToCommunities();
				$user_to_community->user_id = Auth::user()->id;
				$user_to_community->community_id = $community->id;
				$user_to_community->is_admin = 1;
				$user_to_community->save();
			}
		}
		return Redirect::to("/t/$community->name");
	}
}

