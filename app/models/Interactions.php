<?php

class Interactions extends EloquentBridge 
{
	protected $table = "interactions";
	public $timestamps = true;

	public function users(){
		return $this->belongsToMany('User','interaction_users','interaction_id','user_id');
	}
}
