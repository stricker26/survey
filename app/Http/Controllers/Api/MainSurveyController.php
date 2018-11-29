<?php

namespace App\Http\Controllers\Api;

use DB;
use App\Respondents;
use App\User;
use App\Survey;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MainSurveyController extends Controller
{
    public function lists(Request $request) {
    	$token = $request->get('token');
        $user_id = User::where('token', '=', $token)->first()->id;

    	$lists = DB::table('surveys AS s')
    		->join('added AS d', 's.survey_id', '=', 'd.id')
    		->where('s.user_id','=',$user_id)
    		->get();

        $all_survey = Survey::select('id','title','status','survey_id')->where('user_id','=',$user_id)->get();
        $responsesArray = array();
        foreach($all_survey as $survey) {
            $count = Respondents::where('survey_id','=',$survey->survey_id)
                                    ->where('finished_at','!=',null)
                                    ->count();
            array_push($responsesArray, $count);
        }


    	return response()->json(['lists' => $lists, 'responses' => $responsesArray]);

    }

    public function getAnalyzeResult($id) {
    	$checkResponse = Respondents::where('survey_id','=',$id)
    								->where('finished_at','!=',null)
    								->count();

    	if($checkResponse) {
    		return response()->json(['success' => 'Has data']);
    	} else {
    		return response()->json(['error' => 'No data']);
    	}
    }
}
