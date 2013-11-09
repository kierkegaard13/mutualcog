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
		$serial_number = mt_rand(0,16777215);
		return getUniqueSerialNumber($serial_number);
	}
	$serial = new Serials();
	$serial->serial_id = $serial_number;
	$temp = $serial->findAll();
	if($temp){
		$curr_date = date('Y:m:d:H:i');
		list($year,$month,$day,$hour,$minute) = explode(':',$curr_date);
		$temp_date = date('Y:m:d:H:i',strtotime($temp->inception));
		list($t_year,$t_month,$t_day,$t_hour,$t_minute) = explode(':',$temp_date);
		if(($year > $t_year || $month > $t_month || $day > $t_day || ($hour * 60 + $minute) > ($t_hour * 60 + $t_minute) + 61) && $temp->reserved == 0){
			$temp->inception = date(DATE_ATOM);
			if(Auth::check()){
				$temp->user_id = Auth::user()->id;
			}else{
				$temp->user_id = -1;
			}
			$temp->save();
			return $serial_number;
		}
		$serial_number = mt_rand(0,16777215);
		return getUniqueSerialNumber($serial_number);
	}
	$serial->inception = date(DATE_ATOM);
	if(Auth::check()){
		$serial->user_id = Auth::user()->id;
	}
	$serial->save();
	return $serial_number;
}

Route::filter('assignSerial',function(){
		if(!Session::has('unique_serial')){
			Session::put('unique_serial',getUniqueSerialNumber());
		}else{
			$serial = Serials::whereserial_id(Session::get('unique_serial'))->first();
			$serial->inception = date(DATE_ATOM);
			if(Auth::check()){
				$serial->user_id = Auth::user()->id;
			}else{
				$serial->user_id = -1;
			}
			$serial->save();
		}
		});

Route::group(array('before' => 'assignSerial'), function(){

		Route::controller('home','home');
		Route::controller('profile','profile');
		Route::controller('soon','soon');
		Route::controller('privacy','privacy');
		Route::controller('terms','terms');
		Route::controller('feedback','FeedbackController');
		Route::controller('tags','TagsController');
		Route::controller('chat','chat');
		Route::controller('scripts','scripts');
		Route::get('/p/{user}',array('uses' => 'p@getIndex'));

		Route::get('/',array('uses' => 'Home@getIndex'));

		});

