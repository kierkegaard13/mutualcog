<?php

class T extends BaseController {

	public function getIndex($tag)
	{
		$view = View::make('home');
		$chats = Tags::wherename($tag)->first();
		if(!isset($tag) || !$chats){
			return App::abort(404,'You seem to have entered an invalid URL');
		}
		$chats = $chats->chats;
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
		Session::put('curr_page',URL::full());
		$view['home_active'] = '';
		$view['curr_tag'] = htmlentities($tag);
		$view['upvoted'] = $upvoted;
		$view['downvoted'] = $downvoted;
		$view['tags'] = $tags;
		$view['curr_time'] = date('Y:m:d:H:i'); 
		$view['chats'] = $chats;
                return $view;
	}

}
