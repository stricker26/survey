<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;

class StartSurveyController extends Controller
{
    public function start($id) {

    	return view('survey');
    }
}
