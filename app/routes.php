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

Route::when('*','csrf',array('post'));

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
		Route::get('/{option?}',array('uses' => 'Home@getIndex'));

		});

