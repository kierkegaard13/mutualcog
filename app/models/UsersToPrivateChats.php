<?php

class UsersToPrivateChats extends EloquentBridge 
{
	protected $table = "users_to_private_chats";

	public function friend(){
		return $this->belongsTo('User','friend_id');
	}
}
