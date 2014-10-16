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
		$prime_keywords = ['posts ','communities ','users '];
		$post_af_keywords = [' in ',' about ',' by ',' here'];
		$post_bf_keywords = ['sfw ','nsfw ','live ','static '];
		$user_keywords = [' named ',' who like ',' near '];
		$com_keywords = [' similar to ',' named ',' concerning '];
		$search_string = htmlentities($search_string);
		$found = -1;
		foreach($prime_keywords as $key => $word){
			$tmp_string = explode($word,$search_string);
			if(sizeof($tmp_string) > 1){
				$found = $key;
				$split_string = explode($word,$search_string);
				break;
			}
		}
		if($found != -1){
			switch($found){
				case 0:
					$chats = new Chats();
					$num_found = 0;
					if(sizeof($split_string) > 1){
						foreach($post_bf_keywords as $key=>$word){
							if(strpos($split_string[0],$word) !== false){
								switch($key){
									case 0:
										$chats = $chats->wherensfw(0);
										$num_found++;
										break;
									case 1:
										$chats = ($num_found == 0) ? $chats->wherensfw(1) : $chats->orWherensfw(1);
										$num_found++;
										break;
									case 2:
										$chats = ($num_found == 0) ? $chats->wherelive(1) : $chats->orWherelive(1);
										$num_found++;
										break;
									case 3:
										$chats = ($num_found == 0) ? $chats->wherelive(0) : $chats->orWherelive(0);
										$num_found++;
										break;
									default:break;
								}
							}
						}
						$split_string = $split_string[1];
					}
					break;
				case 1:
					break;
				case 2:
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
