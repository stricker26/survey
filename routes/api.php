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
	Route::post('register/researcher', 'Api\AuthController@registerResearcher');
});

Route::prefix('webmaster')->group(function() {
	//dashboard
	Route::post('dashboard','Api\DashboardController@getAll');

	Route::resource('survey', 'Api\SurveyController');
	Route::post('getName', 'Api\AuthController@getName');

	Route::resource('question', 'Api\QuestionController');
	Route::get('questionNumber/{id}', 'Api\QuestionController@questionNumber');
	Route::post('editSurveyQuestion', 'Api\QuestionController@editSurveyQuestion');

	Route::get('/answers/{id}', 'Api\AnswerController@view');
	Route::post('emailRespondent', 'Api\RespondentsController@emailRespondent');
	Route::post('answerRespondent/{id}', 'Api\RespondentsController@answerRespondent');

	Route::post('lists', 'Api\MainSurveyController@lists');
	Route::get('checkResponses/{id}', 'Api\MainSurveyController@getAnalyzeResult');

	Route::get('single-question', 'Api\QuestionController@single');

	//logic
	Route::post('logic', 'Api\LogicController@logic');
	Route::post('logic/getAnswer', 'Api\LogicController@getAnswer');

	//set status of survey
	Route::get('surveyStatus/{id}/{status}', 'Api\QuestionController@surveyStatus');

	//field researcher get survey name
	Route::get('getSurveyName/{id}', 'Api\FieldResearchersController@getSurveyTitle');
	Route::post('getFieldResearchers/all', 'Api\FieldResearchersController@getAllFR');
});

Route::prefix('response')->group(function() {
	Route::post('getAll', 'Api\ResponseController@getAll');

	Route::post('question_summaries/{id}', 'Api\ResponseController@questionSummaryView');

	Route::get('data_trends/{id}', 'Api\ResponseController@dataTrendsView');
	Route::post('data_trends/getTrend/{id}', 'Api\ResponseController@dataTrendsGetTrend');
	Route::post('data_trends/getTrend2/{id}', 'Api\ResponseController@dataTrendsGetTrend2');
	Route::post('data_trends/nextGraph/{id}', 'Api\ResponseController@dataTrendsNextGraph');

	Route::get('ir/all/{id}', 'Api\ResponseController@indResponsesGetAll');
	Route::post('ir/{id}', 'Api\ResponseController@indResponsesGetid');
	Route::post('ir/delete/{id}', 'Api\ResponseController@indResponsesDelete');
});

Route::prefix('front')->group(function() {
	Route::get('/{id}', 'Api\FrontController@survey');
	Route::get('/welcome/{id}', 'Api\FrontController@surveyWelcome');
	Route::post('/logic/{id}', 'Api\FrontController@surveyLogic');
	Route::get('logic/getPopup/{q_no}', 'Api\LogicController@getPopup');
});