<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Survey;
use App\User;
use DB;

class FieldResearchersController extends Controller
{
    public function getSurveyTitle($id) {

    	$surveyTitle = Survey::where('survey_id','=',$id)->first()->title;

    	return response()->json(['surveyTitle'=>$surveyTitle]);

    }

    public function getAllFR(Request $request) {

        $uid = User::where('token', '=', $request->get('token'))->first()->id;

        if(DB::table('researchers')->where('user_id','=',$uid)->count() != 0) {

	    	$lists = DB::table('researchers')
	    		->select('name', 'id', 'user_id')
	    		->where('user_id','=',$uid)
	    		->get();

	    	foreach($lists as $l) {

	    		$rd = DB::table('researchers_data')->where('researcher_id','=',$l->id)
	    										   ->orderBy('id', 'desc')
	    										   ->first();

	    		$l->longitude = ($rd ? $rd->longitude : null);
	    		$l->latitude = ($rd ? $rd->latitude : null);
	    		$l->heading = ($rd ? $rd->heading : null);
	    		$l->survey = ($rd ? DB::table('surveys')->where('survey_id','=',$rd->survey)->first()->title : null);
	    		$l->serial = ($rd ? $rd->serial : null);
	    		$l->model = ($rd ? $rd->model : null);

	    	}

	    } else $lists = null;


    	return response()->json(['lists' => ($lists ? $lists : array())]);

    }
}
