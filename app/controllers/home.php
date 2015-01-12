<?php

class Home extends BaseController {

	/*
	   |--------------------------------------------------------------------------
	   | Default Home Controller
	   |--------------------------------------------------------------------------
	   |
	   | You may wish to use controllers instead of, or in addition to, Closure
	   | based routes. That's great! Here is an example controller method to
	   | get you started. To route to this controller, just add the route:
	   |
	   |	Route::get('/', 'HomeController@showWelcome');
	   |
	 */

	public function getIndex($option = null)
	{
		if(Cache::has('home_view') && $this->view_cache_en){
			$view = Cache::get('home_view');
		}else{
			$view = View::make('home');
			$chats = Chats::select('*',DB::raw('(case when (upvotes - downvotes > 0) then log(upvotes - downvotes) + timestampdiff(minute,"2013-1-1 12:00:00",chats.created_at)/45000 when (upvotes - downvotes = 0) then log(1) + timestampdiff(minute,"2013-1-1 12:00:00",chats.created_at)/45000 else log(1/abs(upvotes - downvotes)) + timestampdiff(minute,"2013-1-1 12:00:00",chats.created_at)/45000 end) AS score'))->whereremoved('0');
			$chats_removed = Chats::whereremoved('1');
			$chats_new = Chats::whereremoved('0');
			$chats_rising = Chats::select('*',DB::raw('(upvotes - downvotes) - views AS score'))->whereremoved('0');
			if($option == 'nsfw'){
				$chats = $chats->wherensfw('1');
				$chats_new = $chats_new->wherensfw('1');
				$chats_rising = $chats_rising->wherensfw('1');
				$chats_removed = $chats_removed->wherensfw('1');
			}else if($option == 'pinned'){
				$chats = $chats->wherepinned('1')->wherensfw('0');
				$chats_new = $chats_new->wherepinned('1')->wherensfw('0');
				$chats_rising = $chats_rising->wherepinned('1')->wherensfw('0');
				$chats_removed = $chats_removed->wherepinned('1')->wherensfw('0');
			}else if($option == 'live'){
				$chats = $chats->wherelive('1')->wherensfw('0');
				$chats_new = $chats_new->wherelive('1')->wherensfw('0');
				$chats_rising = $chats_rising->wherelive('1')->wherensfw('0');
				$chats_removed = $chats_removed->wherelive('1')->wherensfw('0');
			}else if($option == 'static'){
				$chats = $chats->wherelive('0')->wherensfw('0');
				$chats_new = $chats_new->wherelive('0')->wherensfw('0');
				$chats_rising = $chats_rising->wherelive('0')->wherensfw('0');
				$chats_removed = $chats_removed->wherelive('0')->wherensfw('0');
			}else{
				$chats = $chats->wherensfw('0');
				$chats_new = $chats_new->wherensfw('0');
				$chats_rising = $chats_rising->wherensfw('0');
				$chats_removed = $chats_removed->wherensfw('0');
			}
			$chats = $chats->orderBy('pinned','desc')->orderBy(DB::raw('score'),'desc')->paginate(25);
			$chats_new = $chats_new->orderBy('pinned','desc')->orderBy('created_at','desc')->paginate(25);
			$chats_rising = $chats_rising->orderBy('pinned','desc')->orderBy(DB::raw('score'),'desc')->paginate(25);
			$chats_removed = $chats_removed->orderBy('created_at','desc')->paginate(25);
			$upvoted = array();
			$downvoted = array();
			if(Auth::check()){
				Auth::user()->page = 'home';
				Auth::user()->chat_id = 0;
				Auth::user()->community_admin = 0;
				Auth::user()->community_mod = 0;
				Auth::user()->save();
				foreach(Auth::user()->upvotedChats() as $upvote){
					$upvoted[] = $upvote->chat_id;
				}
				foreach(Auth::user()->downvotedChats() as $downvote){
					$downvoted[] = $downvote->chat_id;
				}
			}
			Session::put('curr_page',URL::full());
			$view['home_active'] = 'highlight_light_blue';
			$view['sid'] = Session::getId();
			$view['curr_community_id'] = '';
			$view['upvoted'] = $upvoted;
			$view['downvoted'] = $downvoted;
			$view['chats'] = $chats;
			$view['chats_new'] = $chats_new;
			$view['chats_rising'] = $chats_rising;
			Cache::add('home_view',$view->render(),1);
		}
		return $view;
	}

	public function getNsfw()
	{
		if(Cache::has('home_view_nsfw') && $this->view_cache_en){
			$view = Cache::get('home_view_nsfw');
		}else{
			$view = View::make('home');
			$chats = Chats::select('*',DB::raw('(case when (upvotes - downvotes > 0) then log(upvotes - downvotes) + timestampdiff(minute,"2013-1-1 12:00:00",chats.created_at)/45000 when (upvotes - downvotes = 0) then log(1) + timestampdiff(minute,"2013-1-1 12:00:00",chats.created_at)/45000 else log(1/abs(upvotes - downvotes)) + timestampdiff(minute,"2013-1-1 12:00:00",chats.created_at)/45000 end) AS score'))->whereremoved('0');
			$chats_removed = Chats::whereremoved('1');
			$chats_new = Chats::whereremoved('0');
			$chats_rising = Chats::select('*',DB::raw('(upvotes - downvotes) - views AS score'))->whereremoved('0');
			$chats = $chats->wherensfw('1');
			$chats_new = $chats_new->wherensfw('1');
			$chats_rising = $chats_rising->wherensfw('1');
			$chats_removed = $chats_removed->wherensfw('1');
			$chats = $chats->orderBy('pinned','desc')->orderBy(DB::raw('score'),'desc')->paginate(25);
			$chats_new = $chats_new->orderBy('pinned','desc')->orderBy('created_at','desc')->paginate(25);
			$chats_rising = $chats_rising->orderBy('pinned','desc')->orderBy(DB::raw('score'),'desc')->paginate(25);
			$chats_removed = $chats_removed->orderBy('created_at','desc')->paginate(25);
			$upvoted = array();
			$downvoted = array();
			if(Auth::check()){
				Auth::user()->page = 'home';
				Auth::user()->chat_id = 0;
				Auth::user()->community_admin = 0;
				Auth::user()->community_mod = 0;
				Auth::user()->save();
				foreach(Auth::user()->upvotedChats() as $upvote){
					$upvoted[] = $upvote->chat_id;
				}
				foreach(Auth::user()->downvotedChats() as $downvote){
					$downvoted[] = $downvote->chat_id;
				}
			}
			Session::put('curr_page',URL::full());
			$view['home_active'] = 'highlight_light_blue';
			$view['sid'] = Session::getId();
			$view['curr_community_id'] = '';
			$view['upvoted'] = $upvoted;
			$view['downvoted'] = $downvoted;
			$view['chats'] = $chats;
			$view['chats_new'] = $chats_new;
			$view['chats_rising'] = $chats_rising;
			Cache::add('home_view_nsfw',$view->render(),1);
		}
		return $view;
	}

	public function getPinned()
	{
		if(Cache::has('home_view_pinned') && $this->view_cache_en){
			$view = Cache::get('home_view_pinned');
		}else{
			$view = View::make('home');
			$chats = Chats::select('*',DB::raw('(case when (upvotes - downvotes > 0) then log(upvotes - downvotes) + timestampdiff(minute,"2013-1-1 12:00:00",chats.created_at)/45000 when (upvotes - downvotes = 0) then log(1) + timestampdiff(minute,"2013-1-1 12:00:00",chats.created_at)/45000 else log(1/abs(upvotes - downvotes)) + timestampdiff(minute,"2013-1-1 12:00:00",chats.created_at)/45000 end) AS score'))->whereremoved('0');
			$chats_removed = Chats::whereremoved('1');
			$chats_new = Chats::whereremoved('0');
			$chats_rising = Chats::select('*',DB::raw('(upvotes - downvotes) - views AS score'))->whereremoved('0');
			$chats = $chats->wherepinned('1')->wherensfw('0');
			$chats_new = $chats_new->wherepinned('1')->wherensfw('0');
			$chats_rising = $chats_rising->wherepinned('1')->wherensfw('0');
			$chats_removed = $chats_removed->wherepinned('1')->wherensfw('0');
			$chats = $chats->orderBy('pinned','desc')->orderBy(DB::raw('score'),'desc')->paginate(25);
			$chats_new = $chats_new->orderBy('pinned','desc')->orderBy('created_at','desc')->paginate(25);
			$chats_rising = $chats_rising->orderBy('pinned','desc')->orderBy(DB::raw('score'),'desc')->paginate(25);
			$chats_removed = $chats_removed->orderBy('created_at','desc')->paginate(25);
			$upvoted = array();
			$downvoted = array();
			if(Auth::check()){
				Auth::user()->page = 'home';
				Auth::user()->chat_id = 0;
				Auth::user()->community_admin = 0;
				Auth::user()->community_mod = 0;
				Auth::user()->save();
				foreach(Auth::user()->upvotedChats() as $upvote){
					$upvoted[] = $upvote->chat_id;
				}
				foreach(Auth::user()->downvotedChats() as $downvote){
					$downvoted[] = $downvote->chat_id;
				}
			}
			Session::put('curr_page',URL::full());
			$view['home_active'] = 'highlight_light_blue';
			$view['sid'] = Session::getId();
			$view['curr_community_id'] = '';
			$view['upvoted'] = $upvoted;
			$view['downvoted'] = $downvoted;
			$view['chats'] = $chats;
			$view['chats_new'] = $chats_new;
			$view['chats_rising'] = $chats_rising;
			Cache::add('home_view_pinned',$view->render(),1);
		}
		return $view;
	}

}
