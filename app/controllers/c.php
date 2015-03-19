<?php

class C extends BaseController {

	public function getIndex($community,$option = null)
	{
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
		if($option == 'nsfw'){
			$chats = $chats->wherensfw('1');
			$chats_new = $chats_new->wherensfw('1');
			$chats_rising = $chats_rising->wherensfw('1');
			$chats_removed = $chats_removed->wherensfw('1');
		}else if($option == 'live'){
			$chats = $chats->wherelive('1');
			$chats_new = $chats_new->wherelive('1');
			$chats_rising = $chats_rising->wherelive('1');
			$chats_removed = $chats_removed->wherelive('1');
		}else if($option == 'static'){
			$chats = $chats->wherelive('0');
			$chats_new = $chats_new->wherelive('0');
			$chats_rising = $chats_rising->wherelive('0');
			$chats_removed = $chats_removed->wherelive('0');
		}else if($option == 'pinned'){
			$chats = $chats->where('chats_to_communities.pinned','1');
			$chats_new = $chats_new->where('chats_to_communities.pinned','1');
			$chats_rising = $chats_rising->where('chats_to_communities.pinned','1');
			$chats_removed = $chats_removed->where('chats_to_communities.pinned','1');
		}
		$chats_new = $chats_new->wheretype('public')->orderBy(DB::raw('chats_to_communities.pinned'),'desc')->orderBy('created_at','desc')->paginate(25);
		$chats_rising = $chats_rising->wheretype('public')->orderBy(DB::raw('chats_to_communities.pinned'),'desc')->orderBy(DB::raw('score'),'desc')->paginate(25);
		$chats_removed = $chats_removed->wheretype('public')->orderBy('created_at','desc')->paginate(25);
		$chats = $chats->orderBy(DB::raw('chats_to_communities.pinned'),'desc')->orderBy(DB::raw('score'),'desc')->paginate(25);
		$upvoted = array();
		$downvoted = array();
		$saved = array();
		if($this->isXhr()){
			$view = View::make('home_view');
		}else{
			$view = View::make('home');
		}
		$view['user_subscribed'] = 0;
		if(Auth::check()){
			Auth::user()->page = $community;
			Auth::user()->chat_id = 0;
			$this->popVotedChats($upvoted,$downvoted);
			foreach(Auth::user()->savedChats as $s){
				$saved[] = $s->id;
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
		$view['community_admin'] = 0;
		$view['community_mod'] = 0;
		$view['home_active'] = '';
		$view['sid'] = Session::getId();
		$view['curr_community'] = $curr_community;
		$view['curr_community_id'] = $curr_community->id;
		$view['community_mods'] = UsersToCommunities::whereis_mod('1')->wherecommunity_id($curr_community->id)->get();
		$view['community_admin'] = UsersToCommunities::whereis_admin('1')->wherecommunity_id($curr_community->id)->first();
		$view['upvoted'] = $upvoted;
		$view['saved'] = $saved;
		$view['downvoted'] = $downvoted;
		$view['curr_time'] = date('Y:m:d:H:i'); 
		$view['chats'] = $chats;
		$view['chats_new'] = $chats_new;
		$view['chats_rising'] = $chats_rising;
		$view['chats_removed'] = $chats_removed; 
		$view['is_live_chat'] = 0;
		$view['is_static_chat'] = 0;
		$view['is_community'] = 1;
		if($this->isXhr()){
			return array(
				'view' => $view->render(),
				'home' => 0,
				'community' => 1,
				'chat' => 0,
				'static' => 0,
				'serial' => Session::get('unique_serial'),
				'serial_id' => Session::get('serial_id'),
				'sid' => Session::getId()
				);
		}else{
			return $view;
		}
	}

}
