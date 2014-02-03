<?php

class T extends BaseController {

	public function getIndex($tag)
	{
		$view = View::make('home');
		$view['user_subscribed'] = 0;
		$curr_tag = Tags::wherename($tag)->first();
		if(!isset($tag) || !$curr_tag){
			return App::abort(404,'You seem to have entered an invalid URL');
		}
		$chats_new = $curr_tag->chatsnew();
		$chats_rising = $curr_tag->chatsrising();
		$chats_contr = $curr_tag->chatscontr();
		$chats = $curr_tag->chats();
		$tags = Tags::take(20)->orderBy('popularity','desc')->get();
		$upvoted = array();
		$downvoted = array();
		if(Auth::check()){
			Auth::user()->page = $tag;
			Auth::user()->save();
			foreach(Auth::user()->upvotedChats() as $upvote){
				$upvoted[] = $upvote->chat_id;
			}
			foreach(Auth::user()->downvotedChats() as $downvote){
				$downvoted[] = $downvote->chat_id;
			}
			$usertag = UsersToTags::wheretag_id($curr_tag->id)->whereuser_id(Auth::user()->id)->first();
			if($usertag){
				$usertag->score = $usertag->score + 1;
				$usertag->save();
				$view['user_subscribed'] = 1;
			}
		}
		Session::put('curr_page',URL::full());
		$view['home_active'] = '';
		$view['curr_tag'] = $curr_tag;
		$view['upvoted'] = $upvoted;
		$view['downvoted'] = $downvoted;
		$view['tags'] = $tags;
		$view['curr_time'] = date('Y:m:d:H:i'); 
		$view['chats'] = $chats;
		$view['chats_new'] = $chats_new;
		$view['chats_rising'] = $chats_rising;
		$view['chats_contr'] = $chats_contr; 
                return $view;
	}

}
