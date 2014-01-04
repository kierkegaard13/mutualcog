<?php

class Chat extends BaseController {

        public function getOpen($chat_id){
                $view = View::make('chat');
		$chat = Chats::find($chat_id);
		if(!isset($chat_id) || !$chat){
			return App::abort(404,'You seem to have entered an invalid URL');
		}
		$user = Serials::whereserial_id(Session::get('unique_serial'))->first();
		$user->reserved = 1;
		$user->save();
		if(Auth::check()){
			$mem_to_chat = new MembersToChats();
			$mem_to_chat->chat_id = $chat_id;
			$mem_to_chat->member_id = Auth::user()->id;
			$mem_to_chat->user = Auth::user()->name;
			if(!$mem_to_chat->findAll()){  //getting into chat for the first time
				if($chat->admin_id == Auth::user()->id){
					$mem_to_chat->is_admin = 1;
				}
				$mem_to_chat->save();
				$all_mems = MembersToChats::wherechat_id($chat_id)->get();
				foreach($all_mems as $mem){
					if(preg_match('/[a-zA-Z]/',$mem->user) && $mem->member_id != Auth::user()->id){
						$interaction = Interactions::whereHas('users',function($q){$q->where('interaction_users.user_id',Auth::user()->id);})
							->whereHas('users',function($q)use($mem){$q->where('interaction_users.user_id',$mem->id);})
							->wheretype('friendship')
							->first();
						if($interaction){
							$interaction->bond = $interaction->bond + 1;
							$interaction->save();
						}else{
							$interaction = new Interactions();
							$interaction->bond = 1;
							$interaction->save();
							$inter_user = new InteractionUsers();
							$inter_user->user_id = Auth::user()->id;
							$inter_user->interaction_id = $interaction->id;
							$inter_user->save();
							$inter_user = new InteractionUsers();
							$inter_user->user_id = $mem->member_id;
							$inter_user->interaction_id = $interaction->id;
							$inter_user->save();
						}
					}
				}
			}else{  //have been in chat before
				$all_mems = MembersToChats::wherechat_id($chat_id)->get();
				foreach($all_mems as $mem){
					if(preg_match('/[a-zA-Z]/',$mem->user) && $mem->member_id != Auth::user()->id){
						$interaction = Interactions::whereHas('users',function($q){$q->where('interaction_users.user_id',Auth::user()->id);})
							->whereHas('users',function($q)use($mem){$q->where('interaction_users.user_id',$mem->id);})
							->wheretype('friendship')
							->first();
						//$interaction = Interactions::join('interaction_users','interaction_users.interaction_id','=','interactions.id')
						//	->with('users')
						//	->where('interaction_users.user_id', Auth::user()->id)
						//	->orWhere('interaction_users.user_id', $mem->id)
						//	->first();
						if($interaction){
						}else{
							$interaction = new Interactions();
							$interaction->bond = 1;
							$interaction->save();
							$inter_user = new InteractionUsers();
							$inter_user->user_id = Auth::user()->id;
							$inter_user->interaction_id = $interaction->id;
							$inter_user->save();
							$inter_user = new InteractionUsers();
							$inter_user->user_id = $mem->member_id;
							$inter_user->interaction_id = $interaction->id;
							$inter_user->save();
						}
					}
				}
			}
		}else{
			$mem_to_chat = new MembersToChats();
			$mem_to_chat->chat_id = $chat_id;
			$mem_to_chat->member_id = Session::get('serial_id');
			$mem_to_chat->user = Session::get('unique_serial');
			if(!$mem_to_chat->findAll()){
				if($chat->admin_id == Session::get('serial_id')){
					$mem_to_chat->is_admin = 1;
				}
				$mem_to_chat->save();
			}
		}
		$tags = Tags::take(20)->orderBy('popularity','desc')->get();
		$tag_arr = array();
		$mods = array();
		foreach($chat->tags as $tag){
			$tag_arr[] = $tag->name;
		}
		foreach($chat->moderators as $mod){
			$mods[] = $mod->user;
		}
		Session::put('curr_page',URL::full());
		$view['color_arr'] = array('#228d49','#f52103','#2532f2','#f94f06','#5a24d9','#f8b92d','#38cedb','#000');
		$view['tag_headers'] = $tags;
		$view['tags'] = $tag_arr;
		$view['curr_time'] = date('Y:m:d:H:i');
		$view['chat'] = $chat;
		$view['mods'] = $mods;
                return $view;
        }

	public function getAdmin(){
		$chat = Chats::find(Input::get('id'));
		return $chat->admin;
	}

	public function getCheckmod(){
		$user = htmlentities(Input::get('user'));
		$chat_id = htmlentities(Input::get('chat_id'));
		$mem_to_chat = new MembersToChats();
		$mem_to_chat = $mem_to_chat->whereuser($user)->wherechat_id($chat_id)->first();
		if($mem_to_chat){
			if($mem_to_chat->is_mod){
				return 1;
			}else{
				return 0;
			}
		}
		return 0;
	}

	public function postDetails(){
		$chat = Chats::find(Input::get('id'));
		if($chat){
			if(Session::get('unique_serial') == $chat->admin || Auth::user()->name == $chat->admin){
				$details = htmlentities(Input::get('details'));
				$chat->details = $details;
				$chat->save();
				return $chat->details;	
			}
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
		if(htmlentities(Input::get('js_key')) != 'js_enabled'){
			$validated = 0;
		}
		$validated = 1;
		if($validated){
			$chat = new Chats();
			if(strlen(Input::get('title')) < 3 || strlen(Input::get('title')) > 180){
				return Redirect::to(Session::get('curr_page'));
			}
			$chat->title = htmlentities(Input::get('title'));
			if(htmlentities(Input::get('link'))){
				$link = htmlentities(Input::get('link'));
				if((strpos($link,'http://') == 'false') && (strpos($link,'https://') == 'false')){
					$link = 'http://' . $link;
				}
				function get($a,$b,$c)
				{
					 // Gets a string between 2 strings
					 $y = explode($b,$a);
					 if($y[1]){
					 	$x = explode($c,$y[1]);
					 	return $x[0];
					 }else{
					 	return 0;
					 }
				}
				if(substr($link,-4,4) == '.png' || substr($link,-4,4) == '.gif' || substr($link,-4,4) == '.jpg' || substr($link,-5,5) == '.jpeg'){
					$site_name = str_replace('http://','',$link);
					$site_name = explode('/',$site_name);
					$site_name = $site_name[0];
					$chat->link = $link;
					$chat->image = $link;
					$chat->site_name = $site_name;
				}else{
					$image = get(file_get_contents($link), "<img src=", " ");
					$image = str_replace('"','',$image);
					$site_name = str_replace('http://','',$link);
					$site_name = explode('/',$site_name);
					$site_name = $site_name[0];
					$chat->link = $link;
					$chat->image = $image;
					$chat->site_name = $site_name;
				}
			}
			$chat->type = 'open';
			if(Auth::check()){
				$chat->admin = Auth::user()->name;
				$chat->admin_id = Auth::user()->id;
			}else{
				$chat->admin = Session::get('unique_serial');
				$chat->admin_id = Session::get('serial_id');
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
