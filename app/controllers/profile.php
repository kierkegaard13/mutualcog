<?php

class Profile extends BaseController {
	
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
					$interaction->friended = 1;
					$interaction->bond = $interaction->bond + 50;
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
				$about = Parsedown::instance()->set_breaks_enabled(true)->parse($about);
				$reg1 = '/(\s)(https?:\/\/)?([\da-z-\.]+)\.([a-z]{2,6})([\/\w\.-]*)*\/?/';
				$reg2 = '/>(https?:\/\/)?([\da-z-\.]+)\.([a-z]{2,6})([\/\w\.-]*)*\/?/';
				$reg3 = '/(img)(\s)(alt)/';
				$about = preg_replace($reg1,"$1<a class='chat_link' href='\/\/$3.$4$5'>$3.$4$5</a>",$about);
				$about = preg_replace($reg2,"><a class='chat_link' href='\/\/$2.$3$4'>$2.$3$4</a>",$about);
				$about = preg_replace($reg3,"$1$2style='max-width:300px;max-height:200px;margin-bottom:5px;' $3",$about);
				if(preg_match("/\/p\/([^\s]*)(<)/",$about)){
					$about = preg_replace("/\/p\/([^\s]*)(<)/","<a class='chat_link' href='\/\/mutualcog.com/p/$1'>/p/$1</a>$2",$about);
				}else{
					$about = preg_replace("/\/p\/([^\s]*)(\s*)/","<a class='chat_link' href='\/\/mutualcog.com/p/$1'>/p/$1</a>$2",$about);
				}
				if(preg_match("/\/t\/([^\s]*)(<)/",$about)){
					$about = preg_replace("/\/t\/([^\s]*)(<)/","<a class='chat_link' href='\/\/mutualcog.com/t/$1'>/t/$1</a>$2",$about);
				}else{
					$about = preg_replace("/\/t\/([^\s]*)(\s*)/","<a class='chat_link' href='\/\/mutualcog.com/t/$1'>/t/$1</a>$2",$about);
				}
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
		Auth::logout();
		$elephant = new ElephantIO\Client('http://localhost:3000');
		$elephant->init();
		$elephant->emit('logoff',json_encode(array('sid' => Session::getId(),'key' => 'pyWTPC2pqMCsmTEy')));
		$elephant->close();
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
					$user->last_login = date(DATE_ATOM);
					$user->save();
					Auth::login($user);
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
			}
			return Redirect::to(Session::get('curr_page'));
		}else{
			return Redirect::to(Session::get('curr_page'));
		}
	}

}
