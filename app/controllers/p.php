<?php

class P extends BaseController {

	public function getIndex($username){
		$view = View::make('profile');
		$view['friended'] = 0;
		$tags = Tags::take(20)->orderBy('popularity','desc')->get();
		$upvoted = array();
		$downvoted = array();
		$user = new User();
		$user->name = $username;
		$user = $user->findAll();
		if(Auth::check()){
			foreach(ChatsVoted::wheremember_id(Auth::user()->id)->wherestatus(1)->get() as $upvote){
				$upvoted[] = $upvote->chat_id;
			}
			foreach(ChatsVoted::wheremember_id(Auth::user()->id)->wherestatus(2)->get() as $downvote){
				$downvoted[] = $downvote->chat_id;
			}
			$interaction = new Interactions();
			$interaction->user_id = Auth::user()->id;
			$interaction->interaction_id = $user->id;
			$interaction = $interaction->findAll();
			if($interaction && $interaction->friended == 1){
				$view['friended'] = 1;		
			}else{
				$interaction = new Interactions();
				$interaction->user_id = $user->id;
				$interaction->interaction_id = Auth::user()->id;
				$interaction = $interaction->findAll();
				if($interaction && $interaction->friended == 1){
					$view['friended'] = 1;		
				}
			}
		}
		Session::put('curr_page',URL::full());
		$view['interactions'] = $user->interactions;
		$view['interacted'] = $user->interacted;
		$view['color_arr'] = array('#228d49','#f52103','#2532f2','#f94f06','#5a24d9','#f8b92d','#38cedb','#000');
		$view['upvoted'] = $upvoted;
		$view['downvoted'] = $downvoted;
		$view['tags'] = $tags;
		$view['profile'] = $user;
		return $view;
	}

}
