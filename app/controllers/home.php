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

	public function getIndex()
	{
		$view = View::make('home');
		$chats = Chats::select('*',DB::raw('(case when (upvotes - downvotes > 0) then log(upvotes - downvotes) + timestampdiff(minute,"2013-1-1 12:00:00",chats.created_at)/45000 when (upvotes - downvotes = 0) then log(1) + timestampdiff(minute,"2013-1-1 12:00:00",chats.created_at)/45000 else log(1/abs(upvotes - downvotes)) + timestampdiff(minute,"2013-1-1 12:00:00",chats.created_at)/45000 end) AS score'))->whereremoved('0')->wherensfw('0')->orderBy('pinned','desc')->orderBy(DB::raw('score'),'desc')->paginate(25);
		$chats_new = Chats::whereremoved('0')->wherensfw('0')->orderBy('pinned','desc')->orderBy('created_at','desc')->paginate(25);
		$chats_rising = Chats::select('*',DB::raw('(upvotes - downvotes) - views AS score'))->wherensfw('0')->whereremoved('0')->orderBy('pinned','desc')->orderBy(DB::raw('score'),'desc')->paginate(25);
		$chats_contr = Chats::whereRaw('abs(upvotes - downvotes) < 10')->whereRaw('upvotes + abs(downvotes) > 10')->whereremoved('0')->wherensfw('0')->orderBy('pinned','desc')->orderBy('created_at','desc')->paginate(25);
		$tags = Tags::take(20)->orderBy('popularity','desc')->paginate(25);
		$upvoted = array();
		$downvoted = array();
		if(Auth::check()){
			Auth::user()->page = 'home';
			Auth::user()->chat_id = 0;
			Auth::user()->tag_admin = 0;
			Auth::user()->tag_mod = 0;
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
		$view['curr_tag_id'] = '';
		$view['upvoted'] = $upvoted;
		$view['downvoted'] = $downvoted;
		$view['tags'] = $tags;
		$view['chats'] = $chats;
		$view['chats_new'] = $chats_new;
		$view['chats_rising'] = $chats_rising;
		$view['chats_contr'] = $chats_contr;
		return $view;
	}
}
