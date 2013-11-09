<?php

class Members extends EloquentBridge 
{
	protected $table = "members";

	public function messages(){
		return $this->hasMany('Messages','member_id');
	}

}
