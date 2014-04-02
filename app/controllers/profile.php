<?php

class Profile extends BaseController {

	public function getRequestFriend($friend_id){
		if(Auth::check()){
			try{
				$elephant = new ElephantIO\Client($this->io_url);
				$elephant->init();
				$elephant->emit('login',json_encode(array('sid' => Session::getId(), 'user_data' => array('id' => Auth::user()->id,'user' => Auth::user()->name,'serial' => Auth::user()->serial->serial_id,'serial_id' => Auth::user()->serial->id),'key' => 'pyWTPC2pqMCsmTEy')));
				$elephant->close();
			}catch(Exception $e){
			}
		}
		return Redirect::to(Session::get('curr_page'));
	}
	
	public function getFriend($friend_id){
		if(!isset($friend_id)){
			return App::abort(404,'You seem to have entered an invalid URL');
		}
		if(Auth::check()){
			if(Auth::user()->id != $friend_id){
				$interaction = Interactions::whereHas('users',function($q){$q->where('interaction_users.user_id',Auth::user()->id);})
					->whereHas('users',function($q)use($friend_id){$q->where('interaction_users.user_id',$friend_id);})
					->wheretype('friendship')
					->first();
				if($interaction){
					$interaction->friended = 1;
					$interaction->bond = $interaction->bond + 50;
					$interaction->save();
				}else{
					$interaction = new Interactions();
					$interaction->friended = 1;
					$interaction->bond = 50;
					$interaction->save();
					$inter_user = new InteractionUsers();
					$inter_user->user_id = Auth::user()->id;
					$inter_user->interaction_id = $interaction->id;
					$inter_user->save();
					$inter_user = new InteractionUsers();
					$inter_user->user_id = $friend_id;
					$inter_user->interaction_id = $interaction->id;
					$inter_user->save();
				}
			}
		}
		return Redirect::to(Session::get('curr_page'));
	}

	public function getUnfriend($friend_id){
		if(!isset($friend_id)){
			return App::abort(404,'You seem to have entered an invalid URL');
		}
		if(Auth::check()){
			if(Auth::user()->id != $friend_id){
				$interaction = Interactions::whereHas('users',function($q){$q->where('interaction_users.user_id',Auth::user()->id);})
					->whereHas('users',function($q)use($friend_id){$q->where('interaction_users.user_id',$friend_id);})
					->wheretype('friendship')
					->first();
				if($interaction){
					$interaction->friended = 0;
					$interaction->bond = $interaction->bond - 50;
					$interaction->save();
				}
			}
		}
		return Redirect::to(Session::get('curr_page'));
	}

	public function getProfileVisit(){
		if(Auth::check()){
			$profile_id = Input::get('profile_id');
			if(Auth::user()->id != $profile_id){
				$interaction = Interactions::whereHas('users',function($q){$q->where('interaction_users.user_id',Auth::user()->id);})
					->whereHas('users',function($q)use($profile_id){$q->where('interaction_users.user_id',$profile_id);})
					->wheretype('friendship')
					->first();
				if($interaction){
					$interaction->bond = $interaction->bond + 5;
					$interaction->save();
				}else{
					$interaction = new Interactions();
					$interaction->bond = 5;
					$interaction->save();
					$inter_user = new InteractionUsers();
					$inter_user->user_id = Auth::user()->id;
					$inter_user->interaction_id = $interaction->id;
					$inter_user->save();
					$inter_user = new InteractionUsers();
					$inter_user->user_id = $profile_id;
					$inter_user->interaction_id = $interaction->id;
					$inter_user->save();
				}
			}
		}
		return 1;
	}

	public function postAbout(){
		$profile = User::find(Input::get('id'));
		if($profile){
			if(Auth::user()->name == $profile->name){
				$about = htmlentities(Input::get('about'));
				$about_raw = $about;
				$about = $this->parseText($about);
				$about = str_replace('[comment]','<!--',$about);
				$about = str_replace('[/comment]','-->',$about);
				$profile->about_raw = $about_raw;
				$profile->about = $about;
				$profile->save();
				return $profile->about;	
			}
		}	
		return false;
	}

	public function getCheckUser(){
		$username = htmlentities(Input::get('username'));
		$user = new User();
		$user->name = ucfirst($username);
		if($user->findAll()){
			return 0;
		}else{
			return 1;
		}
	}

	public function getCheckAlpha(){
		$username = htmlentities(Input::get('username'));
		if(preg_match('/[a-zA-Z]/',$username)){
			return 1;
		}else{
			return 0;
		}
	}

	public function getCheckCredentials(){
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
		$node = new NodeAuth();
		$node->user_id = Auth::user()->id;
		$node->user = Auth::user()->name;
		$node = $node->findAll();
		$node->authorized = 0;
		$node->save();
		Auth::logout();
		return Redirect::to(Session::get('curr_page'));
	}

	public function postNewUser(){
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
					Auth::login($user);
					$user->last_login = date(DATE_ATOM);
					$user->save();
					$node = new NodeAuth();
					$node->user_id = $user->id;
					$node->user = $user->name;
					if($node->findAll()){
						$node = $node->findAll();
						$node->serial = Session::get('unique_serial');
						$node->serial_id = Session::get('serial_id');
						$node->sid = Session::getId();
						$node->authorized = 1;
						$node->save();
					}else{
						$node->serial = Session::get('unique_serial');
						$node->serial_id = Session::get('serial_id');
						$node->sid = Session::getId();
						$node->authorized = 1;
						$node->save();
					}
				}
				return Redirect::to(Session::get('curr_page'));
			}
			$user->password = Crypt::encrypt($pass);
			$user->last_login = date(DATE_ATOM);
			$user->save();
			Auth::login($user);
			return Redirect::to(Session::get('curr_page'));
		}elseif($username && $pass){
			$user = new User();
			$user->name = ucfirst($username);
			$user = $user->findAll();
			if(Crypt::decrypt($user->password) == $pass){
				$user->last_login = date(DATE_ATOM);
				$user->serial_id = Session::get('serial_id');
				$user->save();
				Auth::login($user);
				$node = new NodeAuth();
				$node->user_id = $user->id;
				$node->user = $user->name;
				if($node->findAll()){
					$node = $node->findAll();
					$node->serial = Session::get('unique_serial');
					$node->serial_id = Session::get('serial_id');
					$node->sid = Session::getId();
					$node->authorized = 1;
					$node->save();
				}else{
					$node->serial = Session::get('unique_serial');
					$node->serial_id = Session::get('serial_id');
					$node->sid = Session::getId();
					$node->authorized = 1;
					$node->save();
				}
			}
			return Redirect::to(Session::get('curr_page'));
		}else{
			return Redirect::to(Session::get('curr_page'));
		}
	}

}
