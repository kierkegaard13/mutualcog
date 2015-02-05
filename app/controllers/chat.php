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
			if(UsersToChats::whereuser(Auth::user()->name)->wherechat_id($chat_id)->wherebanned(1)->first()){
				return Redirect::to('home');
			}
			Auth::user()->chat_id = $chat_id;
			Auth::user()->save();
			$node = new NodeAuth();
			$node->user_id = Auth::user()->id;
			$node->user = Auth::user()->name;
			$node->serial_id = Auth::user()->serial_id;
			if($node->findAll(1)){
				$node = $node->findAll(1);
			}
			$node->serial = Session::get('unique_serial');
			$node->serial_id = Session::get('serial_id');
			$node->sid = Session::getId();
			$node->authorized = 1;
			$node->save();
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
			$user_to_chat = new UsersToChats();
			$user_to_chat->chat_id = $chat_id;
			$user_to_chat->user_id = Auth::user()->id;
			$user_to_chat->user = Auth::user()->name;
			$user_to_chat->ip_address = Auth::user()->serial->ip_address;
			$user_to_chat->is_user = 1;
			if(!$user_to_chat->findAll()){  //getting into chat for the first time
				if($chat->admin_id == Auth::user()->id){
					$user_to_chat->is_admin = 1;
				}else if($chat->admin_id == Auth::user()->serial_id){
					$user_to_chat->is_admin = 1;
					$chat->admin_id = Auth::user()->id;
					$chat->admin = Auth::user()->name;
					$chat->save();
				}
				$user_to_chat->active = 1;
				$user_to_chat->save();
			}else{  //have been in chat before
				$user_to_chat = $user_to_chat->findAll();
				if(sizeof($user_to_chat) > 1)
					$user_to_chat = $user_to_chat[0];
				$user_to_chat->active = 1;
				$user_to_chat->save();
			}
		}else{  //not logged in
			$ip_address = Serials::find(Session::get('serial_id'))->ip_address;
			if(UsersToChats::whereuser(Session::get('serial'))->wherebanned(1)->first()){
				return Redirect::to('home');
			}
			$user_to_chat = new UsersToChats();
			$user_to_chat->chat_id = $chat_id;
			$user_to_chat->user_id = Session::get('serial_id');
			$user_to_chat->user = Session::get('unique_serial');
			$user_to_chat->ip_address = $ip_address;
			if(!$user_to_chat->findAll()){
				$user_to_chat->active = 1;
				if($chat->admin_id == Session::get('serial_id')){
					$user_to_chat->is_admin = 1;
				}
				$user_to_chat->save();
			}else{
				$user_to_chat = $user_to_chat->findAll();
				$user_to_chat->active = 1;
				$user_to_chat->save();
			}
		}
		$community_arr = array();
		$mods = array();
		foreach($chat->moderators as $mod){
			$mods[] = $mod->user;
		}
		Session::put('curr_page',URL::full());
		$view['curr_time'] = date('Y:m:d:H:i');
		$view['upvoted'] = $upvoted;
		$view['downvoted'] = $downvoted;
		$view['mssg_upvoted'] = $mssg_upvoted;
		$view['mssg_downvoted'] = $mssg_downvoted;
		$view['chat'] = $chat;
		$view['mods'] = $mods;
		$view['is_live_chat'] = 1;
		$view['is_static_chat'] = 0;
		$view['is_community'] = 0;
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
			$user_to_chat = new UsersToChats();
			$user_to_chat->chat_id = $chat_id;
			$user_to_chat->user_id = Auth::user()->id;
			$user_to_chat->user = Auth::user()->name;
			if(!$user_to_chat->findAll()){  //getting into chat for the first time
				if($chat->admin_id == Auth::user()->id){
					$user_to_chat->is_admin = 1;
				}else if($chat->admin_id == Auth::user()->serial_id){
					$user_to_chat->is_admin = 1;
					$chat->admin_id = Auth::user()->id;
					$chat->admin = Auth::user()->name;
					$chat->save();
				}
				$user_to_chat->save();
			}else{  //have been in chat before
				$user_to_chat = $user_to_chat->findAll();
				if(sizeof($user_to_chat) > 1)
					$user_to_chat = $user_to_chat[0];
				if($user_to_chat->banned){
					return Redirect::to('home');  //add you have been banned message
				}
				$user_to_chat->save();
			}
		}else{  //not logged in
			$user_to_chat = new UsersToChats();
			$user_to_chat->chat_id = $chat_id;
			$user_to_chat->user_id = Session::get('serial_id');
			$user_to_chat->user = Session::get('unique_serial');
			if(!$user_to_chat->findAll()){
				if($chat->admin_id == Session::get('serial_id')){
					$user_to_chat->is_admin = 1;
				}
				$user_to_chat->save();
			}else{
				$user_to_chat = $user_to_chat->findAll();
				if($user_to_chat->banned){
					return Redirect::to('home');  //add you have been banned message
				}
			}
		}
		$community_arr = array();
		$mods = array();
		foreach($chat->moderators as $mod){
			$mods[] = $mod->user;
		}
		Session::put('curr_page',URL::full());
		$view['curr_time'] = date('Y:m:d:H:i');
		$view['upvoted'] = $upvoted;
		$view['downvoted'] = $downvoted;
		$view['mssg_upvoted'] = $mssg_upvoted;
		$view['mssg_downvoted'] = $mssg_downvoted;
		$view['chat'] = $chat;
		$view['mods'] = $mods;
		if($mssg_id){
			$mssg_arr = array();
			$mssg_arr[] = Messages::with('descendants')->wherereadable('1')->orderBy('path')->find($mssg_id); 
			$view['messages'] = $mssg_arr; 
		}else{
			$view['messages'] = $chat->messagesPaginate();
		}
		$view['is_live_chat'] = 0;
		$view['is_static_chat'] = 1;
		$view['is_community'] = 0;
                return $view;
	}

	public function getChatUsers(){
		$chat_id = Input::get('chat_id');
		$chat = Chats::find($chat_id);
		return $chat->users;
	}

	public function getRandom(){
		$chats = Chats::select('*',DB::raw('(case when (upvotes - downvotes > 0) then log(upvotes - downvotes) + timestampdiff(minute,"2013-1-1 12:00:00",chats.created_at)/45000 when (upvotes - downvotes = 0) then log(1) + timestampdiff(minute,"2013-1-1 12:00:00",chats.created_at)/45000 else log(1/abs(upvotes - downvotes)) + timestampdiff(minute,"2013-1-1 12:00:00",chats.created_at)/45000 end) AS score'))->whereremoved('0')->wherelive('1')->wherensfw('0')->take(25)->orderBy(DB::raw('score'),'desc')->get();
		$chats = $chats->toArray();
		return $this->getLive($chats[mt_rand(0,sizeof($chats) - 1)]['id']);
	}

	public function getLoadMore($mssg_id){
		$message = Messages::find($mssg_id);
		if(!$message){
			return App::abort(500,'Message does not exist');
		}
		if($message->y_dim > 1){
			$messages = Messages::where('path','LIKE',"$message->path%")->where('path','!=',$message->path)->orderBy('path')->take(1000)->get();
		}else{
			$omitted = Messages::where('path','LIKE',"$message->path%")->where('res_num','=','7')->where('y_dim','=',$message->y_dim + 1)->first();
			$previous = count(Messages::where('path','LIKE',"$message->path%")->where('path','<',$omitted->path)->where('path','!=',$message->path)->take(1000)->get());
			$messages = Messages::where('path','LIKE',"$message->path%")->where('path','!=',$message->path)->orderBy('path')->skip($previous)->take(1000)->get();
		}
		$mssg_upvoted = array();
		$mssg_downvoted = array();
		if(Auth::check()){
			foreach(Auth::user()->upvotedMessages() as $upvote){
				$mssg_upvoted[] = $upvote->message_id;
			}
			foreach(Auth::user()->downvotedMessages() as $downvote){
				$mssg_downvoted[] = $downvote->message_id;
			}
		}
		$messages = $messages->toArray();
		$messages['upvoted'] = $mssg_upvoted;
		$messages['downvoted'] = $mssg_downvoted;
		return $messages;
	}

	public function getPinPost($chat_id){
		$chat = Chats::find($chat_id);
		if($chat){
			$chat->pinned = 1;
			$chat->save();
		}
		return $this->returnToCurrPage();
	}

	public function getUnpinPost($chat_id){
		$chat = Chats::find($chat_id);
		if($chat){
			$chat->pinned = 0;
			$chat->save();
		}
		return $this->returnToCurrPage();
	}

	public function getPmLog(){
		$pm_id = Input::get('pm_id');
		$chat = PrivateChats::find($pm_id);
		if($chat){
			$messages = $chat->messages;
		}else{
			$messages = '';
		}
		return $messages;
	}

	public function postMessage($chat_id){
		$chat = Chats::find($chat_id);
		$mssg_content = Input::get('mssg_content');
		if(!$chat->live && strlen($mssg_content) < $this->max_static_length){
			$message = new Messages();
			$message->chat_id = htmlentities($chat_id);
			$message->message = $this->parseText($mssg_content);
			if(Auth::check()){
				$message->user_id = Auth::user()->id;
				$message->author = Auth::user()->name;
				$message->serial = Auth::user()->serial->serial_id;
			}else{
				$message->user_id = Session::get('serial_id');
				$message->author = Session::get('unique_serial');
				$message->serial = Session::get('unique_serial');

			}
			if(Input::get('reply_to')){
				$parent_mssg = Messages::find(Input::get('reply_to'));
				$message->responseto = $parent_mssg->id;
				if($parent_mssg->y_dim == 0){
					$message->parent = $parent_mssg->id;
				}else{
					$message->parent = $parent_mssg->parent;	
				}
				$message->y_dim = $parent_mssg->y_dim + 1;
				$message->save();
				$message->path = $parent_mssg->path . '.' . str_repeat('0', 8 - strlen((string)$message->id)) . $message->id;
				$message->res_num = $parent_mssg->responses + 1;
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
				$mssg_voted->user_id = Auth::user()->id;
				$mssg_voted->status = 1;
				$mssg_voted->save();
			}
			return $this->returnToCurrPage();
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
				return $this->returnToCurrPage();
			}	
		}else{
			if(Session::get('unique_serial') == $chat->admin){
				$chat->live = 0;
				$chat->save();
			}else{
				return $this->returnToCurrPage();
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
				return $this->returnToCurrPage();
			}	
		}else{
			if(Session::get('unique_serial') == $chat->admin){
				$chat->live = 1;
				$chat->save();
			}else{
				return $this->returnToCurrPage();
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
		$user_to_chat = new UsersToChats();
		$user_to_chat = $user_to_chat->whereuser($user)->wherechat_id($chat_id)->first();
		if($user_to_chat){
			if($user_to_chat->is_mod){
				return 1;
			}else{
				return 0;
			}
		}
		return 0;
	}

	public function getHardRemove($chat_id){
		if(Auth::check()){
			$chat = Chats::find($chat_id);
			if($chat){
				if($chat->admin == Auth::user()->name){
					$messages = Messages::wherechat_id($chat_id)->delete();
					$chat_to_communities = ChatsToCommunities::wherechat_id($chat_id)->delete();
					$chat->delete();
				}
			}
		}
		return $this->returnToCurrPage();
	}

	public function getSoftRemove($chat_id,$community_id = null){
		if(Auth::check() && $chat_id){
			if(Auth::user()->is_admin){
				$chat = Chats::find($chat_id);
				if($chat){
					$chat->removed = 1;
					$chat->save();
				}
			}else if(Auth::user()->community_mod == $community_id || Auth::user()->community_admin == $community_id){
				if($community_id){
					$chat_to_community = ChatsToCommunities::wherechat_id($chat_id)->wherecommunity_id($community_id)->first();
					$chat_to_community->removed = 1;
					$chat_to_community->save();
				}
			}
		}
		return $this->returnToCurrPage();
	}

	public function postDetails(){
		$chat = Chats::find(Input::get('id'));
		if($chat){
			$details = Input::get('details');
			if((Session::get('unique_serial') == $chat->admin || Auth::user()->name == $chat->admin) && strlen($details) < 2000){
				$chat->raw_details = htmlentities($details);
				$chat->details = $this->parseText($details);
				$chat->save();
				return $chat->details;	
			}
		}	
		return false;
	}

	public function postNewChat(){
		$validated = 0;
		$title = ucfirst(htmlentities(Input::get('title')));
		$link = htmlentities(Input::get('link'));
		$details = Input::get('description');
		$live_status = htmlentities(Input::get('live_status'));
		$nsfw = htmlentities(Input::get('nsfw'));
		$communities = htmlentities(Input::get('communities'));
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
			if(($year > $t_year || $month > $t_month || $day > $t_day || ($hour * 60 + $minute) > ($t_hour * 60 + $t_minute) + 1)){  //2 minutes between posts
				$serial->last_post = date(DATE_ATOM);
				$serial->save();
				$validated = 1;
			}else{
				$validated = 1;
				//TODO change validated back to 0
			}
		}
		if(htmlentities(Input::get('js_key')) != 'js_enabled'){
			$validated = 0;
		}
		if($validated){
			$chat = new Chats();
			$chat->title = $title;
			if($link){
				if((strpos($link,'http://') == false) && (strpos($link,'https://') == false) && (strpos($link,'//') == false)){
					$link = 'http://' . $link;
				}
				if(substr($link,-4,4) == '.png' || substr($link,-4,4) == '.eps' || substr($link,-4,4) == '.gif' || substr($link,-4,4) == '.jpg' || substr($link,-5,5) == '.jpeg'){
					$site_name = str_replace('//','',$link);
					$site_name = str_replace('http://','',$link);
					$site_name = str_replace('https://','',$site_name);
					$site_name = explode('/',$site_name);
					$site_name = $site_name[0];
					$chat->link = $link;
					$chat->image = $link;
					$chat->site_name = $site_name;
				}else{
					$site_name = str_replace('//','',$link);
					$site_name = str_replace('http://','',$link);
					$site_name = str_replace('https://','',$site_name);
					$site_name = explode('/',$site_name);
					$site_name = $site_name[0];
					if($site_name == 'www.youtube.com'){
						$image = $this->youtubeLogo();
					}else{
						$html = file_get_contents($link);
						$dom = new DOMDocument();
						@$dom->loadHtml($html);
						$imgTags = $dom->getElementsByTagName('img');
						if ($imgTags->length > 0) {
							$imgElement = $imgTags->item(0);
							$image =  $imgElement->getAttribute('src');
							if(!@getimagesize($image)){
								$image = '';
							}
						} else {
							$image = '';
						}
					}
					$chat->link = $link;
					$chat->image = $image;
					$chat->site_name = $site_name;
				}
			}else{
				$chat->link = '';
			}
			$duplicate = Chats::wheretitle($title)->wherelink($link)->first();
			if($details){
				$chat->raw_details = htmlentities($details);
				$chat->details = $this->parseText($details);
			}
			if($live_status == 'on'){
				$chat->live = 1;
			}else{
				$chat->live = 0;
			}
			if($nsfw == 'on'){
				$chat->nsfw = 1;
			}else{
				$chat->nsfw = 0;
			}
			if($duplicate){
				$chat = $duplicate;
			}else{
				if(Auth::check()){
					$chat->admin = Auth::user()->name;
					$chat->admin_id = Auth::user()->id;
					if($chat->save()){
						$ch_voted = new ChatsVoted();
						$ch_voted->chat_id = $chat->id;
						$ch_voted->user_id = Auth::user()->id;
						$ch_voted->status = 1;
						$ch_voted->save();
					}else{
						return $this->returnToCurrPage();
					}
				}else{
					$chat->admin = Session::get('unique_serial');
					$chat->admin_id = Session::get('serial_id');
					if(!$chat->save()){
						return $this->returnToCurrPage();
					}
				}
				$chat = $chat->findAll();
			}
			$communities = explode(' ',$communities);
			foreach($communities as $community){
				if(strlen($community) > 2 && strlen($community) < 20){
					$t = new Communities();
					$community = str_replace('#','',$community);
					$community = htmlentities($community);
					if($community){
						$t->name = $community;
						if($t->findAll()){
							$t = $t->findAll();
							$t->popularity = $t->popularity + 1;
							$t->save();
						}else{
							$t->save();
						}
						$t = $t->findAll();
						$chats_to_communities = new ChatsToCommunities();
						$chats_to_communities->chat_id = $chat->id;
						$chats_to_communities->community_id = $t->id;
						if($chats_to_communities->findAll()){
						}else{
							$chats_to_communities->save();
						}
					}
				}
			}
			if($chat->live){
				return Redirect::to(action('chat@getLive',$chat->id));
			}else{
				return Redirect::to(action('chat@getStatic',$chat->id));
			}
		}
		return $this->returnToCurrPage();
	}

	public function postEditChat(){
		$validated = 1;
		$title = htmlentities(Input::get('title'));
		$link = htmlentities(Input::get('link'));
		$details = Input::get('description');
		$live_status = htmlentities(Input::get('live_status'));
		$nsfw = htmlentities(Input::get('nsfw'));
		$communities = htmlentities(Input::get('communities'));
		if(htmlentities(Input::get('js_key')) != 'js_enabled'){
			$validated = 0;
		}
		if($validated && Auth::check()){
			$chat_id = htmlentities(Input::get('chat_id'));
			$chat = Chats::find($chat_id);
			if($chat->admin != Auth::user()->name){
				if(Session::has('curr_page')){
					return Redirect::to(Session::get('curr_page'));
				}else{
					return Redirect::to('home');
				}
			}
			$chat->title = $title;
			if($link && $link != $chat->link){
				if((strpos($link,'http://') == false) && (strpos($link,'https://') == false) && (strpos($link,'//') == false)){
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
					$site_name = str_replace('//','',$link);
					$site_name = str_replace('http://','',$link);
					$site_name = str_replace('https://','',$site_name);
					$site_name = explode('/',$site_name);
					$site_name = $site_name[0];
					$chat->link = $link;
					$chat->image = $link;
					$chat->site_name = $site_name;
				}else{
					$site_name = str_replace('//','',$link);
					$site_name = str_replace('http://','',$link);
					$site_name = str_replace('https://','',$site_name);
					$site_name = explode('/',$site_name);
					$site_name = $site_name[0];
					if($site_name == 'www.youtube.com'){
						$image = $this->youtubeLogo();
					}else{
						$html = file_get_contents($link);
						$dom = new DOMDocument();
						@$dom->loadHtml($html);
						$imgTags = $dom->getElementsByTagName('img');
						if ($imgTags->length > 0) {
							$imgElement = $imgTags->item(0);
							$image =  $imgElement->getAttribute('src');
							if(!@getimagesize($image)){
								$image = '';
							}
						} else {
							$image = '';
						}
					}
					$chat->link = $link;
					$chat->image = $image;
					$chat->site_name = $site_name;
				}
			}
			if($details){
				$chat->raw_details = htmlentities($details);
				$chat->details = $this->parseText($details);
			}
			if($live_status == 'on'){
				$chat->live = 1;
			}else{
				$chat->live = 0;
			}
			if($nsfw == 'on'){
				$chat->nsfw = 1;
			}else{
				$chat->nsfw = 0;
			}
			if($chat->save()){
				$communities = explode(' ',$communities);
				$community_found = 0;
				$community_index = 0;
				foreach($chat->communities as $old_community){
					foreach($communities as $community){
						if($old_community->name == str_replace('#','',$community)){
							$community_found = 1;
						}
					}
					if($community_found){
						unset($communities[$community_index]);
					}else{
						$chat_to_community = ChatsToCommunities::wherechat_id($chat->id)->wherecommunity_id($old_community->id)->get();
						$chat_to_community->delete();
					}
					$community_found = 0;
					$community_index++;
				}
				foreach($communities as $community){
					if(strlen($community) > 2 && strlen($community) < 20){
						$t = new Communities();
						$community = str_replace('#','',$community);
						$community = htmlentities($community);
						if($community){
							$t->name = $community;
							if($t->findAll()){
								$t = $t->findAll();
								$t->popularity = $t->popularity + 1;
								$t->save();
							}else{
								$t->save();
							}
							$t = $t->findAll();
							$chats_to_communities = new ChatsToCommunities();
							$chats_to_communities->chat_id = $chat->id;
							$chats_to_communities->community_id = $t->id;
							$chats_to_communities->save();
						}
					}
				}
			}
		}
		return $this->returnToCurrPage();
	}

	public function postUpvote(){
		if(Auth::check()){
			return $this->voteEntity(1,1);
		}else{
			return array('status' => 0,'upvotes' => 0);
		}
	}

	public function postDownvote(){
		if(Auth::check()){
			return $this->voteEntity(-1,1);
		}else{
			return array('status' => 0,'upvotes' => 0);
		}
	}

	public function postMessageUpvote(){
		if(Auth::check()){
			return $this->voteEntity(1,0);
		}else{
			return array('status' => 0,'upvotes' => 0);
		}
	}

	public function postMessageDownvote(){
		if(Auth::check()){
			return $this->voteEntity(-1,0);
		}else{
			return array('status' => 0,'upvotes' => 0);
		}
	}

}
