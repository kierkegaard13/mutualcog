<?php

class U extends BaseController {

	public function getIndex($username){
		$view = View::make('profile');
		$view['friended'] = 0;
		$tags = Tags::take(20)->orderBy('popularity','desc')->get();
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
		Session::put('curr_page',URL::full());
		$view['requested'] = $requested;
		$view['friendships'] = $user->friendships;
		$view['color_arr'] = array('#228d49','#f52103','#2532f2','#f94f06','#5a24d9','#f8b92d','#38cedb','#000');
		$view['curr_tag_id'] = '';
		$view['upvoted'] = $upvoted;
		$view['downvoted'] = $downvoted;
		$view['mssg_upvoted'] = $mssg_upvoted;
		$view['mssg_downvoted'] = $mssg_downvoted;
		$view['tags'] = $tags;
		$view['profile'] = $user;
		return $view;
	}

}
