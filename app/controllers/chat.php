<?php

class Chat extends BaseController {

        public function getLive($chat_id){
                $view = View::make('chat');
		$chat = Chats::find($chat_id);
		if(!isset($chat_id) || !$chat){
			return App::abort(404,'You seem to have entered an invalid URL');
		}
		$chat->views = $chat->views + 1;
		$chat->save();
		$user = Serials::whereserial_id(Session::get('unique_serial'))->first();
		$user->save();
		$upvoted = array();
		$downvoted = array();
		$mssg_upvoted = array();
		$mssg_downvoted = array();
		if(Auth::check()){
			Auth::user()->chat_id = $chat_id;
			Auth::user()->save();
			foreach(Auth::user()->upvotedChats() as $upvote){
				$upvoted[] = $upvote->chat_id;
			}
			foreach(Auth::user()->downvotedChats() as $downvote){
				$downvoted[] = $downvote->chat_id;
			}
			foreach(Auth::user()->upvotedMessages() as $upvote){
				$mssg_upvoted[] = $upvote->message_id;
			}
			foreach(Auth::user()->downvotedMessages() as $downvote){
				$mssg_downvoted[] = $downvote->message_id;
			}
			$mem_to_chat = new MembersToChats();
			$mem_to_chat->chat_id = $chat_id;
			$mem_to_chat->member_id = Auth::user()->id;
			$mem_to_chat->user = Auth::user()->name;
			if(!$mem_to_chat->findAll()){  //getting into chat for the first time
				if($chat->admin_id == Auth::user()->id){
					$mem_to_chat->is_admin = 1;
				}else if($chat->admin_id == Auth::user()->serial_id){
					$mem_to_chat->is_admin = 1;
					$chat->admin_id = Auth::user()->id;
					$chat->admin = Auth::user()->name;
					$chat->save();
				}
				$mem_to_chat->active = 1;
				$mem_to_chat->save();
				$all_mems = MembersToChats::wherechat_id($chat_id)->get();
				foreach($all_mems as $mem){
					if(preg_match('/[a-zA-Z]/',$mem->user) && $mem->member_id != Auth::user()->id){
						$interaction = Interactions::whereHas('users',function($q){$q->where('interaction_users.user_id',Auth::user()->id);})
							->whereHas('users',function($q)use($mem){$q->where('interaction_users.user_id',$mem->member_id);})
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
				$mem_to_chat = $mem_to_chat->findAll();
				if($mem_to_chat->banned){
					return Redirect::to('home');  //add you have been banned message
				}
				$mem_to_chat->active = 1;
				$mem_to_chat->save();
				$all_mems = MembersToChats::wherechat_id($chat_id)->get();
				foreach($all_mems as $mem){
					if(preg_match('/[a-zA-Z]/',$mem->user) && $mem->member_id != Auth::user()->id){
						$interaction = Interactions::whereHas('users',function($q){$q->where('interaction_users.user_id',Auth::user()->id);})
							->whereHas('users',function($q)use($mem){$q->where('interaction_users.user_id',$mem->member_id);})
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
		}else{  //not logged in
			$mem_to_chat = new MembersToChats();
			$mem_to_chat->chat_id = $chat_id;
			$mem_to_chat->member_id = Session::get('serial_id');
			$mem_to_chat->user = Session::get('unique_serial');
			if(!$mem_to_chat->findAll()){
				$mem_to_chat->active = 1;
				if($chat->admin_id == Session::get('serial_id')){
					$mem_to_chat->is_admin = 1;
				}
				$mem_to_chat->save();
			}else{
				$mem_to_chat = $mem_to_chat->findAll();
				$mem_to_chat->active = 1;
				if($mem_to_chat->banned){
					return Redirect::to('home');  //add you have been banned message
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
		$view['upvoted'] = $upvoted;
		$view['downvoted'] = $downvoted;
		$view['mssg_upvoted'] = $mssg_upvoted;
		$view['mssg_downvoted'] = $mssg_downvoted;
		$view['chat'] = $chat;
		$view['mods'] = $mods;
                return $view;
        }

	public function getStatic($chat_id,$mssg_id = null){
                $view = View::make('static_chat');
		$chat = Chats::find($chat_id);
		if(!isset($chat_id) || !$chat){
			return App::abort(404,'You seem to have entered an invalid URL');
		}
		$chat->views = $chat->views + 1;
		$chat->save();
		$upvoted = array();
		$downvoted = array();
		$mssg_upvoted = array();
		$mssg_downvoted = array();
		if(Auth::check()){
			Auth::user()->chat_id = $chat_id;
			Auth::user()->save();
			foreach(Auth::user()->upvotedChats() as $upvote){
				$upvoted[] = $upvote->chat_id;
			}
			foreach(Auth::user()->downvotedChats() as $downvote){
				$downvoted[] = $downvote->chat_id;
			}
			foreach(Auth::user()->upvotedMessages() as $upvote){
				$mssg_upvoted[] = $upvote->message_id;
			}
			foreach(Auth::user()->downvotedMessages() as $downvote){
				$mssg_downvoted[] = $downvote->message_id;
			}
			$mem_to_chat = new MembersToChats();
			$mem_to_chat->chat_id = $chat_id;
			$mem_to_chat->member_id = Auth::user()->id;
			$mem_to_chat->user = Auth::user()->name;
			if(!$mem_to_chat->findAll()){  //getting into chat for the first time
				if($chat->admin_id == Auth::user()->id){
					$mem_to_chat->is_admin = 1;
				}else if($chat->admin_id == Auth::user()->serial_id){
					$mem_to_chat->is_admin = 1;
					$chat->admin_id = Auth::user()->id;
					$chat->admin = Auth::user()->name;
					$chat->save();
				}
				$mem_to_chat->save();
			}else{  //have been in chat before
				$mem_to_chat = $mem_to_chat->findAll();
				if($mem_to_chat->banned){
					return Redirect::to('home');  //add you have been banned message
				}
				$mem_to_chat->save();
			}
		}else{  //not logged in
			$mem_to_chat = new MembersToChats();
			$mem_to_chat->chat_id = $chat_id;
			$mem_to_chat->member_id = Session::get('serial_id');
			$mem_to_chat->user = Session::get('unique_serial');
			if(!$mem_to_chat->findAll()){
				if($chat->admin_id == Session::get('serial_id')){
					$mem_to_chat->is_admin = 1;
				}
				$mem_to_chat->save();
			}else{
				$mem_to_chat = $mem_to_chat->findAll();
				if($mem_to_chat->banned){
					return Redirect::to('home');  //add you have been banned message
				}
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
		$view['upvoted'] = $upvoted;
		$view['downvoted'] = $downvoted;
		$view['mssg_upvoted'] = $mssg_upvoted;
		$view['mssg_downvoted'] = $mssg_downvoted;
		$view['chat'] = $chat;
		$view['mods'] = $mods;
		if($mssg_id){
			$message = Messages::find($mssg_id);
			$view['messages'] = Messages::where('path','LIKE',"$message->path%")->where('h_level','<=','11')->where('level','<=','13')->orderBy('path')->get();
			$view['recursive'] = 0;
		}else{
			$view['messages'] = $chat->messagesPaginate();
			$view['recursive'] = 1;
		}
                return $view;
	}

	public function postMessage($chat_id){
		$chat = Chats::find($chat_id);
		if(!$chat->live){
			$message = new Messages();
			$message->chat_id = htmlentities($chat_id);
			$mssg_content = htmlentities(Input::get('mssg_content'));
			$message->message = $this->parseText($mssg_content);
			if(Auth::check()){
				$message->member_id = Auth::user()->id;
				$message->author = Auth::user()->name;
				$message->serial = Auth::user()->serial->serial_id;
			}else{
				$message->member_id = Session::get('serial_id');
				$message->author = Session::get('unique_serial');
				$message->serial = Session::get('unique_serial');

			}
			if(Input::get('reply_to')){
				$parent_mssg = Messages::find(Input::get('reply_to'));
				$message->responseto = $parent_mssg->id;
				if($parent_mssg->level == 0){
					$message->parent = $parent_mssg->id;
				}else{
					$message->parent = $parent_mssg->parent;	
				}
				$message->level = $parent_mssg->level + 1;
				$message->save();
				$message->path = $parent_mssg->path . '.' . str_repeat('0', 8 - strlen((string)$message->id)) . $message->id;
				$message->h_level = $parent_mssg->responses + 1;
				$message->readable = 1;
				$message->save();
				$parent_mssg->responses = $parent_mssg->responses + 1;
				$parent_mssg->save();
			}else{
				$message->save();
				$message->path = '0.' . str_repeat('0', 8 - strlen((string)$message->id)) . $message->id;
				$message->readable = 1;
				$message->save();
			}
			if(Auth::check()){	
				$mssg_voted = new MessagesVoted();
				$mssg_voted->message_id = $message->id;
				$mssg_voted->member_id = Auth::user()->id;
				$mssg_voted->status = 1;
				$mssg_voted->save();
			}
			return Redirect::to(Session::get('curr_page'));
		}
		return Redirect::to(action('chat@getLive',$chat_id));
	}

	public function getPauseChat($chat_id){
		$chat = Chats::find($chat_id);
		if(Auth::check()){
			if(Auth::user()->name == $chat->admin){
				$chat->live = 0;
				$chat->save();
			}else{
				return Redirect::to(Session::get('curr_page'));
			}	
		}else{
			if(Session::get('unique_serial') == $chat->admin){
				$chat->live = 0;
				$chat->save();
			}else{
				return Redirect::to(Session::get('curr_page'));
			}
		}	
		return Redirect::to(action('chat@getStatic',$chat_id));
	}

	public function getPlayChat($chat_id){
		$chat = Chats::find($chat_id);
		if(Auth::check()){
			if(Auth::user()->name == $chat->admin){
				$chat->live = 1;
				$chat->save();
			}else{
				return Redirect::to(Session::get('curr_page'));
			}	
		}else{
			if(Session::get('unique_serial') == $chat->admin){
				$chat->live = 1;
				$chat->save();
			}else{
				return Redirect::to(Session::get('curr_page'));
			}
		}	
		return Redirect::to(action('chat@getLive',$chat_id));
	}

	public function getAdmin(){
		$chat = Chats::find(Input::get('id'));
		return $chat->admin;
	}

	public function getCheckMod(){
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
				$chat->raw_details = $details;
				$chat->details = $this->parseText($details);
				$chat->save();
				return $chat->details;	
			}
		}	
		return false;
	}

	public function postNewChat(){
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
			if(htmlentities(Input::get('description'))){
				$details = htmlentities(Input::get('description'));
				$chat->raw_details = $details;
				$chat->details = $this->parseText($details);
			}
			if(htmlentities(Input::get('live_status')) == 1 || htmlentities(Input::get('live_status')) == 0){
				$chat->live = htmlentities(Input::get('live_status'));
			}
			$chat->type = 'open';
			if(Auth::check()){
				$chat->admin = Auth::user()->name;
				$chat->admin_id = Auth::user()->id;
				if($chat->title && $chat->admin){
					$chat->save();
					$ch_voted = new ChatsVoted();
					$ch_voted->chat_id = $chat->id;
					$ch_voted->member_id = Auth::user()->id;
					$ch_voted->status = 1;
					$ch_voted->save();
				}else{
					return Redirect::to(Session::get('curr_page'));
				}
			}else{
				$chat->admin = Session::get('unique_serial');
				$chat->admin_id = Session::get('serial_id');
				if($chat->title && $chat->admin){
					$chat->save();
				}else{
					return Redirect::to(Session::get('curr_page'));
				}
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
			if($chat->live){
				return Redirect::to(action('chat@getLive',$chat->id));
			}else{
				return Redirect::to(action('chat@getStatic',$chat->id));
			}
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
			if($status == 2){  //downvoted previously
				if($user_exists){
					$user->total_cognizance = $user->total_cognizance + 2;
					if($user->cognizance + 2 >= $user->next_level){
						$user->cognizance = ($user->cognizance + 2) % $user->next_level;
						$user->level = $user->level + 1;
						$user->next_level = 100 + 3000/(1 + exp(5 - $user->level));
					}else{
						$user->cognizance = ($user->cognizance + 2) % $user->next_level;
					}
					$user->save();
				}
				foreach($chat->tags as $tag){
					$usertag = UsersToTags::wheretag_id($tag->id)->whereuser_id(Auth::user()->id)->first();
					if($usertag){
						$usertag->score = $usertag->score + 2;
						$usertag->save();
					}
					$tag->popularity = $tag->popularity + 2;
					$tag->save();
				}
				$chat->upvotes = $chat->upvotes + 1;
				$chat->downvotes = $chat->downvotes - 1;
				$voted->status = 1;
				$voted->save();
				$chat->save();
				return array('status' => 1,'upvotes' => $chat->upvotes - $chat->downvotes);
			}elseif($status == 1){  //upvoted previously
				if($user_exists){
					$user->total_cognizance = $user->total_cognizance - 1;
					if($user->level > 0 && $user->cognizance - 1 < 0){
						$user->level = $user->level - 1;
						$user->next_level = 100 + 3000/(1 + exp(5 - $user->level));
						$user->cognizance = $user->next_level - 1;
					}else if($user->level == 0){
						$user->cognizance = ($user->cognizance - 1 < 0) ? $user->cognizance : $user->cognizance - 1;
					}else{
						$user->cognizance = $user->cognizance - 1;
					}
					$user->save();
				}
				foreach($chat->tags as $tag){
					$usertag = UsersToTags::wheretag_id($tag->id)->whereuser_id(Auth::user()->id)->first();
					if($usertag){
						$usertag->score = $usertag->score - 1;
						$usertag->save();
					}
					$tag->popularity = $tag->popularity - 1;
					$tag->save();
				}
				$chat->upvotes = $chat->upvotes - 1;
				$voted->status = 0;
				$voted->save();
				$chat->save();
				return array('status' => 2,'upvotes' => $chat->upvotes - $chat->downvotes);
			}else{  //first time voting
				if($user_exists){
					$user->total_cognizance = $user->total_cognizance + 1;
					if($user->cognizance + 1 >= $user->next_level){
						$user->cognizance = ($user->cognizance + 1) % $user->next_level;
						$user->level = $user->level + 1;
						$user->next_level = 100 + 3000/(1 + exp(5 - $user->level));
					}else{
						$user->cognizance = ($user->cognizance + 1) % $user->next_level;
					}
					$user->save();
				}
				foreach($chat->tags as $tag){
					$usertag = UsersToTags::wheretag_id($tag->id)->whereuser_id(Auth::user()->id)->first();
					if($usertag){
						$usertag->score = $usertag->score + 1;
						$usertag->save();
					}
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
			if($status == 1){  //upvoted previously
				if($user_exists){
					$user->total_cognizance = $user->total_cognizance - 2;
					if($user->level > 0 && $user->cognizance - 2 < 0){
						$user->level = $user->level - 1;
						$user->next_level = 100 + 3000/(1 + exp(5 - $user->level));
						$user->cognizance = $user->next_level - 2;
					}else if($user->level == 0){
						if($user->cognizance - 2 > -1){
							$user->cognizance = $user->cognizance - 2;
						}else if($user->cognizance - 1 > -1){
							$user->cognizance = $user->cognizance - 1;
						}else{}
					}else{
						$user->cognizance = $user->cognizance - 1;
					}
					$user->save();
				}
				foreach($chat->tags as $tag){
					$usertag = UsersToTags::wheretag_id($tag->id)->whereuser_id(Auth::user()->id)->first();
					if($usertag){
						$usertag->score = $usertag->score - 2;
						$usertag->save();
					}
					$tag->popularity = $tag->popularity - 2;
					$tag->save();
				}
				$chat->upvotes = $chat->upvotes - 1;
				$chat->downvotes = $chat->downvotes + 1;
				$voted->status = 2;
				$voted->save();
				$chat->save();
				return array('status' => 1,'upvotes' => $chat->upvotes - $chat->downvotes);
			}elseif($status == 2){  //downvoted previously
				if($user_exists){
					$user->total_cognizance = $user->total_cognizance + 1;
					if($user->cognizance + 1 >= $user->next_level){
						$user->cognizance = ($user->cognizance + 1) % $user->next_level;
						$user->level = $user->level + 1;
						$user->next_level = 100 + 3000/(1 + exp(5 - $user->level));
					}else{
						$user->cognizance = ($user->cognizance + 1) % $user->next_level;
					}
					$user->save();
				}
				foreach($chat->tags as $tag){
					$usertag = UsersToTags::wheretag_id($tag->id)->whereuser_id(Auth::user()->id)->first();
					if($usertag){
						$usertag->score = $usertag->score + 1;
						$usertag->save();
					}
					$tag->popularity = $tag->popularity + 1;
					$tag->save();
				}
				$chat->downvotes = $chat->downvotes - 1;
				$voted->status = 0;
				$voted->save();
				$chat->save();
				return array('status' => 2,'upvotes' => $chat->upvotes - $chat->downvotes);
			}else{  //first time downvoting
				if($user_exists){
					$user->total_cognizance = $user->total_cognizance - 1;
					if($user->level > 0 && $user->cognizance - 1 < 0){
						$user->level = $user->level - 1;
						$user->next_level = 100 + 3000/(1 + exp(5 - $user->level));
						$user->cognizance = $user->next_level - 1;
					}else if($user->level == 0){
						$user->cognizance = ($user->cognizance - 1 < 0) ? $user->cognizance : $user->cognizance - 1;
					}else{
						$user->cognizance = $user->cognizance - 1;
					}
					$user->save();
				}
				foreach($chat->tags as $tag){
					$usertag = UsersToTags::wheretag_id($tag->id)->whereuser_id(Auth::user()->id)->first();
					if($usertag){
						$usertag->score = $usertag->score - 1;
						$usertag->save();
					}
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

	public function postMessageUpvote(){
		if(Auth::check()){
			$message_id = Input::get('id');
			$member = Auth::user()->id;
			$message = Messages::find($message_id);
			$voted = new MessagesVoted();
			$status = 0;
			$temp = $voted->wheremember_id($member)->wheremessage_id($message_id)->first();
			if($temp){
				$voted = $temp;
				$status = $voted->status;
			}else{
				$voted->member_id = $member;
				$voted->message_id = $message_id;
			}
			$user_exists = 0;
			if(preg_match('/[a-zA-Z]/',$message->author)){
				$user = new User();
				$user->name = $message->author;
				$user = $user->findAll();
				$user_exists = 1;
			}
			if($status == 2){  //downvoted previously
				if($user_exists){
					$user->total_cognizance = $user->total_cognizance + 2;
					if($user->cognizance + 2 >= $user->next_level){
						$user->cognizance = ($user->cognizance + 2) % $user->next_level;
						$user->level = $user->level + 1;
						$user->next_level = 100 + 3000/(1 + exp(5 - $user->level));
					}else{
						$user->cognizance = ($user->cognizance + 2) % $user->next_level;
					}
					$user->save();
				}
				$message->upvotes = $message->upvotes + 1;
				$message->downvotes = $message->downvotes - 1;
				$voted->status = 1;
				$voted->save();
				$message->save();
				return array('status' => 1,'upvotes' => $message->upvotes - $message->downvotes);
			}elseif($status == 1){  //upvoted previously
				if($user_exists){
					$user->total_cognizance = $user->total_cognizance - 1;
					if($user->level > 0 && $user->cognizance - 1 < 0){
						$user->level = $user->level - 1;
						$user->next_level = 100 + 3000/(1 + exp(5 - $user->level));
						$user->cognizance = $user->next_level - 1;
					}else if($user->level == 0){
						$user->cognizance = ($user->cognizance - 1 < 0) ? $user->cognizance : $user->cognizance - 1;
					}else{
						$user->cognizance = $user->cognizance - 1;
					}
					$user->save();
				}
				$message->upvotes = $message->upvotes - 1;
				$voted->status = 0;
				$voted->save();
				$message->save();
				return array('status' => 2,'upvotes' => $message->upvotes - $message->downvotes);
			}else{  //first time voting
				if($user_exists){
					$user->total_cognizance = $user->total_cognizance + 1;
					if($user->cognizance + 1 >= $user->next_level){
						$user->cognizance = ($user->cognizance + 1) % $user->next_level;
						$user->level = $user->level + 1;
						$user->next_level = 100 + 3000/(1 + exp(5 - $user->level));
					}else{
						$user->cognizance = ($user->cognizance + 1) % $user->next_level;
					}
					$user->save();
				}
				$message->upvotes = $message->upvotes + 1;
				$voted->status = 1;	
				$voted->save();
				$message->save();
				return array('status' => 3,'upvotes' => $message->upvotes - $message->downvotes);
			}
		}else{
			return array('status' => 0,'upvotes' => 0);
		}
	}

	public function postMessageDownvote(){
		if(Auth::check()){
			$message_id = Input::get('id');
			$member = Auth::user()->id;
			$message = Messages::find($message_id);
			$voted = new MessagesVoted();
			$status = 0;
			$temp = $voted->wheremember_id($member)->wheremessage_id($message_id)->first();
			if($temp){
				$voted = $temp;
				$status = $voted->status;
			}else{
				$voted->member_id = $member;
				$voted->message_id = $message_id;
			}
			$user_exists = 0;
			if(preg_match('/[a-zA-Z]/',$message->author)){
				$user = new User();
				$user->name = $message->author;
				$user = $user->findAll();
				$user_exists = 1;
			}
			if($status == 1){  //upvoted previously
				if($user_exists){
					$user->total_cognizance = $user->total_cognizance - 2;
					if($user->level > 0 && $user->cognizance - 2 < 0){
						$user->level = $user->level - 1;
						$user->next_level = 100 + 3000/(1 + exp(5 - $user->level));
						$user->cognizance = $user->next_level - 2;
					}else if($user->level == 0){
						if($user->cognizance - 2 > -1){
							$user->cognizance = $user->cognizance - 2;
						}else if($user->cognizance - 1 > -1){
							$user->cognizance = $user->cognizance - 1;
						}else{}
					}else{
						$user->cognizance = $user->cognizance - 1;
					}
					$user->save();
				}
				$message->upvotes = $message->upvotes - 1;
				$message->downvotes = $message->downvotes + 1;
				$voted->status = 2;
				$voted->save();
				$message->save();
				return array('status' => 1,'upvotes' => $message->upvotes - $message->downvotes);
			}elseif($status == 2){  //downvoted previously
				if($user_exists){
					$user->total_cognizance = $user->total_cognizance + 1;
					if($user->cognizance + 1 >= $user->next_level){
						$user->cognizance = ($user->cognizance + 1) % $user->next_level;
						$user->level = $user->level + 1;
						$user->next_level = 100 + 3000/(1 + exp(5 - $user->level));
					}else{
						$user->cognizance = ($user->cognizance + 1) % $user->next_level;
					}
					$user->save();
				}
				$message->downvotes = $message->downvotes - 1;
				$voted->status = 0;
				$voted->save();
				$message->save();
				return array('status' => 2,'upvotes' => $message->upvotes - $message->downvotes);
			}else{  //first time downvoting
				if($user_exists){
					$user->total_cognizance = $user->total_cognizance - 1;
					if($user->level > 0 && $user->cognizance - 1 < 0){
						$user->level = $user->level - 1;
						$user->next_level = 100 + 3000/(1 + exp(5 - $user->level));
						$user->cognizance = $user->next_level - 1;
					}else if($user->level == 0){
						$user->cognizance = ($user->cognizance - 1 < 0) ? $user->cognizance : $user->cognizance - 1;
					}else{
						$user->cognizance = $user->cognizance - 1;
					}
					$user->save();
				}
				$message->downvotes = $message->downvotes + 1;
				$voted->status = 2;	
				$voted->save();
				$message->save();
				return array('status' => 3,'upvotes' => $message->upvotes - $message->downvotes);
			}
		}else{
			return array('status' => 0,'upvotes' => 0);
		}
	}

}
