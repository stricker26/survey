<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('user')->group(function() {
	Route::post('login', 'Api\AuthController@login');
	Route::get('logout', 'Api\AuthController@logout');
	Route::post('register', 'Api\AuthController@register');
});

Route::prefix('webmaster')->group(function() {
	Route::resource('survey', 'Api\SurveyController');
	Route::post('getName', 'Api\AuthController@getName');
	Route::resource('question', 'Api\QuestionController');
	Route::post('emailRespondent', 'Api\RespondentsController@emailRespondent');
	Route::post('answerRespondent', 'Api\RespondentsController@answerRespondent');
	Route::get('lists', 'Api\MainSurveyController@lists');
});

Route::prefix('response')->group(function() {
	Route::get('getAll', 'Api\ResponseController@getAll');
	Route::get('question_summaries/{id}', 'Api\ResponseController@responseView');
});

Route::prefix('front')->group(function() {
	Route::get('/{id}', 'Api\FrontController@survey');
});