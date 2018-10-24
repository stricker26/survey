<?php

namespace App\Http\Controllers\Api;

use DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class FrontController extends Controller
{
    public function survey($id) {

    	$query = DB::table('surveys AS s')
    		->join('questions AS q', 's.survey_id', '=', 'q.survey_id')
    		->select('q.id', 'q.q_title', 'q.q_type', 'q.answer', 's.title')
    		->where('s.survey_id', '=', $id)
    		->orderBy('q.id', 'ASC')
    		->get();
		$respon_id = DB::table('respondents')->orderBy('id', 'desc')->first()->id;

    	return response()->json(['survey' => $query, 'title' => $query[0]->title, 'responid' => $respon_id]);

    }
}
