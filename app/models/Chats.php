<?php

class Chats extends EloquentBridge 
{
	protected $table = "chats";

	public function messages(){
		return $this->hasMany('Messages','chat_id');
	}

	public function tags(){
		return $this->belongsToMany('Tags','chats_to_tags','chat_id','tag_id');
	}

	public function voted(){
		return $this->belongsToMany('User','chats_voted','chat_id','member_id');
	}

	public function moderators(){
		return $this->hasMany('MembersToChats','chat_id')->select('user')->whereis_mod(1);
	}
}
