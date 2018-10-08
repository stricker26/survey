<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/default', [
	'uses' => 'Dashboard\SurveyController@defaultadd'
]);

Route::prefix('dashboard')->group(function() {
	Route::get('/{path}', 'Dashboard\SurveyController@index');
	Route::get('/{path}/{url}', 'Dashboard\SurveyController@index');
	Route::get('/{path}/{url}/{id}', 'Dashboard\SurveyController@index');
	Route::post('/dashboard/survey/add', 'Dashboard\SurveyController@add');
});