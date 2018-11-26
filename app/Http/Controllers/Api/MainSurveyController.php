<?php

namespace App\Http\Controllers\Api;

use DB;
use App\User;
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


    	return response()->json($lists);

    }
}
