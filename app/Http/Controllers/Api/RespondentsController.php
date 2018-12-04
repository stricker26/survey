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
        date_default_timezone_set("Asia/Manila");
        $date_now = date("Y-m-d H:i:s");
    	$rules = array(
            'name' => 'required',
            'age' => 'required',
            'gender' => 'required'
        );

        $validator = Validator::make(Input::all(), $rules);

        if($validator->fails()) {

            return response()->json(['warning' => 'Field Required!']);

        } else {

        	$respondents = new Respondents;
            $respondents->email = $request->get('name');
            $respondents->survey_id = $request->get('survey_id');
            $respondents->survey_source = 'Web Link 1 (Web Link)';
            $respondents->age = $request->get('age');
            $respondents->gender = $request->get('gender');
            $respondents->sec = $request->get('sec');
        	$respondents->ip = \Request::ip();
            $respondents->created_at = $date_now;
        	$respondents->save();

            return response()->json(['success' => 'Redirect', 'id' => $respondents->id]);
        }
    }

    public function answerRespondent($id, Request $request) {
    	$inputall = Input::all();
    	$respondent_id = $request->get('respondentId');
        date_default_timezone_set("Asia/Manila");
        $date_now = date("Y-m-d H:i:s");

        foreach($inputall as $key => $inputone) {
            if(strpos($key, "Answer") !== false) {
                if($inputone) {
                    $inputone_id = $request->get(str_replace("Answer", "Id", $key));
                    foreach($inputone as $key=>$input) {
                        $answer = new Answers;
                        $answer->q_id = $inputone_id[$key];
                        if(is_array($input)) {
                            $answer->answer = json_encode($input);
                        } else {
                            $answer->answer = $input;
                        }
                        $answer->respondent_id = $respondent_id;
                        $answer->created_at = $date_now;
                        $answer->save();
                    }
                }
            }
        }

        $respondents = Respondents::where('id','=',$respondent_id)
                                ->update(['finished_at' => $date_now]);

        return response()->json(['success' => 'success']);
    }
}
