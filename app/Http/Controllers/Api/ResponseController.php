<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Survey;
use App\Answers;
use App\Question;
use App\Respondents;
use DateTime;

class ResponseController extends Controller
{
    public function getAll() {
        date_default_timezone_set("Asia/Manila");
        $date_now = date("Y-m-d 00:00:00");
        $date_for_respon = date("Y-m-d");

    	$all_survey = Survey::select('id','title','status','survey_id')->get();
    	foreach($all_survey as $survey) {
    		if($survey->status == '1') {
    			$survey->status = 'Digital Survey';
    		}
    		$survey->respondents_ago = Respondents::where('survey_id','=',$survey->survey_id)
						->count();
    		$survey->respondents_today = Respondents::where('survey_id','=',$survey->survey_id)
						->where('created_at','>=',$date_now)
						->count();
    		$respondents_dates = new DateTime(Respondents::where('survey_id','=',$survey->survey_id)
	    				->orderBy('created_at','asc')
	    				->first()->created_at);
	    	$survey->respondents_days_ago = $respondents_dates->diff(new DateTime($date_for_respon))->format('%a');
    	}

    	return response()->json(['success' => $all_survey]);
    }

    public function responseView($id, Request $request) {
        $questions = Question::where('survey_id','=',$id)->get();
        $array_qid = [];
        foreach($questions as $question) {
            array_push($array_qid, $question->id);
        }
        $answers = Answers::whereIn('q_id',$array_qid)->get();
        $title = Survey::where('survey_id', '=', $questions[0]->survey_id)->first()->title;

        $dataStore = [];
        $answerArr = [];
        $countAnswerArr = [];
        $countAnswerArr2 = [];
        $dataObj = [];
        $dataTitle = [];
        $totalCount = 0;
        $countAnswer = 0;
        foreach($questions as $question) {
            $dataStore['question'] = strip_tags($question->q_title);

            //get all of the answer inside the array
            $jsondec = json_decode($question->answer);
            if($jsondec) {
                foreach($jsondec as $answer_answer) {
                    array_push($answerArr, $answer_answer->answer);
                }
            } else {
                $dataArr = null;
            }
            $dataStore['answer'] = $answerArr;
            $answerArr = [];

            //total count of the respondents answer
            foreach($answers as $countTotal){
                if($countTotal->q_id == $question->id) {
                    $totalCount++;
                }
            }
            $dataStore['total'] = $totalCount;
            $totalCount = 0;

            $answerList = Answers::where('q_id','=',$question->id)->get();
            if($dataStore['answer']) {
                foreach($dataStore['answer'] as $dataSingle) {
                    if(!empty($answerList)) {
                        foreach($answerList as $answerSingle) {
                            if(strpos($answerSingle['answer'], ',') === false) {
                                if($dataSingle === $answerSingle['answer']) {
                                    $countAnswer++;
                                }
                            } else {
                                if(strpos($answerSingle['answer'], $dataSingle) !== false) {
                                    $countAnswer++;
                                }
                            }
                        }
                    }
                    array_push($countAnswerArr, ($countAnswer/count($answerList))*100);
                    array_push($countAnswerArr2, $countAnswer);
                    $countAnswer = 0;
                }
            }
            $dataStore['answerCount'] = $countAnswerArr;
            $dataStore['answerCount2'] = $countAnswerArr2;
            $countAnswerArr = [];

            array_push($dataObj, $dataStore);
        }

        $rowTable = [
            $dataObj[$request->get('question_no')]['answer'],
            $dataObj[$request->get('question_no')]['answerCount'],
            $dataObj[$request->get('question_no')]['answerCount2']
        ];

        return response()->json([
            'rowTable' => $rowTable,
            'data' => $dataObj[$request->get('question_no')],
            'totalCount' => count($questions),
            'title' => $title
        ]);
    }
}
