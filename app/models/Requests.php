<?php

class Requests extends EloquentBridge 
{
	protected $table = "requests";
	public $timestamps = true;

	public function sender(){
		if($this->sender_type == 0){
			return $this->belongsTo('User','sender_id');	
		}	
	} 

}
