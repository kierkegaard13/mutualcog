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
		/* if temp is more than 8 hours old */
		if(abs($this->compareTimes($temp->updated_at)) > 721){
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

