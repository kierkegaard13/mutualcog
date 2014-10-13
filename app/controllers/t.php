<?php

class T extends BaseController {

	public function getIndex($tag)
	{
		$view = View::make('home');
		$view['user_subscribed'] = 0;
		$view['tag_admin'] = 0;
		$view['tag_mod'] = 0;
		$curr_tag = Tags::wherename($tag)->first();
		if(!$curr_tag){
			return View::make('missing');
		}
		if(!isset($tag) || !$curr_tag){
			return App::abort(404,'You seem to have entered an invalid URL');
		}
		$chats_new = $curr_tag->chatsnew();
		$chats_rising = $curr_tag->chatsrising();
		$chats_contr = $curr_tag->chatscontr();
		$chats_removed = $curr_tag->chatsremoved();
		$chats = $curr_tag->chats();
		$tags = Tags::take(30)->orderBy('popularity','desc')->get();
		$upvoted = array();
		$downvoted = array();
		if(Auth::check()){
			Auth::user()->page = $tag;
			Auth::user()->chat_id = 0;
			foreach(Auth::user()->upvotedChats() as $upvote){
				$upvoted[] = $upvote->chat_id;
			}
			foreach(Auth::user()->downvotedChats() as $downvote){
				$downvoted[] = $downvote->chat_id;
			}
			$usertag = UsersToTags::wheretag_id($curr_tag->id)->whereuser_id(Auth::user()->id)->first();
			if($usertag){
				$usertag->score = $usertag->score + 1;
				if($usertag->is_admin){
					Auth::user()->tag_admin = $curr_tag->id;
				}elseif($usertag->is_mod){
					Auth::user()->tag_mod = $curr_tag->id;
				}else{
					Auth::user()->tag_admin = 0;
					Auth::user()->tag_mod = 0;
				}
				$usertag->save();
				$view['user_subscribed'] = 1;
			}
			Auth::user()->save();
		}
		Session::put('curr_page',URL::full());
		$view['home_active'] = '';
		$view['sid'] = Session::getId();
		$view['curr_tag'] = $curr_tag;
		$view['curr_tag_id'] = $curr_tag->id;
		$view['tag_mods'] = UsersToTags::whereis_mod('1')->wheretag_id($curr_tag->id)->get();
		$view['tag_admin'] = UsersToTags::whereis_admin('1')->wheretag_id($curr_tag->id)->first();
		$view['upvoted'] = $upvoted;
		$view['downvoted'] = $downvoted;
		$view['tags'] = $tags;
		$view['curr_time'] = date('Y:m:d:H:i'); 
		$view['chats'] = $chats;
		$view['chats_new'] = $chats_new;
		$view['chats_rising'] = $chats_rising;
		$view['chats_contr'] = $chats_contr; 
		$view['chats_removed'] = $chats_removed; 
                return $view;
	}

}
