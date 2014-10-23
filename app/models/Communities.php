<?php

class Communities extends EloquentBridge 
{
	protected $table = "communities";
	public $timestamps = true;

	public function __toString(){
		return $this->name;
	}

	public function concept(){
		return $this->belongsTo('Concepts','concept_id');
	}

	public function about(){
		return $this->morphToMany('Concepts','entity','entities_to_concepts','entity_id','concept_id');
	}

	public function chats(){
		return Chats::select('chats.*',DB::raw('chats_to_communities.pinned as community_pinned'),DB::raw('(case when (chats_to_communities.upvotes - chats_to_communities.downvotes > 0) then log(chats_to_communities.upvotes - chats_to_communities.downvotes) + timestampdiff(minute,"2013-1-1 12:00:00",chats.created_at)/45000 when (chats_to_communities.upvotes - chats_to_communities.downvotes = 0) then log(1) + timestampdiff(minute,"2013-1-1 12:00:00",chats.created_at)/45000 else log(1/abs(chats_to_communities.upvotes - chats_to_communities.downvotes)) + timestampdiff(minute,"2013-1-1 12:00:00",chats.created_at)/45000 end) AS score'))->join('chats_to_communities','chats_to_communities.chat_id','=','chats.id')->where('chats_to_communities.community_id',$this->id)->where('chats_to_communities.removed','0')->where('chats.removed','0')->orderBy(DB::raw('chats_to_communities.pinned'),'desc')->orderBy(DB::raw('score'),'desc')->paginate(25);
	}

	public function chatsnew(){
		return Chats::select('chats.*')->join('chats_to_communities','chats_to_communities.chat_id','=','chats.id')->where('chats_to_communities.community_id',$this->id)->where('chats.removed','0')->where('chats_to_communities.removed','0')->orderBy(DB::raw('chats_to_communities.pinned'),'desc')->orderBy('created_at','desc')->paginate(25);
	}

	public function chatsrising(){
		return Chats::select('chats.*',DB::raw('(chats_to_communities.upvotes - chats_to_communities.downvotes) - views AS score'))->join('chats_to_communities','chats_to_communities.chat_id','=','chats.id')->where('chats_to_communities.community_id',$this->id)->where('chats.removed','0')->where('chats_to_communities.removed','0')->orderBy(DB::raw('chats_to_communities.pinned'),'desc')->orderBy(DB::raw('score'),'desc')->paginate(25);
	}

	public function chatsremoved(){
		return Chats::select('chats.*')->join('chats_to_communities','chats_to_communities.chat_id','=','chats.id')->where('chats_to_communities.community_id',$this->id)->where('chats.removed','0')->where('chats_to_communities.removed','1')->orderBy(DB::raw('chats_to_communities.pinned'),'desc')->orderBy('created_at','desc')->paginate(25);
	}

	public function subscribers(){
		return $this->belongsToMany('User','users_to_communities','community_id','user_id');
	}

	public function online(){
		return count(User::wherepage($this->name)->get());
	}
	
	public function moderators(){
		$mods = UsersToCommunities::wherecommunity_id($this->id)->whereis_mod('1')->get();
		$mod_arr = array();
		foreach($mods as $mod){
			$mod_arr[] = $mod->user_id;
		}
		return $mod_arr;
	}
}