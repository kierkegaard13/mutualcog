<?php

class Tags extends EloquentBridge 
{
	protected $table = "tags";

	public function __toString(){
		return $this->name;
	}

	public function chats(){
		return $this->belongsToMany('Chats','chats_to_tags','tag_id','chat_id')->select('*',DB::raw('(case when (upvotes - downvotes > 0) then log(upvotes - downvotes) + timestampdiff(minute,"2013-1-1 12:00:00",chats.inception)/45000 when (upvotes - downvotes = 0) then log(1) + timestampdiff(minute,"2013-1-1 12:00:00",chats.inception)/45000 else log(1/abs(upvotes - downvotes)) + timestampdiff(minute,"2013-1-1 12:00:00",chats.inception)/45000 end) AS score'))->orderBy(DB::raw('score'),'desc');
	}

}
