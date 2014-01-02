<?php

class Interactions extends EloquentBridge 
{
	protected $table = "interactions";
	public $timestamps = true;

	public function user(){
		return $this->hasOne('User','user_id');
	}

	public function interaction(){
		return $this->hasOne('User','interaction_id');
	}
}
