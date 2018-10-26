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

Route::prefix('survey')->group(function() {
	Route::get('/{id}', 'StartSurveyController@start');
});

Route::prefix('dashboard')->group(function() {
	Route::get('/{path}', 'Dashboard\DashboardController@index');
	Route::get('/{path}/{url}', 'Dashboard\DashboardController@index');
	Route::get('/{path}/{url}/{id}', 'Dashboard\DashboardController@index');
	//Route::post('/dashboard/survey/add/', 'Dashboard\DashboardController@add');
});