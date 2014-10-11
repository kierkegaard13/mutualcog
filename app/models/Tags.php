<?php

class Tags extends EloquentBridge 
{
	protected $table = "tags";
	public $timestamps = true;

	public function __toString(){
		return $this->name;
	}

	public function chats(){
		return Chats::select('chats.*',DB::raw('chats_to_tags.pinned as tag_pinned'),DB::raw('(case when (chats_to_tags.upvotes - chats_to_tags.downvotes > 0) then log(chats_to_tags.upvotes - chats_to_tags.downvotes) + timestampdiff(minute,"2013-1-1 12:00:00",chats.created_at)/45000 when (chats_to_tags.upvotes - chats_to_tags.downvotes = 0) then log(1) + timestampdiff(minute,"2013-1-1 12:00:00",chats.created_at)/45000 else log(1/abs(chats_to_tags.upvotes - chats_to_tags.downvotes)) + timestampdiff(minute,"2013-1-1 12:00:00",chats.created_at)/45000 end) AS score'))->join('chats_to_tags','chats_to_tags.chat_id','=','chats.id')->where('chats_to_tags.tag_id',$this->id)->where('chats_to_tags.removed','0')->where('chats.removed','0')->orderBy(DB::raw('chats_to_tags.pinned'),'desc')->orderBy(DB::raw('score'),'desc')->paginate(25);
	}

	public function chatsnew(){
		return Chats::select('chats.*')->join('chats_to_tags','chats_to_tags.chat_id','=','chats.id')->where('chats_to_tags.tag_id',$this->id)->where('chats.removed','0')->where('chats_to_tags.removed','0')->orderBy(DB::raw('chats_to_tags.pinned'),'desc')->orderBy('created_at','desc')->paginate(25);
	}

	public function chatsrising(){
		return Chats::select('chats.*',DB::raw('(chats_to_tags.upvotes - chats_to_tags.downvotes) - views AS score'))->join('chats_to_tags','chats_to_tags.chat_id','=','chats.id')->where('chats_to_tags.tag_id',$this->id)->where('chats.removed','0')->where('chats_to_tags.removed','0')->orderBy(DB::raw('chats_to_tags.pinned'),'desc')->orderBy(DB::raw('score'),'desc')->paginate(25);
	}

	public function chatscontr(){
		return Chats::select('chats.*')->join('chats_to_tags','chats_to_tags.chat_id','=','chats.id')->where('chats_to_tags.tag_id',$this->id)->whereRaw('abs(chats_to_tags.upvotes - chats_to_tags.downvotes) < 10')->whereRaw('chats_to_tags.upvotes + abs(chats_to_tags.downvotes) > 10')->where('chats.removed','0')->where('chats_to_tags.removed','0')->orderBy(DB::raw('chats_to_tags.pinned'),'desc')->orderBy('created_at','desc')->paginate(25);
	}

	public function chatsremoved(){
		return Chats::select('chats.*')->join('chats_to_tags','chats_to_tags.chat_id','=','chats.id')->where('chats_to_tags.tag_id',$this->id)->where('chats.removed','0')->where('chats_to_tags.removed','1')->orderBy(DB::raw('chats_to_tags.pinned'),'desc')->orderBy('created_at','desc')->paginate(25);
	}

	public function subscribers(){
		return $this->belongsToMany('User','users_to_tags','tag_id','user_id');
	}

	public function online(){
		return count(User::wherepage($this->name)->get());
	}
	
	public function moderators(){
		$mods = UsersToTags::wheretag_id($this->id)->whereis_mod('1')->get();
		$mod_arr = array();
		foreach($mods as $mod){
			$mod_arr[] = $mod->user_id;
		}
		return $mod_arr;
	}
}
