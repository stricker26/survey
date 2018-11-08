<?php

namespace App\Http\Controllers\Api;

use DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Respondents;

class FrontController extends Controller
{
    public function survey($id) {
    	$query = DB::table('surveys AS s')
    		->join('questions AS q', 's.survey_id', '=', 'q.survey_id')
    		->select('q.id', 'q.q_title', 'q.q_type', 'q.answer', 's.title')
    		->where('s.survey_id', '=', $id)
    		->orderBy('q.id', 'ASC')
    		->get();
    	return response()->json(['survey' => $query, 'title' => $query[0]->title]);
    }

    public function surveyWelcome($id) {
        $query = DB::table('surveys AS s')
            ->join('questions AS q', 's.survey_id', '=', 'q.survey_id')
            ->select('q.id', 'q.q_title', 'q.q_type', 'q.answer', 's.title')
            ->where('s.survey_id', '=', $id)
            ->orderBy('q.id', 'ASC')
            ->get();
        return response()->json(['survey' => $query, 'title' => $query[0]->title]);
    }
}
