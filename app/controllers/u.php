<?php

class U extends BaseController {

	public function getIndex($username){
		$view = View::make('profile');
		$view['friended'] = 0;
		$upvoted = array();
		$downvoted = array();
		$mssg_upvoted = array();
		$mssg_downvoted = array();
		$user = new User();
		$user->name = $username;
		$user = $user->findAll();
		if(!$user){
			return View::make('missing');
		}	
		$requested = 0;
		if(Auth::check()){
			$requested = count(Notifications::wheresender_id(Auth::user()->id)->whereuser_id($user->id)->wheretype(2)->first());
			foreach(Auth::user()->upvotedChats() as $upvote){
				$upvoted[] = $upvote->chat_id;
			}
			foreach(Auth::user()->downvotedChats() as $downvote){
				$downvoted[] = $downvote->chat_id;
			}
			foreach(Auth::user()->upvotedMessages() as $upvote){
				$mssg_upvoted[] = $upvote->message_id;
			}
			foreach(Auth::user()->downvotedMessages() as $downvote){
				$mssg_downvoted[] = $downvote->message_id;
			}
			if($username != Auth::user()->name){
				$interaction = InteractionUsers::whereuser_id(Auth::user()->id)->whereentity_id($user->id)->wheretype(0)->first();
				if($interaction){
					if($interaction->friended == 1) $view['friended'] = 1;		
				}
			}
		}
		$all_abilities = Abilities::all();
		$user_abilities = $user->abilities;
		foreach($all_abilities as $ability){
			if(sizeof($user_abilities) > 0){
				foreach($user_abilities as $user_ability){
					if($ability->name == $user_ability->name){
						$ability->active = $user_ability->pivot->active;
						$ability->level = $user_ability->pivot->level;
						$ability->unlocked = $user_ability->pivot->unlocked;
					}else{
						$ability->active = 0;
						$ability->level = 0;
						$ability->unlocked = 0;
					}
				}
			}else{
				$ability->active = 0;
				$ability->level = 0;
				$ability->unlocked = 0;
			}
		}
		Session::put('curr_page',URL::full());
		$view['requested'] = $requested;
		$view['friendships'] = $user->friendshipsP();
		$view['chats'] = $user->chatsP();
		$view['messages'] = $user->messagesP();
		$view['color_arr'] = array('#228d49','#f52103','#2532f2','#f94f06','#5a24d9','#f8b92d','#38cedb','#000');
		$view['curr_community_id'] = '';
		$view['upvoted'] = $upvoted;
		$view['downvoted'] = $downvoted;
		$view['mssg_upvoted'] = $mssg_upvoted;
		$view['mssg_downvoted'] = $mssg_downvoted;
		$view['abilities'] = $all_abilities;
		$view['profile'] = $user;
		return $view;
	}

}
