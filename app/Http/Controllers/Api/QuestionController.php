<?php

namespace App\Http\Controllers\Api;

use App\Question;
use App\Survey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Controller;
use Validator;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $questions = Question::all();

        return response()->json($questions);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $rules = array(
            'title' => 'required',
            'type' => 'required'
        );

        $validator = Validator::make(Input::all(), $rules);

        if($validator->fails()) {

        } else {

            $question = new Question;

            $question->q_title = $request->get('title');
            $question->q_type = $request->get('type');
            $question->q_order = $request->get('order');
            $question->q_writeinchoice = $request->get('wchoice');
            $question->survey_id = $request->get('id');
            $question->answer = json_encode($request->get('answers'));
            $question->save();

            return response()->json('Successfully Added!');
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        
        $questions = Question::where('survey_id', '=', $id)->get();
        $survey = Survey::where('survey_id', '=', $id)->first();

        return response()->json(['surveys' => $survey, 'questions' => $questions]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
