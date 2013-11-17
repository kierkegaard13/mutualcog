<?php

class TagsController extends BaseController {

	public function getTag($tag)
	{
		$view = View::make('home');
		$chats = Tags::wherename($tag)->first()->chats;
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
		$view['upvoted'] = $upvoted;
		$view['downvoted'] = $downvoted;
		$view['tags'] = $tags;
		$view['curr_time'] = date('Y:m:d:H:i'); 
		$view['chats'] = $chats;
                $view['content_height'] = 1600;
                return $view;
	}

	public function getSimilarTag(){
		$input = htmlspecialchars(Input::get('tag'));
		$tag_arr = array();
		$tag = new Tags();
		$tag = $tag->where('name','LIKE','%' . $input . '%')->take(5)->get();
		foreach($tag as $t){
			$tag_arr[] = array('id' => $t->id,'name' => $t->name,'chat_id' => $t->chat_id);
		}
		return $tag_arr;
	}
}

