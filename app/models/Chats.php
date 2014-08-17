<?php

class Chats extends EloquentBridge 
{
	protected $table = "chats";
	public $timestamps = true;

	public function author(){
		if(preg_match('/[a-zA-Z]/',$this->admin)){
			return $this->belongsTo('User','admin_id');
		}else{
			return $this->belongsTo('Serials','admin_id');
		}
	}

	public function messages(){
		return $this->hasMany('Messages','chat_id')->wherereadable('1')->orderBy('path')->take(1000);
	}

	public function messagesOnly(){
		return $this->hasMany('Messages','chat_id')->wherereadable('1')->whereresponseto('0')->orderBy('path')->take(1000);
	}

	public function messagesPaginate(){
		return $this->hasMany('Messages','chat_id')->wherereadable('1')->whereresponseto('0')->with('descendants')->orderBy('path')->paginate(25);
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

	public function seen(){
		if(Auth::check()){
			return count(MembersToChats::wheremember_id(Auth::user()->id)->wherechat_id($this->id)->first());
		}else{
			return count(MembersToChats::wheremember_id(Session::get('serial_id'))->wherechat_id($this->id)->first());
		}
	}

}
