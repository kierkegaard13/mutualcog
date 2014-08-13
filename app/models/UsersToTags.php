<?php

class UsersToTags extends EloquentBridge 
{
	protected $table = "users_to_tags";
	public $timestamps = true;

	public function tag(){
		return $this->belongsTo('Tags','tag_id');
	}

	public function user(){
		return $this->belongsTo('User','user_id');
	}
}
