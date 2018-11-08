<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Survey;
use App\Answers;
use App\Question;
use App\Respondents;
use App\Created;
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
                $respondents_dates = new DateTime(Created::where('id','=',$survey->survey_id)
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
            } else {
                foreach($answers as $countTotal){
                    if($countTotal->q_id == $question->id) {
                        //total count of the respondents answer
                        $totalCount++;

                        //get all of the answer inside the array
                        array_push($answerArr, [
                            'answer' => $countTotal->answer,
                            'created_at' => Respondents::where('id', $countTotal->respondent_id)->first()->created_at
                        ]);
                    }
                }
                $dataStore['answer'] = $answerArr;
                $dataStore['total'] = $totalCount;
                $dataStore['answerCount'] = count($answerArr);
                $dataStore['answerCount2'] = null;
                $answerArr = [];
                $totalCount = 0;

                array_push($dataObj, $dataStore);
            }
        }

        $rowTable = [];
        $coloR = [];
        if($dataObj[$request->get('question_no')]['questionType'] == 'Multiple Choice' ||
            $dataObj[$request->get('question_no')]['questionType'] == 'Checkbox' ||
            $dataObj[$request->get('question_no')]['questionType'] == 'Dropdown' ||
            $dataObj[$request->get('question_no')]['questionType'] == 'Star') {
            for($x = 0; $x < count($dataObj[$request->get('question_no')]['answer']); $x++) {
                array_push($rowTable, [
                    'answer' => $dataObj[$request->get('question_no')]['answer'][$x],
                    'answerPercentage' => $dataObj[$request->get('question_no')]['answerCount'][$x],
                    'answerCount' => $dataObj[$request->get('question_no')]['answerCount2'][$x]
                ]);
                array_push($coloR, $this->getColor(rand()));
            }

            $chartStackedData = [];
            foreach($rowTable as $key => $singleTable) {
                array_push($chartStackedData, 
                    [
                        'label' => $singleTable['answer'],
                        'data' => [$singleTable['answerPercentage']],
                        'backgroundColor' => $coloR[$key],
                        'borderWidth' => 1
                    ]
                );
            }
            $dataObj[$request->get('question_no')]['stackedData'] = $chartStackedData;
        } else {
            $rowTable = null;
            $dataObj[$request->get('question_no')]['stackedData'] = null;
        }
        return response()->json([
            'test' => $dataObj,
            'rowTable' => $rowTable,
            'responseCount' => count($answerList),
            'data' => $dataObj[$request->get('question_no')],
            'totalCount' => count($questions),
            'title' => $title,
            'color' => $coloR
        ]);
    }

    public function dataTrendsView($id) {
        $dateCreated = Created::where('id','=',$id)->first()->created_at;
        $first_date = new DateTime($dateCreated);
        $array_month = [$first_date->format("M Y")];

        for($x = 1; $x < 12; $x++) {
            $monthValue = date("M Y", strtotime('+' .$x. ' month', strtotime($dateCreated)));
            array_push($array_month, $monthValue);
        }

        $respondents_month = Respondents::where('survey_id','=',$id)->get();
        $array_data = [];
        $countData = 0;
        foreach($array_month as $month) {
            foreach($respondents_month as $respoMonth) {
                $respo_created = new DateTime($respoMonth['created_at']);
                if($respo_created->format("M Y") == $month) {
                    $countData++;
                }
            }
            array_push($array_data, $countData);
            $countData = 0;
        }

        //question no. 1
        $question = Question::where('survey_id',$id)
                            ->orderBy('id', 'asc')
                            ->first();

        $firstResponse = new DateTime(Respondents::where('survey_id','=',$id)
                            ->orderBy('created_at', 'asc')
                            ->first()->created_at);
        $returnData = Survey::where('survey_id','=',$id)->first()->title;
        return response()->json([
            'title' => $returnData,
            'labelsFirstCard' => $array_month,
            'dataFirstCard' => $array_data,
            'firstResponse' => $firstResponse->format("n/j/Y"),
            'question' => strip_tags($question->q_title)
        ]);
    }

    public function dataTrendsGetTrend($id, Request $request) {
        $dateCreated = Created::where('id','=',$id)->first()->created_at;
        $first_date = new DateTime($dateCreated);
        $array_month = [$first_date->format("M Y")];
        $array_day = [$first_date->format("n/j/Y")];
        $array_hour = [$first_date->format("g a n/j/Y")];
        $no_days = $first_date->format("t");

        if($request->get('trendOption') == 'Month') {
            for($x = 1; $x < 12; $x++) {
                $monthValue = date("M Y", strtotime('+' .$x. ' month', strtotime($dateCreated)));
                array_push($array_month, $monthValue);
            }

            $respondents_month = Respondents::where('survey_id','=',$id)->get();
            $array_data = [];
            $countData = 0;
            foreach($array_month as $month) {
                foreach($respondents_month as $respoMonth) {
                    $respo_created = new DateTime($respoMonth['created_at']);
                    if($respo_created->format("M Y") == $month) {
                        $countData++;
                    }
                }
                array_push($array_data, $countData);
                $countData = 0;
            }

            $firstResponse = new DateTime(Respondents::where('survey_id','=',$id)
                            ->orderBy('created_at', 'asc')
                            ->first()->created_at);
            return response()->json([
                'labelsFirstCard' => $array_month,
                'dataFirstCard' => $array_data,
                'firstResponse' => $firstResponse->format("n/j/Y")
            ]);
        } elseif($request->get('trendOption') == 'Day') {
            for($x = 1; $x < $no_days; $x++) {
                $dayValue = date("n/j/Y", strtotime('+' .$x. ' day', strtotime($dateCreated)));
                array_push($array_day, $dayValue);
            }

            $respondents_day = Respondents::where('survey_id','=',$id)->get();
            $array_data = [];
            $countData = 0;
            foreach($array_day as $day) {
                foreach($respondents_day as $respoDay) {
                    $respo_created = new DateTime($respoDay['created_at']);
                    if($respo_created->format("n/j/Y") == $day) {
                        $countData++;
                    }
                }
                array_push($array_data, $countData);
                $countData = 0;
            }

            $firstResponse = new DateTime(Respondents::where('survey_id','=',$id)
                            ->orderBy('created_at', 'asc')
                            ->first()->created_at);
            return response()->json([
                'labelsFirstCard' => $array_day,
                'dataFirstCard' => $array_data,
                'firstResponse' => $firstResponse->format("n/j/Y")
            ]);
        } else {
            for($x = 1; $x < 24; $x++) {
                $hourValue = date("g a n/j/Y", strtotime('+' .$x. ' hour', strtotime($dateCreated)));
                array_push($array_hour, $hourValue);
            }

            $respondents_hour = Respondents::where('survey_id','=',$id)->get();
            $array_data = [];
            $countData = 0;
            foreach($array_hour as $hour) {
                foreach($respondents_hour as $respoHour) {
                    $respo_created = new DateTime($respoHour['created_at']);
                    if($respo_created->format("g a n/j/Y") == date("g a n/j/Y", strtotime($hour))) {
                        $countData++;
                    }
                }
                array_push($array_data, $countData);
                $countData = 0;
            }

            $firstResponse = new DateTime(Respondents::where('survey_id','=',$id)
                            ->orderBy('created_at', 'asc')
                            ->first()->created_at);
            return response()->json([
                'labelsFirstCard' => $array_hour,
                'dataFirstCard' => $array_data,
                'firstResponse' => $firstResponse->format("n/j/Y")
            ]);
        }
    }

    public function indResponsesGetAll($id) {
        $title = Survey::where('survey_id','=',$id)->first()->title;
        $respondents_count = Respondents::where('survey_id','=',$id)->count();
        
        //respondent data
        $respondents = Respondents::where('survey_id','=',$id)->first();
        $createdAtTime = new DateTime($respondents->created_at);
        $respondents['timeSpend'] = $createdAtTime->diff(new DateTime($respondents->finished_at))->format('%H:%I:%S');

        //questions
        $questions = Question::where('survey_id','=',$id)->get();
        $questionsArr = [];
        foreach($questions as $question) {
            array_push($questionsArr, ['question' => strip_tags($question['q_title']), 'q_type' => $question['q_type'], 'id' => $question['id']]);
        }

        //respondent answer
        $answers = Answers::where('respondent_id','=',$respondents->id)->get();
        $answersArr = [];
        foreach($answers as $index => $answer) {
            foreach($questionsArr as $question) {
                if($question['id'] == $answer->q_id) {
                    $answersArr[$question['id']] = $answer->answer;
                }
            }
        }

        return response()->json([
            'title' => $title,
            'respondents_count' => $respondents_count,
            'respondents' => $respondents,
            'questions' => $questionsArr,
            'answers' => $answersArr
        ]);
    }

    public function indResponsesGetid($id, Request $request) {
        $respondents = Respondents::where('survey_id','=',$id)
                                ->skip($request->get('respondent_no') - 1)
                                ->first();
        $createdAtTime = new DateTime($respondents->created_at);
        $respondents['timeSpend'] = $createdAtTime->diff(new DateTime($respondents->finished_at))->format('%H:%I:%S');

        //questions
        $questions = Question::where('survey_id','=',$id)->get();
        $questionsArr = [];
        foreach($questions as $question) {
            array_push($questionsArr, ['question' => strip_tags($question['q_title']), 'q_type' => $question['q_type'], 'id' => $question['id']]);
        }

        //respondent answer
        $answers = Answers::where('respondent_id','=',$respondents->id)->get();
        $answersArr = [];
        foreach($answers as $index => $answer) {
            foreach($questionsArr as $question) {
                if($question['id'] == $answer->q_id) {
                    $answersArr[$question['id']] = $answer->answer;
                }
            }
        }
        
        return response()->json([
            'respondents' => $respondents,
            'answers' => $answersArr
        ]);
    }

    public function indResponsesDelete($id, Request $request) {
        $respondent_id = Respondents::where('survey_id','=',$id)
                                ->skip($request->get('respondent_no') - 1)
                                ->first()->id;
        $deleted_response = Respondents::where('id','=',$respondent_id)
                                ->delete();
        if($deleted_response) {
            $deleted_answer = Answers::where('respondent_id','=',$respondent_id)->delete();
            if($deleted_answer) {
                return response()->json(['success' => 'Respondent with ID: ' . $respondent_id . ' deleted']);
            } else {
                return response()->json(['failed' => 'Error deleting response']);
            }
        } else {
            return response()->json(['failed' => 'Error deleting response']);
        }
    }

    static function getColor($num) {
        $hash = md5('color' . $num); // modify 'color' to get a different palette
        return "rgb(".
            hexdec(substr($hash, 0, 2)) // r
            .",".
            hexdec(substr($hash, 2, 2)) // g
            .",".
            hexdec(substr($hash, 4, 2))
            .")"; //b
    }
}
