<?php

class Messages extends EloquentBridge 
{
	protected $table = "messages";
	public $timestamps = true;

	public function descendants(){
		return $this->hasMany('Messages','parent')->where('h_level','<=','11')->where('level','<=','13')->orderBy('path');
	}

}
