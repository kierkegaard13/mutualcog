<?php

class PrivateChats extends EloquentBridge 
{
	protected $table = "private_chats";
	public $timestamps = true;

	public function messages(){
		return $this->hasMany('PrivateMessages','chat_id');
	}

	public function friends(){
		return $this->belongsToMany('User','users_to_private_chats','chat_id','user_id')->where('user_id','!=',Auth::user()->id)->whereentity_type(0);
	}
}
