<?php

/*
   |--------------------------------------------------------------------------
   | Application Routes
   |--------------------------------------------------------------------------
   |
   | Here is where you can register all of the routes for an application.
   | It's a breeze. Simply tell Laravel the URIs it should respond to
   | and give it the Closure to execute when that URI is requested.
   |
 */

function getUniqueSerialNumber($serial_number=null){
	if(!$serial_number){
		$serial_number = mt_rand(2,268435455);
		return getUniqueSerialNumber($serial_number);
	}
	$serial = new Serials();
	$serial->serial_id = $serial_number;
	$temp = $serial->findAll();
	if($temp){  //serial number exists
		$curr_date = date('Y:m:d:H:i');
		list($year,$month,$day,$hour,$minute) = explode(':',$curr_date);
		$temp_date = date('Y:m:d:H:i',strtotime($temp->updated_at));
		list($t_year,$t_month,$t_day,$t_hour,$t_minute) = explode(':',$temp_date);
		if(($year > $t_year || $month > $t_month || $day > $t_day || ($hour * 60 + $minute) > ($t_hour * 60 + $t_minute) + 481)){
			$temp->save();
			if(Auth::check()){
				Auth::user()->serial_id = $temp->id;
			}
			Session::put('unique_serial',$temp->serial_id);
			Session::put('serial_id',$temp->id);
			return true;
		}
		$serial_number = mt_rand(0,16777215);
		return getUniqueSerialNumber($serial_number);
	}
	$serial->save();
	if(Auth::check()){
		Auth::user()->serial_id = $serial->id;
		Auth::user()->disconnecting = 0;
		Auth::user()->online = 1;
		Auth::user()->save();
	}
	Session::put('unique_serial',$serial->serial_id);
	Session::put('serial_id',$serial->id);
	return true;
}

Route::filter('assignSerial',function(){
		if(!Session::has('unique_serial')){
			getUniqueSerialNumber();
		}else{
			$serial = Serials::whereserial_id(Session::get('unique_serial'))->first();
			if($serial){
				$serial->save();
				if(Auth::check()){
					Auth::user()->serial_id = $serial->id;
					Auth::user()->disconnecting = 0;
					Auth::user()->online = 1;
					Auth::user()->save();
				}
			}else{
				getUniqueSerialNumber();
			}
		}
		});

Route::group(array('before' => 'assignSerial'), function(){

		Route::controller('home','home');
		Route::controller('profile','profile');
		Route::controller('privacy','privacy');
		Route::controller('terms','terms');
		Route::controller('tags','TagsController');
		Route::controller('chat','chat');
		Route::get('/u/{user}',array('uses' => 'u@getIndex'));
		Route::get('/t/{tag}',array('uses' => 't@getIndex'));

		Route::get('/',array('uses' => 'Home@getIndex'));

		});

