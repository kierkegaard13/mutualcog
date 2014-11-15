<?php

class Profile extends BaseController {

	public function getRemoveNotification(){
		$note_id = Input::get('note_id');
		if($note_id){
			$notification = Notifications::find($note_id);
			if($notification){
				$notification->delete();
			}
		}
		return 1;
	}

	public function postUpdateOnlineStatus(){
		if(Auth::check()){
			$user_id = Input::get('user_id');
			$user = User::find($user_id);
			$user->online = 0;
			$user->save();
			return 1;
		}
	}

	public function getDismiss($request_id){
		if(Auth::check()){
			$request = Notifications::find($request_id);
			if($request){
				if(Auth::user()->id == $request->user_id){
					$request->delete();
				}
			}
		}
		return $this->returnToCurrPage();
	}

	public function postMessageUser($user_id){
		if(Auth::check()){
			$message_body = htmlentities(Input::get('message_body'));
			$user_to_chat = UsersToPrivateChats::whereuser_id(Auth::user()->id)->whereentity_id($user_id)->first();
			$user = User::find($user_id);
			if($user_to_chat){
				$friend_to_chat = UsersToPrivateChats::whereentity_id(Auth::user()->id)->whereuser_id($user_id)->first();
				$friend_to_chat->unseen = 1;
				$friend_to_chat->save();
				$chat = PrivateChats::find($user_to_chat->chat_id);
				$message = new PrivateMessages();
				$message->chat_id = $chat->id;
				$message->author = Auth::user()->name;
				$message->author_id = Auth::user()->id;
				$message->message = $message_body;
				$message->save();
			}else{
				$interaction = InteractionUsers::whereuser_id(Auth::user()->id)->whereentity_id($user_id)->first();
				$chat = new PrivateChats();
				$chat->total_messages = 1;
				if($interaction){
					if(!$interaction->friended){
						$chat->inboxed = 1;
					}
				}else{
					$chat->inboxed = 1;
				}
				$chat->save();
				$chat = $chat->findAll();
				$user_to_chat = new UsersToPrivateChats();
				$user_to_chat->user_id = Auth::user()->id;
				$user_to_chat->entity_id = $user_id;
				$user_to_chat->chat_id = $chat->id;
				$user_to_chat->save();
				$friend_to_chat = new UsersToPrivateChats();
				$friend_to_chat->entity_id = Auth::user()->id;
				$friend_to_chat->user_id = $user_id;
				$friend_to_chat->chat_id = $chat->id;
				$friend_to_chat->unseen = 1;
				$friend_to_chat->save();
				$message = new PrivateMessages();
				$message->chat_id = $chat->id;
				$message->author = Auth::user()->name;
				$message->author_id = Auth::user()->id;
				$message->message = $message_body;
				$message->save();
			}
			$notification = new Notifications();
			$notification->sender = Auth::user()->name;
			$notification->sender_id = Auth::user()->id;
			$notification->type = 1;
			$notification->user_id = $user_id;
			$notification->save();
			$notification = $notification->findAll();
			$notification->message = "<div class='request_cont'><div class='request_text'><a href='//mutualcog.com/u/" . Auth::user()->name . "'>" . Auth::user()->name . "</a> has sent you a <a href='//mutualcog.com/u/" . $user->name . "#inbox'>new message</a></div><div class='request_text'><a href='//mutualcog.com/profile/dismiss/" . $notification->id . "'>Dismiss</a></div></div>";
			$notification->save();
		}
		return $this->returnToCurrPage();
	}

	public function getAccept($request_id){
		if(!isset($request_id)){
			return App::abort(404,'You seem to have entered an invalid URL');
		}
		$request = Notifications::find($request_id);
		if(Auth::check() && $request){
			$friend_id = $request->sender_id;
			if(Auth::user()->id != $friend_id && Auth::user()->id == $request->user_id){
				$interaction_user = InteractionUsers::whereuser_id(Auth::user()->id)->whereentity_id($friend_id)->wheretype(0)->first();
				if($interaction_user){
					$interaction_user->friended = 1;
					$interaction_user->bond = $interaction_user->bond + 50;
					$interaction_user->save();
					$interaction_friend = InteractionUsers::whereentity_id(Auth::user()->id)->whereuser_id($friend_id)->wheretype(0)->first();
					$interaction_friend->friended = 1;
					$interaction_friend->bond = $interaction_user->bond + 50;
					$interaction_friend->save();
				}else{
					$inter_user = new InteractionUsers();
					$inter_user->user_id = Auth::user()->id;
					$inter_user->entity_id = $friend_id;
					$inter_user->friended = 1;
					$inter_user->bond = 50;
					$inter_user->save();
					$inter_friend = new InteractionUsers();
					$inter_friend->user_id = $friend_id;
					$inter_friend->entity_id = Auth::user()->id;
					$inter_friend->friended = 1;
					$inter_friend->bond = 50;
					$inter_friend->save();
				}
				$user_to_chat = UsersToPrivateChats::whereuser_id(Auth::user()->id)->whereentity_id($friend_id)->first();
				if($user_to_chat){
					$chat = PrivateChats::find($user_to_chat->chat_id);
					$chat->inboxed = 0;
					$chat->save();
				}
				$request->delete();
			}
		}
		return $this->returnToCurrPage();
	}

	public function getDecline($request_id){
		if(!isset($request_id)){
			return App::abort(404,'You seem to have entered an invalid URL');
		}
		if(Auth::check()){
			$request = Notifications::find($request_id);
			$request->delete();
		}
		return $this->returnToCurrPage();
	}

	public function getUnfriend($friend_id){
		if(!isset($friend_id)){
			return App::abort(404,'You seem to have entered an invalid URL');
		}
		if(Auth::check()){
			if(Auth::user()->id != $friend_id){
				$interaction_user = InteractionUsers::whereuser_id(Auth::user()->id)->whereentity_id($friend_id)->wheretype(0)->first();
				if($interaction_user && $interaction_user->friended == 1){
					$interaction_user->friended = 0;
					$interaction_user->bond = $interaction_user->bond - 50;
					$interaction_user->save();
					$interaction_friend = InteractionUsers::whereentity_id(Auth::user()->id)->whereuser_id($friend_id)->wheretype(0)->first();
					$interaction_friend->friended = 0;
					$interaction_friend->bond = $interaction_user->bond - 50;
					$interaction_friend->save();
				}
			}
		}
		return $this->returnToCurrPage();
	}

	public function getProfileVisit(){
		if(Auth::check()){
			$profile_id = Input::get('profile_id');
			if(Auth::user()->id != $profile_id){
				$interaction = InteractionUsers::whereuser_id(Auth::user()->id)->whereentity_id($profile_id)->wheretype(0)->first();
				if($interaction){
					$interaction->bond = $interaction->bond + 5;
					$interaction->save();
				}else{
					$inter_user = new InteractionUsers();
					$inter_user->user_id = Auth::user()->id;
					$inter_user->entity_id = $profile_id;
					$inter_user->bond = 5;
					$inter_user->save();
					$inter_friend = new InteractionUsers();
					$inter_friend->user_id = $profile_id;
					$inter_friend->entity_id = Auth::user()->id;
					$inter_friend->bond = 5;
					$inter_friend->save();
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

	public function getValidateUsername(){
		$username = htmlentities(Input::get('username'));
		$user = new User();
		$user->name = ucfirst($username);
		if($user->findAll()){
			return 2;
		}
		if(!preg_match('/[a-zA-Z]/',$username)){
			return 3;
		}
		if(preg_match('/[\[\]\s]/',$username)){
			return 4;
		}
		return 1;
	}

	public function getValidateLogin(){
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

	public function getValidateEmail(){
		$email = htmlentities(Input::get('email'));
		$validator = Validator::make(
				array(
					'email' => $email
				     ),
				array(
					'email' => 'email'
				     )
				);
		if($validator->fails()){
			return 0;
		}else{
			return 1;
		}
	}

	public function getLogout(){
		if(Auth::check()){
			Auth::user()->online = 0;
			Auth::user()->save();
			$node = new NodeAuth();
			$node->user_id = Auth::user()->id;
			$node->user = Auth::user()->name;
			if($node->findAll()){
				$node = $node->findAll();
				if(sizeof($node) > 1){
					foreach($node as $n){
						$n->delete();
					}
				}else{
					$node->delete();
				}
			}
			Auth::logout();
		}
		return $this->returnToCurrPage();
	}

	public function postRegister(){
		$username = htmlentities(Input::get('username'));
		$pass = htmlentities(Input::get('pass'));
		$pass2 = htmlentities(Input::get('pass2'));
		$email = htmlentities(Input::get('email'));
		$validator = Validator::make(
				array(
					'name' => $username,
					'password' => $pass,
					'password_confirmation' => $pass2,
					'email' => $email
				     ),
				array(
					'name' => "required|unique:users|between:3,$this->max_user_length",
					'password' => 'required|between:6,30|confirmed',
					'password_confirmation' => 'required',
					'email' => 'email'
				     )
				);
		if(!$validator->fails()){
			$user = new User();
			if(preg_match('/[a-zA-z]/',$username) && !preg_match('/[\[\]\s]/',$username)){
				$user->name = ucfirst($username);
			}else{
				if(Session::has('curr_page')){
					return Redirect::to(Session::get('curr_page'));
				}
				return Redirect::to('home');
			}
			$user->password = Crypt::encrypt($pass);
			$user->last_login = date(DATE_ATOM);
			$user->ip_address = Request::getClientIp();
			if($email){
				$user->email = $email;
			}
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
		return $this->returnToCurrPage();
	}

	public function postLogin(){
		$username = htmlentities(Input::get('username'));
		$pass = htmlentities(Input::get('pass'));
		$validator = Validator::make(
				array(
					'name' => $username,
					'password' => $pass,
				     ),
				array(
					'name' => 'required',
					'password' => 'required',
				     )
				);
		if(!$validator->fails()){
			$user = new User();
			$user->name = ucfirst($username);
			$user = $user->findAll();
			if(Crypt::decrypt($user->password) == $pass){
				$user->last_login = date(DATE_ATOM);
				$user->serial_id = Session::get('serial_id');
				$user->online = 1;
				$user->save();
				Auth::login($user,true);
				$node = new NodeAuth();
				$node->user_id = $user->id;
				$node->user = $user->name;
				$node->serial_id = $user->serial_id;
				if($node->findAll()){
					$node = $node->findAll();
				}
				$node->serial = Session::get('unique_serial');
				$node->serial_id = Session::get('serial_id');
				$node->sid = Session::getId();
				$node->authorized = 1;
				$node->save();
			}
		}
		return $this->returnToCurrPage();
	}

}
