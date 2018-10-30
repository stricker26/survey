<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Survey;
use App\Answers;
use App\Question;
use App\Respondents;
use DateTime;

class ResponseController extends Controller
{
    public function getAll() {
        date_default_timezone_set("Asia/Manila");
        $date_now = date("Y-m-d 00:00:00");
        $date_for_respon = date("Y-m-d");

    	$all_survey = Survey::select('id','title','status','survey_id')->get();
    	foreach($all_survey as $survey) {
    		if($survey->status == '1') {
    			$survey->status = 'Digital Survey';
    		}
    		$survey->respondents_ago = Respondents::where('survey_id','=',$survey->survey_id)
						->count();
    		$survey->respondents_today = Respondents::where('survey_id','=',$survey->survey_id)
						->where('created_at','>=',$date_now)
						->count();
    		$respondents_dates = new DateTime(Respondents::where('survey_id','=',$survey->survey_id)
	    				->orderBy('created_at','asc')
	    				->first()->created_at);
	    	$survey->respondents_days_ago = $respondents_dates->diff(new DateTime($date_for_respon))->format('%a');
    	}

    	return response()->json(['success' => $all_survey]);
    }

    public function responseView($id) {
        $questions = Question::where('survey_id','=',$id)->get();
        $array_qid = [];
        foreach($questions as $question) {
            array_push($array_qid, $question->id);
        }
        $answers = Answers::whereIn('q_id',$array_qid)->get();
        $title = Survey::where('survey_id', '=', $questions[0]->survey_id)->first()->title;

        return response()->json(['questions' => $questions, 'answers' => $answers, 'title' => $title]);
    }
}
