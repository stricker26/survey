<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;
use App\Respondents;
use App\Answers;
use Validator;
use DB;

class RespondentsController extends Controller
{
    public function emailRespondent(Request $request) {
    	$rules = array(
            'respondentEmail' => 'required'
        );

        $validator = Validator::make(Input::all(), $rules);

        if($validator->fails()) {

            return response()->json(['warning' => 'Email is required!']);

        } else {

        	$respondents = new Respondents;
            $respondents->email = $request->get('respondentEmail');
        	$respondents->survey_id = $request->get('survey_id');
        	$respondents->save();

            return response()->json(['success' => 'Redirect']);
        }
    }

    public function answerRespondent(Request $request) {
    	$inputall = Input::all();
    	$respondent_id = $request->get('respondentId');

    	foreach($inputall as $key => $inputone) {
    		if(strpos($key, "Answer") !== false) {
    			if($inputone) {
    				$answer = new Answers;
    				$answer->q_id = $request->get(str_replace("Answer", "Id", $key));
    				$answer->answer = $inputone;
		    		$answer->respondent_id = $respondent_id;
		    		$answer->save();
    			}
    		}
    	}
    }
}
