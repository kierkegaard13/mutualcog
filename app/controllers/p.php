<?php

class P extends BaseController {

	public function getIndex($username){
		$view = View::make('profile');
		$tags = Tags::take(20)->orderBy('popularity','desc')->get();
		$upvoted = array();
		$downvoted = array();
		if(Auth::check()){
			foreach(ChatsVoted::wheremember_id(Auth::user()->id)->wherestatus(1)->get() as $upvote){
				$upvoted[] = $upvote->chat_id;
			}
			foreach(ChatsVoted::wheremember_id(Auth::user()->id)->wherestatus(2)->get() as $downvote){
				$downvoted[] = $downvote->chat_id;
			}
		}
		$user = new User();
		$user->name = $username;
		$user = $user->findAll();
		Session::put('curr_page',URL::full());
		$view['upvoted'] = $upvoted;
		$view['downvoted'] = $downvoted;
		$view['tags'] = $tags;
		$view['user'] = $user;
		return $view;
	}

}
