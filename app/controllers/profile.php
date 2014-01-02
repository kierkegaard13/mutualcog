<?php

class Profile extends BaseController {
	
	public function getFriend($friend_id){
		if(Auth::check()){
			if(Auth::user()->id != $friend_id){
				$interaction = new Interactions();
				$interaction->user_id = Auth::user()->id;
				$interaction->interaction_id = $friend_id;
				$interaction = $interaction->findAll();
				if($interaction){
					$interaction->friended = 1;
					$interaction->bond = $interaction->bond + 50;
					$interaction->save();
					return Redirect::to(Session::get('curr_page'));
				}else{
					$interaction = new Interactions();
					$interaction->user_id = $friend_id;
					$interaction->interaction_id = Auth::user()->id;
					$interaction = $interaction->findAll();
					if($interaction){
						$interaction->friended = 1;
						$interaction->bond = $interaction->bond + 50;
						$interaction->save();
						return Redirect::to(Session::get('curr_page'));
					}else{
						$interaction = new Interactions();
						$interaction->user_id = Auth::user()->id;
						$interaction->interaction_id = $friend_id;
						$interaction->friended = 1;
						$interaction->bond = 50;
						$interaction->save();
						return Redirect::to(Session::get('curr_page'));
					}
				}
			}
		}
		return Redirect::to(Session::get('curr_page'));
	}

	public function getUnfriend($friend_id){
		if(Auth::check()){
			if(Auth::user()->id != $friend_id){
				$interaction = new Interactions();
				$interaction->user_id = Auth::user()->id;
				$interaction->interaction_id = $friend_id;
				$interaction = $interaction->findAll();
				if($interaction){
					$interaction->friended = 0;
					$interaction->bond = $interaction->bond - 50;
					$interaction->save();
					return Redirect::to(Session::get('curr_page'));
				}else{
					$interaction = new Interactions();
					$interaction->user_id = $friend_id;
					$interaction->interaction_id = Auth::user()->id;
					$interaction = $interaction->findAll();
					if($interaction){
						$interaction->friended = 0;
						$interaction->bond = $interaction->bond - 50;
						$interaction->save();
						return Redirect::to(Session::get('curr_page'));
					}else{
						return Redirect::to(Session::get('curr_page'));
					}
				}
			}
		}
		return Redirect::to(Session::get('curr_page'));
	}

	public function getProfilevisit(){
		if(Auth::check()){
			if(Auth::user()->id != $profile_id){
				$profile_id = Input::get('profile_id');
				$interaction = new Interactions();
				$interaction->user_id = Auth::user()->id;
				$interaction->interaction_id = $profile_id;
				$interaction = $interaction->findAll();
				if($interaction){
					$interaction->bond = $interaction->bond + 5;
					$interaction->save();
					return 1;
				}else{
					$interaction = new Interactions();
					$interaction->user_id = $profile_id;
					$interaction->interaction_id = Auth::user()->id;
					$interaction = $interaction->findAll();
					if($interaction){
						$interaction->bond = $interaction->bond + 5;
						$interaction->save();
						return 1;
					}else{
						$interaction = new Interactions();
						$interaction->user_id = Auth::user()->id;
						$interaction->interaction_id = $profile_id;
						$interaction->bond = 5;
						$interaction->save();
						return 1;
					}
				}
			}
		}
		return 1;
	}

	public function getCheckuser(){
		$username = htmlentities(Input::get('username'));
		$user = new User();
		$user->name = ucfirst($username);
		if($user->findAll()){
			return 0;
		}else{
			return 1;
		}
	}

	public function getCheckalpha(){
		$username = htmlentities(Input::get('username'));
		if(preg_match('/[a-zA-Z]/',$username)){
			return 1;
		}else{
			return 0;
		}
	}

	public function getCheckcredentials(){
		$username = ucfirst(htmlentities(Input::get('username')));
		$pass = htmlentities(Input::get('pass'));
		$user = new User();
		$user->name = $username;
		if($user->findAll()){
			$user = $user->findAll();
			if(Crypt::decrypt($user->password) == $pass){
				return 1;
			}
		}
		return 0;
	}

	public function getLogout(){
		Auth::logout();
		return Redirect::to(Session::get('curr_page'));
	}

	public function postNewuser(){
		$username = htmlentities(Input::get('username'));
		$pass = htmlentities(Input::get('pass'));
		$pass2 = htmlentities(Input::get('pass2'));
		if($username && $pass && $pass2){
			$user = new User();
			if(preg_match('/[a-zA-z]/',$username)){
				$user->name = ucfirst($username);
			}else{
				return Redirect::to(Session::get('curr_page'))->with('error','Your username must contain at least 1 character');
			}
			if($user->findAll()){
				$user = $user->findAll();
				if(Crypt::decrypt($user->password) == $pass && $pass == $pass2){
					$user->last_login = date(DATE_ATOM);
					$user->save();
					Auth::login($user);
				}
				return Redirect::to(Session::get('curr_page'));
			}
			$user->password = Crypt::encrypt($pass);
			$user->last_login = date(DATE_ATOM);
			$user->save();
			$user = $user->findAll();
			Auth::login($user);
			return Redirect::to(Session::get('curr_page'));
		}elseif($username && $pass){
			$user = new User();
			$user->name = ucfirst($username);
			$user = $user->findAll();
			if(Crypt::decrypt($user->password) == $pass){
				$user->last_login = date(DATE_ATOM);
				$user->save();
				Auth::login($user);
			}
			return Redirect::to(Session::get('curr_page'));
		}else{
			return Redirect::to(Session::get('curr_page'));
		}
	}

}
