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
			$r_count = count($respondents);
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


			if($r_count == 0) {

				//average completion rate
				$completionRate = "0.00%";
				$overview->completionRate = $completionRate;


				//usual time spent
				$timeSpent = "00:00:00";
				$overview->timeSpent = $timeSpent;


				//average age
				$a_age = "0";
				$overview->averageAge = $a_age;


				//male percentage
				$m_count = "0.00%";
				$overview->male = $m_count;

				
				//female percentage
				$f_count = "0.00%";
				$overview->female = $f_count;

			} else {

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


				//average age
				$ageArr = $respondents->pluck('age')->all();
				$a_age = number_format((float)(array_sum($ageArr)/$completionCount), 2, '.', '');
				$overview->averageAge = $a_age;


				//male percentage
				$maleCount = $respondents->where('gender', '=', "male")->count();
				$m_count = number_format((float)($maleCount/$completionCount)*100, 2, '.', '') . "%";
				$overview->male = $m_count;


				//female percentage
				$femaleCount = $respondents->where('gender', '=', "female")->count();
				$f_count = number_format((float)($femaleCount/$completionCount)*100, 2, '.', '') . "%";
				$overview->female = $f_count;

			}
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


				//check if it has responses
				$respondents = Respondents::where('survey_id', '=', $survey->survey_id)
											->where('finished_at', '!=', null)
											->get();
				$r_count = count($respondents);

				if($r_count == 0) {

					$completionRate = "0.00%";
					$as_obj_store->completionRate = $completionRate;


					//usual time for completion
					$timeSpent = 0;
					$as_obj_store->timeSpent = $timeSpent;


					//average age
					$ageArr = "0";
					$as_obj_store->averageAge = $ageArr;


					//male percentage
					$maleCount = "0.00%";
					$as_obj_store->male = $maleCount;


					//female percentage
					$femaleCount = "0.00%";
					$as_obj_store->female = $femaleCount;

				} else {

					//completion rate
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
					if($timeSpent == 0) {
						$timeSpent = 1;
					}
					$as_obj_store->timeSpent = $timeSpent;


					//average age
					$ageArr = $respondents->pluck('age')->all();
					$as_obj_store->averageAge = number_format((float)(array_sum($ageArr)/$completionCount), 2, '.', '');


					//male percentage
					$maleCount = $respondents->where('gender', '=', "male")->count();
					$as_obj_store->male = number_format((float)($maleCount/$completionCount)*100, 2, '.', '') . "%";


					//female percentage
					$femaleCount = $respondents->where('gender', '=', "female")->count();
					$as_obj_store->female = number_format((float)($femaleCount/$completionCount)*100, 2, '.', '') . "%";

				}


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
