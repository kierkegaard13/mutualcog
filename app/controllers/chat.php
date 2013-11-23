<?php

class Chat extends BaseController {

        public function getOpen($chat_id){
                $view = View::make('chat');
		$chat = Chats::find($chat_id);
		$user = Serials::whereserial_id(Session::get('unique_serial'))->first();
		$user->reserved = 1;
		$user->save();
		$tags = Tags::take(20)->orderBy('popularity','desc')->get();
		$tag_arr = array();
		foreach($chat->tags as $tag){
			$tag_arr[] = $tag->name;
		}
		Session::put('curr_page',URL::full());
		$view['tag_headers'] = $tags;
		$view['tags'] = $tag_arr;
		$view['curr_time'] = date('Y:m:d:H:i');
		$view['chat'] = $chat;
                return $view;
        }

	public function getAdmin(){
		$chat = Chats::find(Input::get('id'));
		return $chat->admin;
	}

	public function postDetails(){
		$chat = Chats::find(Input::get('id'));
		if($chat){
			$details = htmlentities(Input::get('details'));
			$chat->details = $details;
			$chat->save();
			return $chat->details;	
		}	
		return false;
	}

	public function postNewchat(){
		$validated = 0;
		$curr_date = date('Y:m:d:H:i');
		list($year,$month,$day,$hour,$minute) = explode(':',$curr_date);
		$serial = new Serials();
		$serial->serial_id = Session::get('unique_serial');
		$serial = $serial->findAll();
		if($serial->last_post == 0){
			$serial->last_post = date(DATE_ATOM);
			$serial->save();
			$validated = 1;
		}else{
			$temp_date = date('Y:m:d:H:i',strtotime($serial->last_post));
			list($t_year,$t_month,$t_day,$t_hour,$t_minute) = explode(':',$temp_date);
			if(($year > $t_year || $month > $t_month || $day > $t_day || ($hour * 60 + $minute) > ($t_hour * 60 + $t_minute) + 1)){
				$serial->last_post = date(DATE_ATOM);
				$serial->save();
				$validated = 1;
			}
		}
		if($validated){
			$chat = new Chats();
			if(strlen(Input::get('title')) < 3 || strlen(Input::get('title')) > 180){
				return Redirect::to(Session::get('curr_page'));
			}
			$chat->title = htmlentities(Input::get('title'));
			$chat->type = 'open';
			if(Auth::check()){
				$chat->admin = Auth::user()->name;
				$chat->admin_id = Auth::user()->id;
			}else{
				$chat->admin = Session::get('unique_serial');
			}
			$chat->inception = date(DATE_ATOM);
			if($chat->title && $chat->admin && ($chat->type == 'open')){
				$chat->save();
			}else{
				return Redirect::to(Session::get('curr_page'));
			}
			$chat = $chat->findAll();
			$tags = Input::get('tags');
			$tags = explode(' ',$tags);
			foreach($tags as $tag){
				if(strlen($tag) > 2 && strlen($tag) < 20){
					$t = new Tags();
					$tag = str_replace('#','',$tag);
					$tag = htmlentities($tag);
					if($tag){
						$t->name = $tag;
						if($t->findAll()){
							$t = $t->findAll();
							$t->popularity = $t->popularity + 1;
							$t->save();
						}else{
							$t->save();
						}
						$t = $t->findAll();
						$chats_to_tags = new ChatsToTags();
						$chats_to_tags->chat_id = $chat->id;
						$chats_to_tags->tag_id = $t->id;
						$chats_to_tags->save();
					}
				}
			}
			return Redirect::to(action('chat@getOpen',$chat->id));
		}
		return Redirect::to(Session::get('curr_page'));
	}

	public function postUpvote(){
		if(Auth::check()){
			$chat_id = Input::get('id');
			$member = Auth::user()->id;
			$chat = Chats::find($chat_id);
			$voted = new ChatsVoted();
			$status = 0;
			$temp = $voted->wheremember_id($member)->wherechat_id($chat_id)->first();
			if($temp){
				$voted = $temp;
				$status = $voted->status;
			}else{
				$voted->member_id = $member;
				$voted->chat_id = $chat_id;
			}
			$user_exists = 0;
			if(preg_match('/[a-zA-Z]/',$chat->admin)){
				$user = new User();
				$user->name = $chat->admin;
				$user = $user->findAll();
				$user_exists = 1;
			}
			if($status == 2){
				if($user_exists){
					$user->cognizance = $user->cognizance + 2;
					$user->save();
				}
				foreach($chat->tags as $tag){
					$tag->popularity = $tag->popularity + 2;
					$tag->save();
				}
				$chat->upvotes = $chat->upvotes + 1;
				$chat->downvotes = $chat->downvotes - 1;
				$voted->status = 1;
				$voted->save();
				$chat->save();
				return array('status' => 1,'upvotes' => $chat->upvotes - $chat->downvotes);
			}elseif($status == 1){
				if($user_exists){
					$user->cognizance = $user->cognizance - 1;
					$user->save();
				}
				foreach($chat->tags as $tag){
					$tag->popularity = $tag->popularity - 1;
					$tag->save();
				}
				$chat->upvotes = $chat->upvotes - 1;
				$voted->status = 0;
				$voted->save();
				$chat->save();
				return array('status' => 2,'upvotes' => $chat->upvotes - $chat->downvotes);
			}else{
				if($user_exists){
					$user->cognizance = $user->cognizance + 1;
					$user->save();
				}
				foreach($chat->tags as $tag){
					$tag->popularity = $tag->popularity + 1;
					$tag->save();
				}
				$chat->upvotes = $chat->upvotes + 1;
				$voted->status = 1;	
				$voted->save();
				$chat->save();
				return array('status' => 3,'upvotes' => $chat->upvotes - $chat->downvotes);
			}
		}else{
			return array('status' => 0,'upvotes' => 0);
		}
	}

	public function postDownvote(){
		if(Auth::check()){
			$chat_id = Input::get('id');
			$member = Auth::user()->id;
			$chat = Chats::find($chat_id);
			$voted = new ChatsVoted();
			$status = 0;
			$temp = $voted->wheremember_id($member)->wherechat_id($chat_id)->first();
			if($temp){
				$voted = $temp;
				$status = $voted->status;
			}else{
				$voted->member_id = $member;
				$voted->chat_id = $chat_id;
			}
			$user_exists = 0;
			if(preg_match('/[a-zA-Z]/',$chat->admin)){
				$user = new User();
				$user->name = $chat->admin;
				$user = $user->findAll();
				$user_exists = 1;
			}
			if($status == 1){
				if($user_exists){
					$user->cognizance = $user->cognizance - 2;
					$user->save();
				}
				foreach($chat->tags as $tag){
					$tag->popularity = $tag->popularity - 2;
					$tag->save();
				}
				$chat->upvotes = $chat->upvotes - 1;
				$chat->downvotes = $chat->downvotes + 1;
				$voted->status = 2;
				$voted->save();
				$chat->save();
				return array('status' => 1,'upvotes' => $chat->upvotes - $chat->downvotes);
			}elseif($status == 2){
				if($user_exists){
					$user->cognizance = $user->cognizance + 1;
					$user->save();
				}
				foreach($chat->tags as $tag){
					$tag->popularity = $tag->popularity + 1;
					$tag->save();
				}
				$chat->downvotes = $chat->downvotes - 1;
				$voted->status = 0;
				$voted->save();
				$chat->save();
				return array('status' => 2,'upvotes' => $chat->upvotes - $chat->downvotes);
			}else{
				if($user_exists){
					$user->cognizance = $user->cognizance - 1;
					$user->save();
				}
				foreach($chat->tags as $tag){
					$tag->popularity = $tag->popularity - 1;
					$tag->save();
				}
				$chat->downvotes = $chat->downvotes + 1;
				$voted->status = 2;	
				$voted->save();
				$chat->save();
				return array('status' => 3,'upvotes' => $chat->upvotes - $chat->downvotes);
			}
		}else{
			return array('status' => 0,'upvotes' => 0);
		}
	}

}
