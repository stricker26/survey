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
            if(Respondents::where('survey_id',$survey->survey_id)->count() != 0) {
        		$survey->respondents_ago = Respondents::where('survey_id','=',$survey->survey_id)
    						->count();
        		$survey->respondents_today = Respondents::where('survey_id','=',$survey->survey_id)
    						->where('created_at','>=',$date_now)
    						->count();
        		$respondents_dates = new DateTime(Respondents::where('survey_id','=',$survey->survey_id)
    	    				->orderBy('created_at','asc')
    	    				->first()->created_at);
    	    	$survey->respondents_days_ago = $respondents_dates->diff(new DateTime($date_for_respon))->format('%a');
            } else {
                $survey->respondents_ago = 0;
                $survey->respondents_today = 0;
                $survey->respondents_days_ago = 0;
            }
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
        $checkboxTotal = 0;
        foreach($questions as $question) {
            $dataStore['question'] = strip_tags($question->q_title);
            $dataStore['questionType'] = $question->q_type;

            //check question type
            if($question->q_type == 'Multiple Choice' ||
                $question->q_type == 'Checkbox' ||
                $question->q_type == 'Dropdown') {
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
                        if($question->q_type == 'Checkbox') {
                            $checkboxTotal += $countAnswer;
                        } else {
                            array_push($countAnswerArr, number_format((float)($countAnswer/count($answerList))*100, 2, '.', ''));
                        }
                        array_push($countAnswerArr2, $countAnswer);
                        $countAnswer = 0;
                    }
                }
                if($question->q_type == 'Checkbox') {
                    foreach($countAnswerArr2 as $answerCheckbox) {
                        array_push($countAnswerArr, number_format((float)($answerCheckbox/$checkboxTotal)*100, 2, '.', ''));
                    }
                    $checkboxTotal = 0;
                }
                $dataStore['answerCount'] = $countAnswerArr;
                $dataStore['answerCount2'] = $countAnswerArr2;
                $countAnswerArr = [];
                $countAnswerArr2 = [];

                array_push($dataObj, $dataStore);
            } elseif($question->q_type == 'Star') {
                $dataStore['answer'] = ['1','2','3','4','5'];

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
                        array_push($countAnswerArr, number_format((float)($countAnswer/count($answerList))*100, 2, '.', ''));
                        array_push($countAnswerArr2, $countAnswer);
                        $countAnswer = 0;
                    }
                }
                $dataStore['answerCount'] = $countAnswerArr;
                $dataStore['answerCount2'] = $countAnswerArr2;
                $countAnswerArr = [];
                $countAnswerArr2 = [];

                array_push($dataObj, $dataStore);
            }
        }

        $rowTable = [];
        for($x = 0; $x < count($dataObj[$request->get('question_no')]['answer']); $x++) {
            array_push($rowTable, [
                'answer' => $dataObj[$request->get('question_no')]['answer'][$x],
                'answerPercentage' => $dataObj[$request->get('question_no')]['answerCount'][$x],
                'answerCount' => $dataObj[$request->get('question_no')]['answerCount2'][$x]
            ]);
        }
        return response()->json([
            'test' => $dataObj,
            'rowTable' => $rowTable,
            'responseCount' => count($answerList),
            'data' => $dataObj[$request->get('question_no')],
            'totalCount' => count($questions),
            'title' => $title
        ]);
    }

    public function dataTrendsView($id) {
        $returnData = Survey::where('survey_id','=',$id)->first()->title;
        return response()->json(['title' => $returnData]);
    }

    public function indResponsesGetAll($id) {
        $title = Survey::where('survey_id','=',$id)->first()->title;
        $respondents_count = Respondents::where('survey_id','=',$id)->count();

        //questions
        $questions = Question::where('survey_id','=',$id)->get();

        //respondent data
        $respondents = Respondents::where('survey_id','=',$id)->first();
        $createdAtTime = new DateTime($respondents->created_at);
        $respondents['timeSpend'] = $createdAtTime->diff(new DateTime($respondents->finished_at))->format('%H:%I:%S');

        //respondent answer
        

        return response()->json([
            'title' => $title,
            'respondents_count' => $respondents_count,
            'respondents' => $respondents
        ]);
    }

    public function indResponsesGetid($id, Request $request) {
        $respondents = Respondents::where('survey_id','=',$id)
                                ->skip($request->get('respondent_no') - 1)
                                ->first();
        $createdAtTime = new DateTime($respondents->created_at);
        $respondents['timeSpend'] = $createdAtTime->diff(new DateTime($respondents->finished_at))->format('%H:%I:%S');
        
        return response()->json(['respondents' => $respondents]);
    }
}
