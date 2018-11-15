<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use DB;

class AnswerController extends Controller
{
    public function view($id) {

    	$query = DB::table('questions')
    		->where('id', '=', $id)
    		->get();

    	return response()->json(['answers' => $query]);

    }
}
