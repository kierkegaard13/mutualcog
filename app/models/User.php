<?php

use Illuminate\Auth\UserInterface;
use Illuminate\Auth\Reminders\RemindableInterface;

class User extends EloquentBridge implements UserInterface, RemindableInterface 
{
	protected $table = "users";
	public $timestamps = true;

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
		return $this->hasMany('Messages','member_id')->wheretype('public');
	}

	public function privateChats(){
		return $this->belongsToMany('PrivateChats','users_to_private_chats','user_id','chat_id')->where('visible','!=','0')->withPivot('visible','unseen');
	}

	public function privateChatF(){
		return $this->belongsToMany('PrivateChats','users_to_private_chats','entity_id','chat_id')->whereuser_id(Auth::user()->id)->whereentity_type(0);
	}

	public function chats(){
		return $this->hasMany('Chats','admin_id');
	}

	public function chatRoom(){
		return $this->belongsTo('Chats','chat_id')->wheretype('public')->take(1);
	}

	public function rooms(){
		return $this->belongsToMany('Chats','members_to_chats','member_id','chat_id');
	}

	public function friendships(){
		return $this->hasMany('InteractionUsers','user_id')->wheretype(0)->wherefriended(1)->orderBy(DB::raw('bond + bond * timestampdiff(minute,"2013-1-1 12:00:00",interaction_users.updated_at)/45000'),'desc');
	}

	public function subscriptions(){
		return $this->belongsToMany('Tags','users_to_tags','user_id','tag_id');
	}

	public function owned(){
		return count(UsersToTags::whereuser_id($this->id)->whereis_admin(1)->get());
	}

	public function upvotedChats(){
		return ChatsVoted::wheremember_id($this->id)->wherestatus(1)->take(1000)->get();
	}

	public function downvotedChats(){
		return ChatsVoted::wheremember_id($this->id)->wherestatus(2)->take(1000)->get();
	}

	public function upvotedMessages(){
		return MessagesVoted::wheremember_id($this->id)->wherestatus(1)->get();
	}

	public function downvotedMessages(){
		return MessagesVoted::wheremember_id($this->id)->wherestatus(2)->get();
	}

	public function notifications(){
		return $this->hasMany('Notifications','user_id');
	}

	public function globalNotifications(){
		return $this->hasMany('Notifications','user_id')->wheretype(0)->take(5);
	}

	public function mssgNotifications(){
		return $this->hasMany('Notifications','user_id')->wheretype(1)->take(5);
	}

	public function friendNotifications(){
		return $this->hasMany('Notifications','user_id')->wheretype(2)->take(5);
	}

	public function online_score(){
		$d1 = new Datetime($this->updated_at);
		$d2 = new Datetime(date(DATE_ATOM));
		$diff = $d1->diff($d2);
		$online = $diff->d*60*60*24 + $diff->h*60*60 + $diff->i*60 + $diff->s;
		return $online;
	}

	public function online(){
		$d1 = new Datetime($this->updated_at);
		$d2 = new Datetime(date(DATE_ATOM));
		$diff = $d1->diff($d2);
		$online_mssg = "Most recent activity ";
		if($diff->y > 0){
			$online_mssg = $online_mssg . "more than a year ago";	
		}else{
			if($diff->m > 0){
				if($diff->m == 1){
					$online_mssg = $online_mssg . "1 month ago";
				}else{
					$online_mssg = $online_mssg . $diff->m . " months ago";
				}	
			}else if($diff->d > 0){
				if($diff->d == 1){
					$online_mssg = $online_mssg . "1 day ago";
				}else{
					$online_mssg = $online_mssg . $diff->d . " days ago";
				}	
			}else if($diff->h > 0){
				if($diff->h == 1){
					$online_mssg = $online_mssg . "1 hour ago";
				}else{
					$online_mssg = $online_mssg . $diff->h . " hours ago";
				}	
			}else if($diff->i > 0){
				if($diff->i == 1){
					$online_mssg = $online_mssg . "1 minute ago";
				}else{
					$online_mssg = $online_mssg . $diff->i . " minutes ago";
				}	
			}else{
				if($diff->s == 1){
					$online_mssg = $online_mssg . "1 second ago";
				}else{
					$online_mssg = $online_mssg . $diff->s . " seconds ago";
				}	
			}
		}
		return $online_mssg;
	}

}
