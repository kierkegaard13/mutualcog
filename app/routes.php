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

function compareTimes($time1, $format = 'minutes', $time2 = null){
	$time_diff = 0;
	$time1 = date('Y:W:w:H:i',strtotime($time1));
	if($time2){
		$time2 = date('Y:W:w:H:i',strtotime($time2));
	}else{
		$time2 = date('Y:W:w:H:i');
	}
	list($year1,$week1,$day1,$hour1,$minute1) = explode(':',$time1);
	list($year2,$week2,$day2,$hour2,$minute2) = explode(':',$time2);
	$year_diff = ($year1 - $year2) * 525949;
	$week_diff = ($week1 - $week2) * 10080;
	$day_diff = ($day1 - $day2) * 1440;
	$hour_diff = ($hour1 - $hour2) * 60;
	$minute_diff = $minute1 - $minute2;
	$time_diff = $year_diff + $week_diff + $day_diff + $hour_diff + $minute_diff;
	if($format == 'minutes'){
		return $time_diff;
	}else if($format == 'hours'){
		return $time_diff/60;
	}else if($format == 'days'){
		return $time_diff/1440;
	}else if($format == 'weeks'){
		return $time_diff/10080;
	}else{
		return $time_diff/525949;
	}
}

function getUniqueSerialNumber($serial_number=null){
	if(!$serial_number){
		$serial_number = mt_rand(2,268435455);
		return getUniqueSerialNumber($serial_number);
	}
	$serial = new Serials();
	$serial->serial_id = $serial_number;
	$temp = $serial->findAll();
	if($temp){  //serial number exists
		/* if temp is more than 8 hours old */
		if(abs(compareTimes($temp->updated_at)) > 721){
			$temp->ip_address = Request::getClientIp();
			$temp->welcomed = 0;
			$temp->save();
			Session::put('unique_serial',$temp->serial_id);
			Session::put('serial_id',$temp->id);
			if(Auth::check()){
				Auth::user()->serial_id = $temp->id;
				Auth::user()->disconnecting = 0;
				Auth::user()->online = 1;
				Auth::user()->save();
				$node = new NodeAuth();
				$node->serial = $serial->serial_id;
				$node->sid = Session::getId();
				$node->authorized = 1;
				if($node->findAll()){
					$node = $node->findAll();
				}
				$node->user_id = Auth::user()->id;
				$node->user = Auth::user()->name;
				$node->serial_id = $serial->id;
				$node->save();
			}
			return true;
		}
		$serial_number = mt_rand(0,16777215);
		return getUniqueSerialNumber($serial_number);
	}
	$serial->ip_address = Request::getClientIp();
	$serial->welcomed = 0;
	$serial->save();
	Session::put('unique_serial',$serial->serial_id);
	Session::put('serial_id',$serial->id);
	if(Auth::check()){
		Auth::user()->serial_id = $serial->id;
		Auth::user()->disconnecting = 0;
		Auth::user()->online = 1;
		Auth::user()->save();
		$node = new NodeAuth();
		$node->serial = $serial->serial_id;
		$node->sid = Session::getId();
		$node->authorized = 1;
		if($node->findAll()){
			$node = $node->findAll();
		}
		$node->user_id = Auth::user()->id;
		$node->user = Auth::user()->name;
		$node->serial_id = $serial->id;
		$node->save();
	}
	return true;
}

Route::filter('assignSerial',function(){
		if(!Session::has('unique_serial')){
			getUniqueSerialNumber();
			//TODO: iterate through connections to generate bond score
			if(Auth::check()){
				$interactions = InteractionUsers::whereuser_id(Auth::user()->id)->wheretype(0)->wherefriended(1)->get();
				$first_id_arr = array();
				$second_id_arr = array();
				foreach($interactions as $interaction){  //generate first level nodes
					$first_id_arr[] = $interaction->entity_id;
					$sec_inters = InteractionUsers::whereuser_id($interaction->entity_id)->wheretype(0)->wherefriended(1)->get();
					foreach($sec_inters as $sec_inter){  //generate second level nodes
						$second_id_arr[] = $sec_inter->entity_id;
					}
				}
			}
		}else{
			$serial = Serials::whereserial_id(Session::get('unique_serial'))->first();
			if($serial){
				$serial->ip_address = Request::getClientIp();
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
		Route::controller('community','community');
		Route::controller('chat','chat');
		Route::controller('search','search');
		Route::get('/u/{user}',array('uses' => 'u@getIndex'));
		Route::get('/c/{community}/{option?}',array('uses' => 'c@getIndex'));

		if(Auth::check()){
			Route::get('/{option?}',array('uses' => 'Home@getIndex'));
		}else{
			//Route::get('/',array('uses' => 'Search@getIndex'));
			Route::get('/{option}',array('uses' => 'Home@getIndex'));
		}

		});

