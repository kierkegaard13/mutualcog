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
		return $this->hasMany('Messages','chat_id')->select('messages.*',DB::raw('(case when (upvotes - downvotes > 0) then log(upvotes - downvotes) + timestampdiff(minute,"2013-1-1 12:00:00",created_at)/45000 when (upvotes - downvotes = 0) then log(1) + timestampdiff(minute,"2013-1-1 12:00:00",created_at)/45000 else log(1/abs(upvotes - downvotes)) + timestampdiff(minute,"2013-1-1 12:00:00",created_at)/45000 end) AS score'))->wherereadable('1')->whereresponseto('0')->with('descendants')->orderBy(DB::raw('score'),'desc')->paginate(25);
	}

	public function communities(){
		return $this->belongsToMany('Communities','chats_to_communities','chat_id','community_id')->withPivot(DB::raw('removed AS community_removed'));
	}

	public function voted(){
		return $this->belongsToMany('User','chats_voted','chat_id','user_id');
	}

	public function moderators(){
		return $this->hasMany('UsersToChats','chat_id')->select('user')->whereis_mod(1);
	}

	public function users(){
		return $this->belongsToMany('User','users_to_chats','chat_id','user_id')->wherebanned(0)->whereis_user(1)->withPivot('is_admin','is_mod','active');
	}

	public function seen(){
		if(Auth::check()){
			return count(UsersToChats::whereuser_id(Auth::user()->id)->wherechat_id($this->id)->first());
		}else{
			return count(UsersToChats::whereuser_id(Session::get('serial_id'))->wherechat_id($this->id)->first());
		}
	}

}
