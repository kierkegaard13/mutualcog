<?php

class Rewards extends EloquentBridge 
{
	protected $table = "rewards";

	public function users(){
		return $this->belongsToMany('User','users_to_rewards','reward_id','user_id');
	}

}
