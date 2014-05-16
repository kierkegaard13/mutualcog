<?php

class PrivateChats extends EloquentBridge 
{
	protected $table = "private_chats";
	public $timestamps = true;

	public function messages(){
		return $this->hasMany('PrivateMessages','chat_id');
	}
}
