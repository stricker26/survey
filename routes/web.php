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
	Route::get('/welcome/{id}', 'StartSurveyController@start');
});

Route::prefix('dashboard')->group(function() {
	Route::get('/{path}', 'Dashboard\DashboardController@index');
	Route::get('/{path}/{url}', 'Dashboard\DashboardController@index');
	Route::get('/{path}/{url}/{id}', 'Dashboard\DashboardController@index');
	//Route::post('/dashboard/survey/add/', 'Dashboard\DashboardController@add');
});

Route::prefix('excel')->group(function() {
	Route::get('/individual/{rid}', 'ExcelExportController@individual');
	Route::get('/all/{sid}', 'ExcelExportController@all');
});

Route::prefix('csv')->group(function() {
	Route::get('/individual/{rid}', 'CSVExportController@individual');
	Route::get('/all/{sid}', 'CSVExportController@all');
});

Route::prefix('m-survey')->group(function() {
	Route::get('/getSurvey/s38rV3eY&/{token}','ForMobileController@getSurvey');
	Route::post('/submitData/s38rV3eY&','ForMobileController@saveData');
	Route::get('/checkConn/s38rV3eY&','ForMobileController@checkConn');
});