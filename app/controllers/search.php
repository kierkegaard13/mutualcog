<?php

class Search extends BaseController {

	public function getIndex()
	{
		$view = View::make('search');
		$tags = Tags::take(30)->orderBy('popularity','desc')->get();
		Session::put('curr_page',URL::full());
		$view['tags'] = $tags;
		$view['search_page'] = 1;
		return $view;
	}

	public function parseSearch(&$tag_str,&$search_string,$word){
		$split_string = preg_split($word,$search_string);
		if(sizeof($split_string) > 1){  //found words before keyword
			$search_string = $split_string[1];
		}else{
			$search_string = $split_string[0];
		}
		$tag_str = explode(',',$search_string);
		foreach($tag_str as $index=>$tag){  
			if(sizeof(explode(' ',trim($tag))) > 1){
				$split_tag = explode(' ',trim($tag));
				$tag_str[$index] = $split_tag[0];
				$end_str = join(' ',array_splice($tag_str,0,$index - 1));
				$tag_str = array_splice($tag_str,$index + 1);
				$split_tag = array_splice($split_tag,0,1);
				$split_tag = join(' ',$split_tag); 
				$search_string = (sizeof($split_string) > 1) ? $split_string[0] . ' ' . $split_tag . ' ' . $end_str: $split_tag . ' ' . $end_str;
				break;
			}
		}
		$search_string = $split_string[0];
	}

	public function getResult($search_string,$second = null,$third = null){
		$view = View::make('results');
		$curr_page = Session::get('curr_page');
		$curr_page = explode('/',$curr_page);
		$chats = '';
		$users = '';
		$communities = '';
		$prime_keywords = ["/\bposts\b/i","/\bcommunities\b/i","/\busers\b/i"];
		$post_af_keywords = ["/\bin\b/i","/\babout\b/i","/\bby\b/i"];
		$post_bf_keywords = ["/\bsfw\b/i","/\bnsfw\b/i","/\blive\b/i","/\bstatic\b/i"];
		$user_keywords = ["/\bnamed\b/i","/\bwho like\b/i","/\bnear\b/i"];
		$com_keywords = ["/\bnamed\b/i","/\bsimilar to\b/i","/\babout\b/i"];
		$search_string = htmlentities($search_string);
		$found = -1;
		foreach($prime_keywords as $key => $word){  //split search based on primary keywords
			if(preg_match($word,$search_string)){
				$found = $key;
				$split_string = preg_split($word,$search_string);
				break;
			}
		}
		if($found != -1){
			switch($found){
				case 0:  //posts
					$chats = new Chats();
					$num_found = 0;
					if(sizeof($split_string) > 1){  //keywords before posts found
						foreach($post_bf_keywords as $key=>$word){
							if(preg_match($word,$split_string[0])){
								switch($key){
									case 0:  //sfw
										$chats = $chats->wherensfw(0);
										$num_found++;
										break;
									case 1:  //nsfw
										$chats = ($num_found == 0) ? $chats->wherensfw(1) : $chats->orWhere('nsfw',1);
										$num_found++;
										break;
									case 2:  //live
										$chats = ($num_found == 0) ? $chats->wherelive(1) : $chats->orWhere('live',1);
										$num_found++;
										break;
									case 3:  //static
										$chats = ($num_found == 0) ? $chats->wherelive(0) : $chats->orWhere('live',0);
										$num_found++;
										break;
									default:break;
								}
							}
						}
						$search_string = $split_string[1];
					}else{
						$search_string = $split_string[0];
					}
					foreach($post_af_keywords as $key=>$word){
						if(preg_match($word,$search_string)){   
							switch($key){    
								case 0:  //in
									$this->parseSearch($tag_str,$search_string,$word);
									$chats = $chats->whereHas('tags',function($query)use($tag_str){
										$query->where(function($q)use($tag_str){
											foreach($tag_str as $key=>$tag){
												$tag = trim($tag);
												if($key == 0){
													$q->where('name','LIKE','%'.$tag.'%');
												}else{
													$q->orWhere('name','LIKE','%'.$tag.'%');
												}
											}
										});
									});
									break;
								case 1:  //about
									$this->parseSearch($tag_str,$search_string,$word);
									$chats = $chats->where(function($query)use($tag_str){
										foreach($tag_str as $key=>$tag){
											$tag = trim($tag);
											if($key == 0){
												$query->where(function($q)use($tag){
													$q->where('title','LIKE','%'.$tag.'%');
													$q->orWhere('raw_details','LIKE','%'.$tag.'%');
												});
											}else{
												$query->orWhere(function($q)use($tag){
													$q->where('title','LIKE','%'.$tag.'%');
													$q->orWhere('raw_details','LIKE','%'.$tag.'%');
												});
											}
										}
									});
									break;
								case 2:  //by
									$this->parseSearch($tag_str,$search_string,$word);
									$tag_str = trim($tag_str[0]);
									$chats = $chats->whereadmin($tag_str);
									break;
								default:break;
							}
						}
					}
					$chats = $chats->whereremoved('0')->get();
					break;
				case 1:  //communities
					$communities = new Tags();
					$search_string = $split_string[1];
					foreach($com_keywords as $key=>$word){
						if(preg_match($word,$search_string)){   
							switch($key){    
								case 0:  //named
									$this->parseSearch($tag_str,$search_string,$word);
									$communities = $communities->where(function($query)use($tag_str){
										foreach($tag_str as $key=>$tag){
											$tag = trim($tag);
											if($key == 0){
												$query->where('name','LIKE','%'.$tag.'%');
											}else{
												$query->orWhere('name','LIKE','%'.$tag.'%');
											}
										}
									});
									break;
								case 1:  //similar to
									break;
								case 2:  //about
									break;
								default:break;
							}
						}
					}
					$communities = $communities->get();
					break;
				case 2:  //users
					$search_string = $split_string[1];
					$users = new User();
					foreach($user_keywords as $key=>$word){
						if(preg_match($word,$search_string)){   
							switch($key){    
								case 0:  //named
									$this->parseSearch($tag_str,$search_string,$word);
									$users = $users->where(function($query)use($tag_str){
										foreach($tag_str as $key=>$tag){
											$tag = trim($tag);
											if($key == 0){
												$query->where('name','LIKE','%'.$tag.'%');
											}else{
												$query->orWhere('name','LIKE','%'.$tag.'%');
											}
										}
									});
									break;
								case 1:  //who like
									break;
								case 2:  //near
									break;
								default:break;
							}
						}
					}
					$users = $users->get();
					break;
				default:
					break;
			}
		}else{
			$chats = Chats::where(function($q)use($search_string){
				$q->where('title','LIKE','%'.$search_string.'%');
				$q->orWhere('raw_details','LIKE','%'.$search_string.'%');	
			})->whereremoved('0')->paginate(25);
		}
		$tags = Tags::take(30)->orderBy('popularity','desc')->get();
		Session::put('curr_page',URL::full());
		$view['tags'] = $tags;
		$view['chats'] = $chats;
		$view['users'] = $users;
		$view['communities'] = $communities;
		return $view;
	}

	public function getSimilarEntity(){ //TODO: add 'here' functionality
		$input = htmlentities(Input::get('tag'));
		$res_arr = array();
		$tag = new Tags();
		$tag = $tag->where('name','LIKE','%' . $input . '%')->take(5)->get();
		foreach($tag as $t){
			$res_arr[] = array('id' => $t->id,'name' => $t->name,'type' => 'tag');
		}
		$people = new User();
		$people = $people->where('name','LIKE','%' . $input . '%')->take(5)->get();
		foreach($people as $person){
			$res_arr[] = array('id' => $person->id,'name' => $person->name,'type' => 'person');
		}
		$posts = new Chats();
		$posts = $posts->where('title','LIKE','%' . $input . '%')->take(5)->get();
		foreach($posts as $post){
			$res_arr[] = array('id' => $post->id,'name' => $post->title,'live' => $post->live,'type' => 'post');
		}
		return $res_arr;
	}

}
