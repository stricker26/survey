<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\User;
use App\Survey;
use App\Respondents;
use App\Question;
use DateTime;
use DB;

class DashboardController extends Controller
{
    public function getAll(Request $request) {
    	$uid = User::where('token','=',$request->get('token'))->first()->id;
    	$survey_db = Survey::where('user_id','=',$uid)->get();
    	$allSurvey_count = count($survey_db);

    	if($allSurvey_count == 0) { //no data

    		return response()->json([ 'data' => false ]);

    	} else {

    		$data = true; //check to know if it has data or not
    		$survey_ids = $survey_db->pluck('survey_id')->all(); //ids of all the survey connected to the user
			$respondents = Respondents::whereIn('survey_id', $survey_ids)
										->where('finished_at','!=',null)
										->orderBy('survey_id','asc')
										->get();
			$survey_db = Survey::where('user_id','=',$uid)->get();


    		//overview row start
    		$overview = (object)[]; //set object variable for overview


    		//total active surveys of the user
			$activeCount = $survey_db->where('status', '=', 1)->count();
			$overview->active = $activeCount;


			//total drafts survey of the user
			$draftsCount = $allSurvey_count - $activeCount;
			$overview->drafts = $draftsCount;


			//total responses
			$responsesCount = Respondents::whereIn('survey_id', $survey_ids)->count();
			$overview->totalResponses = $responsesCount;


			//average completion rate
			$completionCount = count($respondents);
			$completionRate = number_format((float)($completionCount/$responsesCount)*100, 2, '.', '') . "%";
			$overview->completionRate = $completionRate;


			//usual time spent
			foreach($respondents as $timespent) {
				$timeDifference = (new DateTime($timespent->created_at))->diff(new DateTime($timespent->finished_at));
				$timespent->timespent = strtotime($timeDifference->format("%H:%i:%s"));
			}
			$plucked_timespent = $respondents->pluck('timespent')->all();
			$timeSpent = date("H:i:s", array_sum($plucked_timespent)/$completionCount);
			$overview->timeSpent = $timeSpent;
			//overview row end


			//active and drafted survey start
			$activeSurveys = array();
			$draftedSurveys = array();
			$as_obj_store = (object)[];
			foreach($survey_db as $survey) {

				//survey id and survey title
				$as_obj_store->survey_id = $survey->survey_id;
				$as_obj_store->title = $survey->title;


				//get created at and updated at
				$added_db = DB::table('added')->where('id','=',$survey->survey_id)->first();
				$as_obj_store->created_at = $added_db->created_at;
				$as_obj_store->updated_at = $added_db->updated_at;


				//question count
				$questionCount = Question::where('survey_id', '=', $survey->survey_id)->count();
				$as_obj_store->questionCount = $questionCount;


				//completion rate
				$respondents = Respondents::where('survey_id', '=', $survey->survey_id)
											->where('finished_at', '!=', null)
											->get();
				$responsesCount = Respondents::where('survey_id', '=', $survey->survey_id)->count();
				$completionCount = count($respondents);
				$completionRate = number_format((float)($completionCount/$responsesCount)*100, 2, '.', '') . "%";
				$as_obj_store->completionRate = $completionRate;


				//usual time for completion
				foreach($respondents as $timespent) {
					$timeDifference = (new DateTime($timespent->created_at))->diff(new DateTime($timespent->finished_at));
					$timespent->timespent = strtotime($timeDifference->format("%H:%i:%s"));
				}
				$plucked_timespent = $respondents->pluck('timespent')->all();
				$timeSpent = (int)date("i", array_sum($plucked_timespent)/$completionCount);
				$as_obj_store->timeSpent = $timeSpent;


				if($survey->status == 1) { //active surveys

					array_push($activeSurveys, $as_obj_store);
					$as_obj_store = (object)[];

				} else { //drafted surveys

					array_push($draftedSurveys, $as_obj_store);
					$as_obj_store = (object)[];

				}

			}
			//active and drafted surveys end


			return response()->json([
				'data' => true,
				'overview' => $overview,
				'activeSurveys' => $activeSurveys,
				'draftedSurveys' => $draftedSurveys
			]);
    	}
    }
}
