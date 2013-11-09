<?php

class Privacy extends BaseController {

	public function getIndex(){
		$view = View::make('privacy');
		$tags = new Tags();
		$tags = $tags->get();
		$tags = $tags->sortBy(function($tag){
			$count = count($tag->chats);
			$popularity = 0;
			foreach($tag->chats as $chat){
				$popularity += $chat->upvotes - $chat->downvotes;
			}	
			$score = $count + $popularity;
			return -$score;
		});
		$tag_count = 0;
		$tag_arr = array();
		foreach($tags as $tag){
			if($tag_count == 20){
				break;
			}
			$tag_arr[] = $tag->name;
			$tag_count++;
		}
		$view['tags'] = $tag_arr;
		Session::put('curr_page',URL::full());
		return $view;
	}

}
