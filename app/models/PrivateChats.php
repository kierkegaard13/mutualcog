<?php

class PrivateChats extends EloquentBridge 
{
	protected $table = "private_chats";
	public $timestamps = true;

	public function messages(){
		$mssg_count = count(DB::table('private_messages')->where('chat_id',$this->id)->get());
		if($mssg_count > 25){
			return $this->hasMany('PrivateMessages','chat_id')->skip($mssg_count - 25)->take(25)->orderBy('created_at');
		}else{
			return $this->hasMany('PrivateMessages','chat_id')->take(25)->orderBy('created_at');
		}
	}

	public function friends(){
		return $this->belongsToMany('User','users_to_private_chats','chat_id','user_id')->where('user_id','!=',Auth::user()->id)->whereentity_type(0);
	}
}
