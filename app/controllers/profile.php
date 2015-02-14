<?php

class Profile extends BaseController {

	public function getSave($type,$type_id){
		if(Auth::check()){
			$saved = new UsersToSaved();
			$saved->user_id = Auth::user()->id;
			$saved->saved_id = $type_id;
			if($type == 'chat'){
				$saved->saved_type = 'chats';
			}else{
				$saved->saved_type = 'messages';
			}
			$saved->save();
		}
		return $this->returnToCurrPage();
	}

	public function getUnsave($type,$type_id){
		if(Auth::check()){
			$saved = new UsersToSaved();
			$saved->user_id = Auth::user()->id;
			$saved->saved_id = $type_id;
			if($type == 'chat'){
				$saved->saved_type = 'chats';
			}else{
				$saved->saved_type = 'messages';
			}
			$saved = $saved->findAll(1);
			if($saved){
				$saved->delete();
			}
		}
		return $this->returnToCurrPage();
	}

	public function getSetStatus($user_id){
		$status = htmlentities(Input::get('status'));
		if(Auth::check()){
			Auth::user()->l_menu_status = $status;
			Auth::user()->save();
			return 1;
		}else{
			return 0;
		}
	}

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

	public function getUnlock($ability_id){
		if(Auth::check()){
			$ability = Abilities::find($ability_id);
			if(Auth::user()->level >= $ability->required_level){
				if(Auth::user()->cognizance >= $ability->cost){
					Auth::user()->cognizance = Auth::user()->cognizance - $ability->cost;
					Auth::user()->total_cognizance = Auth::user()->total_cognizance - $ability->cost;
					Auth::user()->save();
					$user_ability = new UsersToAbilities();
					$user_ability->ability_id = $ability->id;
					$user_ability->user_id = Auth::user()->id;
					$user_ability->unlocked = 1;
					$user_ability->active = 1;
					$user_ability->save();
				}else if(Auth::user()->total_cognizance >= $ability->cost){
					Auth::user()->total_cognizance = Auth::user()->total_cognizance - $ability->cost;
					if(Auth::user()->total_cognizance - 121 < 0){
						Auth::user()->level = 0;
						Auth::user()->next_level = $this->nextLevel(0);
						Auth::user()->cognizance = Auth::user()->total_cognizance;
					}else{
						Auth::user()->level = $this->previousLevel(Auth::user()->total_cognizance);
						Auth::user()->next_level = $this->nextLevel(Auth::user()->level);
						Auth::user()->cognizance = Auth::user()->total_cognizance - $this->nextLevel(Auth::user()->level - 1);
					}
					Auth::user()->save();
					$user_ability = new UsersToAbilities();
					$user_ability->ability_id = $ability->id;
					$user_ability->user_id = Auth::user()->id;
					$user_ability->unlocked = 1;
					$user_ability->active = 0;
					$user_ability->save();
				}
			}
		}
		return $this->returnToCurrPage();
	}

	public function getLevel($ability_id){
		if(Auth::check()){
			$ability = Abilities::find($ability_id);
			$user_ability = UsersToAbilities::whereuser_id(Auth::user()->id)->whereability_id($ability_id)->first();
			if(Auth::user()->level >= $ability->required_level && $user_ability->unlocked){
				$level_cost = $ability->cost * $user_ability->level * $ability->scale;
				if(Auth::user()->cognizance >= $level_cost){
					Auth::user()->cognizance = Auth::user()->cognizance - $level_cost;
					Auth::user()->total_cognizance = Auth::user()->total_cognizance - $level_cost;
					Auth::user()->save();
					$user_ability->level = $user_ability->level + 1;
					$user_ability->active = 1;
					$user_ability->save();
				}else if(Auth::user()->total_cognizance >= $level_cost){
					Auth::user()->total_cognizance = Auth::user()->total_cognizance - $level_cost;
					if(Auth::user()->total_cognizance - 121 < 0){
						Auth::user()->level = 0;
						Auth::user()->next_level = $this->nextLevel(0);
						Auth::user()->cognizance = Auth::user()->total_cognizance;
					}else{
						Auth::user()->level = $this->previousLevel(Auth::user()->total_cognizance);
						Auth::user()->next_level = $this->nextLevel(Auth::user()->level);
						Auth::user()->cognizance = Auth::user()->total_cognizance - $this->nextLevel(Auth::user()->level - 1);
					}
					Auth::user()->save();
					$user_ability->level = $user_ability->level + 1;
					$user_ability->unlocked = 1;
					$user_ability->active = 0;
					$user_ability->save();
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
					$interaction_user->bond = 1;
					$interaction_user->save();
					$interaction_friend = InteractionUsers::whereentity_id(Auth::user()->id)->whereuser_id($friend_id)->wheretype(0)->first();
					$interaction_friend->friended = 1;
					$interaction_friend->bond = 1;
					$interaction_friend->save();
				}else{
					$inter_user = new InteractionUsers();
					$inter_user->user_id = Auth::user()->id;
					$inter_user->entity_id = $friend_id;
					$inter_user->friended = 1;
					$inter_user->bond = 1;
					$inter_user->save();
					$inter_friend = new InteractionUsers();
					$inter_friend->user_id = $friend_id;
					$inter_friend->entity_id = Auth::user()->id;
					$inter_friend->friended = 1;
					$inter_friend->bond = 1;
					$inter_friend->save();
				}
				$user_to_chat = UsersToPrivateChats::whereuser_id(Auth::user()->id)->whereentity_id($friend_id)->first();
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
					$interaction_user->bond = 0;
					$interaction_user->save();
					$interaction_friend = InteractionUsers::whereentity_id(Auth::user()->id)->whereuser_id($friend_id)->wheretype(0)->first();
					$interaction_friend->friended = 0;
					$interaction_friend->bond = 0;
					$interaction_friend->save();
				}
			}
		}
		return $this->returnToCurrPage();
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
		$user = new User();
		$user->name = $username;
		$user->password = Crypt::encrypt($pass);
		$user->last_login = date(DATE_ATOM);
		$user->ip_address = Request::getClientIp();
		if($email){
			$user->email = $email;
		}
		if($pass == $pass2 && preg_match('/[a-zA-Z]/',$username) && (strlen($pass) >= 6 && strlen($pass) <= 30)){
			if($user->save()){
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
		}
		return $this->returnToCurrPage();
	}

	public function postLogin(){
		$username = htmlentities(Input::get('username'));
		$pass = htmlentities(Input::get('pass'));
		if($username && $pass){
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
