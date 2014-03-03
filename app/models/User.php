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
		return $this->belongsTo('Serials','serial_id');
	}

	public function messages(){
		return $this->hasMany('Messages','member_id');
	}

	public function posts(){
		return $this->hasMany('Chats','admin_id');
	}

	public function chats(){
		return $this->belongsToMany('Chats','members_to_chats','member_id','chat_id');
	}

	public function friendships(){
		return $this->belongsToMany('Interactions','interaction_users','user_id','interaction_id')->orderBy(DB::raw('bond + bond * timestampdiff(minute,"2013-1-1 12:00:00",interactions.updated_at)/45000'));
	}

	public function subscriptions(){
		return $this->belongsToMany('Tags','users_to_tags','user_id','tag_id');
	}

	public function owned(){
		return count(UsersToTags::whereuser_id($this->id)->whereis_admin(1)->get());
	}

	public function upvotedChats(){
		return ChatsVoted::wheremember_id($this->id)->wherestatus(1)->get();
	}

	public function downvotedChats(){
		return ChatsVoted::wheremember_id($this->id)->wherestatus(2)->get();
	}

	public function upvotedMessages(){
		return MessagesVoted::wheremember_id($this->id)->wherestatus(1)->get();
	}

	public function downvotedMessages(){
		return MessagesVoted::wheremember_id($this->id)->wherestatus(2)->get();
	}

}
