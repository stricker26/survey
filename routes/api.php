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

Route::prefix('webmaster')->group(function() {
	Route::resource('survey', 'Api\SurveyController');
	Route::resource('question', 'Api\QuestionController');
	Route::post('emailRespondent', 'Api\RespondentsController@emailRespondent');
	Route::post('answerRespondent', 'Api\RespondentsController@answerRespondent');
	Route::get('lists', 'Api\MainSurveyController@lists');
});

Route::prefix('front')->group(function() {
	Route::get('/{id}', 'Api\FrontController@survey');
});