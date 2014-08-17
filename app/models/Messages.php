<?php

class Messages extends EloquentBridge 
{
	protected $table = "messages";
	public $timestamps = true;

	public function descendants(){
		return $this->hasMany('Messages','parent')->where('h_level','<=','6')->where('level','<=','2')->orderBy('path');
	}

	public function mssgParent(){
		return $this->belongsTo('Messages','responseto');
	}

}
