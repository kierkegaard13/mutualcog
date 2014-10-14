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
		$keywords = [' in ','posts titled','users who like',' here','users near me'];
		$search_string = htmlentities($search_string);
		$found = -1;
		foreach($keywords as $key => $word){
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
					$search_string = $split_string[0];
					$tag_string = join(' ',array_slice($split_string,1,sizeof($split_string) - 1));
					$split_tags = explode(',',$tag_string);
					$tag_ids = array();
					foreach($split_tags as $tag){
						$tags = Tags::where('name','LIKE','%' . $tag . '%')->get();
						foreach($tags as $tag){
							if(!in_array($tag->id,$tag_ids)){
								$tag_ids[] = $tag->id;
							}
						}
					}
					$chats = Chats::select('chats.*')->leftJoin('chats_to_tags','chats_to_tags.chat_id','=','chats.id')->where(function($query)use($tag_ids){
						foreach($tag_ids as $key=>$id){
							if($key == 0){
								$query->where('chats_to_tags.tag_id','=',$id);
							}else{
								$query->orWhere('chats_to_tags.tag_id','=',$id);
							}
						}
					})->where('chats_to_tags.removed','=','0')->where('chats.removed','=','0')->groupBy('chats.id')->get();
					die(print_r($chats->toArray(),1));
					break;
				case 1:
					break;
				case 2:
					break;
				case 3:
					break;
				case 4:
					break;
				default:
					break;
			}
		}
		$tags = Tags::take(30)->orderBy('popularity','desc')->get();
		Session::put('curr_page',URL::full());
		$view['tags'] = $tags;
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
