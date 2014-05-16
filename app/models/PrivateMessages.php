<?php

class PrivateMessages extends EloquentBridge 
{
	protected $table = "private_messages";
	public $timestamps = true;

	public function chat(){
		return $this->belongsTo('PrivateChats','chat_id');
	}
}
