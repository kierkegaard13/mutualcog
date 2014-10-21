<?php

class C extends BaseController {

	public function getIndex($community)
	{
		$view = View::make('home');
		$view['user_subscribed'] = 0;
		$view['community_admin'] = 0;
		$view['community_mod'] = 0;
		$curr_community = Communities::wherename($community)->first();
		if(!$curr_community){
			return View::make('missing');
		}
		if(!isset($community) || !$curr_community){
			return App::abort(404,'You seem to have entered an invalid URL');
		}
		$chats_new = $curr_community->chatsnew();
		$chats_rising = $curr_community->chatsrising();
		$chats_removed = $curr_community->chatsremoved();
		$chats = $curr_community->chats();
		$communities = Communities::take(30)->orderBy('popularity','desc')->get();
		$upvoted = array();
		$downvoted = array();
		if(Auth::check()){
			Auth::user()->page = $community;
			Auth::user()->chat_id = 0;
			foreach(Auth::user()->upvotedChats() as $upvote){
				$upvoted[] = $upvote->chat_id;
			}
			foreach(Auth::user()->downvotedChats() as $downvote){
				$downvoted[] = $downvote->chat_id;
			}
			$usercommunity = UsersToCommunities::wherecommunity_id($curr_community->id)->whereuser_id(Auth::user()->id)->first();
			if($usercommunity){
				$usercommunity->score = $usercommunity->score + 1;
				if($usercommunity->is_admin){
					Auth::user()->community_admin = $curr_community->id;
				}elseif($usercommunity->is_mod){
					Auth::user()->community_mod = $curr_community->id;
				}else{
					Auth::user()->community_admin = 0;
					Auth::user()->community_mod = 0;
				}
				$usercommunity->save();
				$view['user_subscribed'] = 1;
			}
			Auth::user()->save();
		}
		Session::put('curr_page',URL::full());
		$view['home_active'] = '';
		$view['sid'] = Session::getId();
		$view['curr_community'] = $curr_community;
		$view['curr_community_id'] = $curr_community->id;
		$view['community_mods'] = UsersToCommunities::whereis_mod('1')->wherecommunity_id($curr_community->id)->get();
		$view['community_admin'] = UsersToCommunities::whereis_admin('1')->wherecommunity_id($curr_community->id)->first();
		$view['upvoted'] = $upvoted;
		$view['downvoted'] = $downvoted;
		$view['communities'] = $communities;
		$view['curr_time'] = date('Y:m:d:H:i'); 
		$view['chats'] = $chats;
		$view['chats_new'] = $chats_new;
		$view['chats_rising'] = $chats_rising;
		$view['chats_removed'] = $chats_removed; 
                return $view;
	}

}
