<?php

use Illuminate\Auth\UserInterface;
use Illuminate\Auth\Reminders\RemindableInterface;

class User extends EloquentBridge implements UserInterface, RemindableInterface 
{
	protected $table = "users";

	protected $hidden = array('password');

	/**
	 * Get the unique identifier for the user.
	 *
	 * @return mixed
	 */
	public function getAuthIdentifier()
	{
		return $this->getKey();
	}

	/**
	 * Get the password for the user.
	 *
	 * @return string
	 */
	public function getAuthPassword()
	{
		return $this->password;
	}

	/**
	 * Get the e-mail address where password reminders are sent.
	 *
	 * @return string
	 */
	public function getReminderEmail()
	{
		return $this->email;
	}
	
	public function getNameAttribute($value){
		return ucfirst($value);
	}

	public function serial(){
		return $this->hasOne('Serials','user_id');
	}

	public function messages(){
		return $this->hasMany('Messages','member_id');
	}

	public function posts(){
		return $this->hasMany('Chats','admin_id');
	}

	public function interactions(){
		return $this->belongsToMany('User','interactions','interaction_id','user_id');
	}
}
