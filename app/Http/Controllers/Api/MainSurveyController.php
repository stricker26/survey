<?php

namespace App\Http\Controllers\Api;

use DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MainSurveyController extends Controller
{
    public function lists() {

    	$lists = DB::table('surveys AS s')
    		->join('added AS d', 's.survey_id', '=', 'd.id')
    		->get();

    	return response()->json($lists);

    }
}
