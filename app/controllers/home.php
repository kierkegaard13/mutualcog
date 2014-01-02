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
		$chats = Chats::select('*',DB::raw('(case when (upvotes - downvotes > 0) then log(upvotes - downvotes) + timestampdiff(minute,"2013-1-1 12:00:00",chats.inception)/45000 when (upvotes - downvotes = 0) then log(1) + timestampdiff(minute,"2013-1-1 12:00:00",chats.inception)/45000 else log(1/abs(upvotes - downvotes)) + timestampdiff(minute,"2013-1-1 12:00:00",chats.inception)/45000 end) AS score'))->orderBy(DB::raw('score'),'desc')->paginate(25);
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
		$view['home_active'] = 'highlight_light_blue';
		$view['upvoted'] = $upvoted;
		$view['downvoted'] = $downvoted;
		$view['tags'] = $tags;
		$view['chats'] = $chats;
		return $view;
	}
}
