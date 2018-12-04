<?php

namespace App\Http\Controllers\Api;

use DB;
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

            return response()->json(['warning' => 'Check required fields.']);

        } else {

            $question = new Question;

            $question->q_title = $request->get('title');
            $question->q_type = $request->get('type');
            $question->q_order = $request->get('order');
            $question->q_writeinchoice = $request->get('wchoice');
            $question->survey_id = $request->get('id');
            $question->answer = json_encode($request->get('answers'));
            $question->save();

            $q_count = Question::where('survey_id','=',$request->get('id'))
                                ->count();

            return response()->json(['success' => 'Successfully Added!', 'qNumber' => ($q_count + 1)]);
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
        $surveyStatus = $survey->status;

        return response()->json([
            'surveys' => $survey,
            'questions' => $questions,
            'surveyStatus' => $surveyStatus
        ]);
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
        $question = Question::find($id);
        $question->delete();

        return response()->json(['success' => 'Successfully deleted!']);
    }

    public function single($id) {

        return response()->json($id);

    }

    public function editSurveyQuestion(Request $request) {
        $edit_result = DB::table('surveys')->where('survey_id','=',$request->get('survey_id'))
                                        ->update([
                                            'title' => $request->get('new_name')
                                        ]);

        if($edit_result) {
            return response()->json(['success' => 'Edit success!']);
        } else {
            return response()->json(['error' => 'Error Saving']);
        }
    }

    public function questionNumber($id) {
        $q_count = Question::where('survey_id','=',$id)
                            ->count();

        return response()->json(['qNumber' => ($q_count + 1)]);
    }

    public function surveyStatus($id, $status) {
        $check = DB::table('surveys')->where('survey_id','=',$id)
                                    ->update([
                                        'status' => $status
                                    ]);

        if($check) {
            return response()->json(['success' => 'success!']);
        } else {
            return response()->json(['error' => 'error!']);
        }
    }
}
