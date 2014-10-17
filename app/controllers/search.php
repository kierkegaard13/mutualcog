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

	public function getResult($search_string,$second = null,$third = null){
		$view = View::make('results');
		$curr_page = Session::get('curr_page');
		$curr_page = explode('/',$curr_page);
		$chats = '';
		$users = '';
		$communities = '';
		$prime_keywords = ['posts','communities','users'];
		$post_af_keywords = [' in ',' about ',' by '];
		$post_bf_keywords = ['sfw','nsfw','live','static'];
		$user_keywords = [' named ',' who like ',' near '];
		$com_keywords = [' similar to ',' named ',' concerning '];
		$search_string = htmlentities($search_string);
		$found = -1;
		foreach($prime_keywords as $key => $word){  //split search based on primary keywords
			if(strpos($search_string,$word) !== false){
				$found = $key;
				$split_string = explode($word,$search_string);
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
							if(strpos($split_string[0],$word) !== false){
								switch($key){
									case 0:  //sfw
										$chats = $chats->wherensfw(0);
										$num_found++;
										break;
									case 1:  //nsfw
										$chats = ($num_found == 0) ? $chats->wherensfw(1) : $chats->orWherensfw(1);
										$num_found++;
										break;
									case 2:  //live
										$chats = ($num_found == 0) ? $chats->wherelive(1) : $chats->orWherelive(1);
										$num_found++;
										break;
									case 3:  //static
										$chats = ($num_found == 0) ? $chats->wherelive(0) : $chats->orWherelive(0);
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
						if(strpos($search_string,$word) !== false){   
							switch($key){    
								case 0:  //in
									$split_string = explode($word,$search_string);
									if(sizeof($split_string) > 1){  //found words before keyword
										$search_string = $split_string[1];
									}else{
										$search_string = $split_string[0];
									}
									$tag_str = explode(',',$search_string);
									foreach($tag_str as $index=>$tag){  
										if(sizeof(explode(' ',$tag)) > 1){
											$split_tag = explode(' ',$tag);
											$tag_str[$index] = $split_tag[0];
											$tag_str = array_splice($tag_str,$index + 1);
											$split_tag = array_splice($split_tag,0,1);
											$split_tag = join(' ',$split_tag); 
											$search_string = (sizeof($split_string) > 1) ? $split_string[0] . ' ' . $split_tag : $split_tag;
											break;
										}
									}
									$chats = $chats->whereHas('tags',function($query)use($tag_str){
										$query->where(function($q)use($tag_str){
											foreach($tag_str as $key=>$tag){
												if($key == 0){
													$q->where('name','=',$tag);
												}else{
													$q->orWhere('name','=',$tag);
												}
											}
										});
									});
									break;
								case 1:  //about
									break;
								case 2:  //by
									break;
								default:break;
							}
						}
					}
					$chats = $chats->whereremoved('0')->get();
					break;
				case 1:  //communities
					break;
				case 2:  //users
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
