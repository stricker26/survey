<?php

namespace App\Http\Controllers\Dashboard;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Questions;
use DB;

class SurveyController extends Controller
{

    public function index() {
        return view('dashboard.main');
    }

    public function add(Request $request) {

        // $query = DB::table('survey_questions')->insertGetId(
        //     [
        //         'q_title' => 'Test Title', 
        //         'q_type' => 'Test Type',
        //         'q_order' => 1, 
        //         'q_writeinchoice' => 1,
        //         'survey_id' => 123,
        //         'answer' => '{["answer 1", "answer2"]}'
        //     ]
        // );

        return response()->json('Successfully added');

    }

    public function defaultadd(Request $request) {

        $query = DB::table('survey_questions')->insertGetId(
            [
                'q_title' => 'Test Title', 
                'q_type' => 'Test Type',
                'q_order' => 1, 
                'q_writeinchoice' => 1,
                'survey_id' => 123,
                'answer' => '{["answer 1", "answer2"]}'
            ]
        );

        return 'Successfully Added!';

    }

}
