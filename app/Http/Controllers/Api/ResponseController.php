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
            $respondentCount = Respondents::where('survey_id',$survey->survey_id)
                                          ->where('finished_at','!=',null)
                                          ->count();
            if($respondentCount != 0) {
        		$survey->respondents_ago = Respondents::where('survey_id','=',$survey->survey_id)
                                                      ->where('finished_at','!=',null)
    						                          ->count();
        		$survey->respondents_today = Respondents::where('survey_id','=',$survey->survey_id)
    						                            ->where('created_at','>=',$date_now)
                                                        ->where('finished_at','!=',null)
    						                            ->count();
                $respondents_dates = (
                    new DateTime(
                        Created::where('id','=',$survey->survey_id)
                               ->first()
                               ->created_at
                    )
                )->format("Y-m-d");
    	    	$survey->respondents_days_ago = (new DateTime($respondents_dates))->diff(new DateTime($date_for_respon))->format('%a');
            } else {
                $survey->respondents_ago = 0;
                $survey->respondents_today = 0;
                $survey->respondents_days_ago = 0;
            }
    	}

    	return response()->json(['success' => $all_survey]);
    }

    public function responseView($id, Request $request) {
        //check if the survey has respondents
        $respondentCount = Respondents::where('survey_id',$id)
                                      ->where('finished_at','!=',null)
                                      ->count();
        if($respondentCount == 0) {
            return response()->json(['error' => 'No response']);
        }
        
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
                            'created_at' => Respondents::where('id', $countTotal->respondent_id)
                                                       ->where('finished_at','!=',null)
                                                       ->first()
                                                       ->created_at
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
        $array_hour = [$first_date->format("g a n/j/Y")];
        $array_hourStock = [$first_date->format("g a n/j/Y")];

        $last_date = new DateTime(Respondents::where('survey_id','=',$id)
                                             ->where('finished_at','!=',null)
                                             ->orderBy('created_at', 'desc')
                                             ->first()->created_at);
        $day_diff = $first_date->diff($last_date);
        $hour_diff = ($day_diff->days * 24) + $day_diff->h;
        if($hour_diff < 24) {
            $hour_diff = 24;
            $lengthCard1 = 1;
        } else {
            if($day_diff->h == 0) {
                $lengthCard1 = ($hour_diff / 24) + 1;
            } else {
                $lengthCard1 = (int)ceil($hour_diff / 24);
            }
        }

        for($x = 1; $x < $hour_diff; $x++) {
            $hourValue = date("g a n/j/Y", strtotime('+' .$x. ' hour', strtotime($dateCreated)));
            if($x < 24) {
                array_push($array_hour, $hourValue);
            }

            array_push($array_hourStock, $hourValue);
        }

        $array_data = [];
        $array_biggest = [];
        foreach($array_hourStock as $key => $hour) {
            $fromDate = date("Y-m-d H:00:00", strtotime($hour));
            $toDate = date("Y-m-d H:59:59", strtotime($hour));
            $countData = Respondents::whereBetween('finished_at', [$fromDate, $toDate])
                                    ->where('finished_at','!=',null)
                                    ->where('survey_id','=',$id)
                                    ->count();
            if($key < 24) {
                array_push($array_data, $countData);
            }

            array_push($array_biggest, $countData);
        }

        //question no. 1
        $firstResponse = new DateTime(
            Respondents::where('survey_id','=',$id)
                       ->where('finished_at','!=',null)
                       ->orderBy('created_at', 'asc')
                       ->first()->created_at
        );
        $returnData = Survey::where('survey_id','=',$id)->first()->title;
        $zoomData = ['24 Hours'];

        //2nd card
        $secondCard = [];
        $questions = Question::where('survey_id',$id)
                        ->orderBy('id', 'asc')
                        ->get();

        $array_questions = [];
        foreach($questions as $question) {
            array_push($array_questions, [
                'q_title' => strip_tags($question->q_title),
                'q_type' => $question->q_type,
                'q_id' => $question->id
            ]);
        }
        $secondCard['questionCount'] = count($array_questions);
        $secondCard['question'] = $array_questions;

        if($questions[0]->q_type == 'Multiple Choice' ||
            $questions[0]->q_type == 'Checkbox' ||
            $questions[0]->q_type == 'Dropdown'){
            $choices = [
                'choices' => json_decode($questions[0]->answer),
                'q_id' => $questions[0]->id,
                'q_type' => $questions[0]->q_type
            ];
        } elseif($questions[0]->q_type == 'Star') {
            $choices = [
                'choices' => [
                    (object)['answer' => 5],
                    (object)['answer' => 4],
                    (object)['answer' => 3],
                    (object)['answer' => 2],
                    (object)['answer' => 1]
                ],
                'q_id' => $questions[0]->id,
                'q_type' => $questions[0]->q_type
            ];
        } else {
            $choices = null;
        }
        $secondCard['choices'] = $choices;

        $secondCard['answerCount'] = Respondents::where('survey_id','=',$id)
                                                ->where('finished_at','!=',null)
                                                ->count();

        $secondCard['labelsSecondCard'] = $array_hour;
        
        //data for second card graph
        if(is_array($choices)) {
            $array_secondData = [];
            $array_answer = [];
            foreach($choices['choices'] as $choice) {
                if($choices['q_type'] == 'Checkbox') {
                    //pag checkbox sya
                    foreach($array_hour as $hour) {
                        $fromDate = date("Y-m-d H:00:00", strtotime($hour));
                        $toDate = date("Y-m-d H:59:59", strtotime($hour));
                        $countData = Answers::whereBetween('created_at', [$fromDate, $toDate])
                                        ->where('q_id','=',$choices['q_id'])
                                        ->where('answer','LIKE','%'.$choice->answer.'%')
                                        ->count();
                        array_push($array_answer, $countData);
                    }

                    array_push($array_secondData, [
                        'label' => $choice->answer,
                        'stack' => 'Stack 0',
                        'data' => $array_answer,
                        'backgroundColor' => $this->getColor(rand())
                    ]);
                    $array_answer = [];
                } else {
                    //and pag hindi
                    foreach($array_hour as $hour) {
                        $fromDate = date("Y-m-d H:00:00", strtotime($hour));
                        $toDate = date("Y-m-d H:59:59", strtotime($hour));
                        $countData = Answers::whereBetween('created_at', [$fromDate, $toDate])
                                        ->where('q_id','=',$choices['q_id'])
                                        ->where('answer','=',$choice->answer)
                                        ->count();
                        array_push($array_answer, $countData);
                    }

                    array_push($array_secondData, [
                        'label' => $choice->answer,
                        'stack' => 'Stack 0',
                        'data' => $array_answer,
                        'backgroundColor' => $this->getColor(rand())
                    ]);
                    $array_answer = [];
                }
            }

            $secondCard['dataSecondCard'] = $array_secondData;
        } else {
            // graph not applicable
        
        }

        return response()->json([
            'title' => $returnData,
            'labelsFirstCard' => $array_hour,
            'dataFirstCard' => $array_data,
            'zoomData' => $zoomData,
            'yMax1' => max($array_biggest),
            'firstResponse' => $firstResponse->format("n/j/Y"),
            'lengthCard1' => $lengthCard1,
            'secondCard' => $secondCard,
        ]);
    }

    public function dataTrendsGetTrend($id, Request $request) {
        $dateCreated = Created::where('id','=',$id)->first()->created_at;
        $first_date = new DateTime($dateCreated);
        
        $last_date = new DateTime(Respondents::where('survey_id','=',$id)
                                             ->where('finished_at','!=',null)
                                             ->orderBy('created_at', 'desc')
                                             ->first()->created_at);
        $date_diff = $first_date->diff($last_date);

        $firstResponse = new DateTime(Respondents::where('survey_id','=',$id)
                                                 ->where('finished_at','!=',null)
                                                 ->orderBy('created_at', 'asc')
                                                 ->first()->created_at);

        if($request->get('trendOption') == 'Month') {
            $array_month = [$first_date->format("M Y")];
            for($x = 1; $x < 12; $x++) {
                $monthValue = date("M Y", strtotime('+' .$x. ' month', strtotime($dateCreated)));
                array_push($array_month, $monthValue);
            }

            $respondents_month = Respondents::where('survey_id','=',$id)
                                            ->where('finished_at','!=',null)
                                            ->get();
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

            return response()->json([
                'labelsFirstCard' => $array_month,
                'dataFirstCard' => $array_data,
                'firstResponse' => $firstResponse->format("n/j/Y"),
            ]);
        } elseif($request->get('trendOption') == 'Day') {
            $array_day = [$first_date->format("n/j/Y")];
            $array_dayStock = [$first_date->format("n/j/Y")];
            $days_diff = $date_diff->days;
            if($days_diff <= 7) {
                $days_diff = 7;
                $lengthCard1 = 1;
            } else {
                $rem = fmod($days_diff,7);
                if($rem == 0) {
                    $lengthCard1 = ($days_diff / 7) + 1;
                } else {
                    $lengthCard1 = (int)ceil($days_diff / 7);
                }
                $days_diff = $lengthCard1 * 7;
            }

            for($x = 1; $x < $days_diff; $x++) {
                $dayValue = date("n/j/Y", strtotime('+' .$x. ' day', strtotime($dateCreated)));
                if($x < 7) {
                    array_push($array_day, $dayValue);
                }
                array_push($array_dayStock, $dayValue);
            }

            $respondents_day = Respondents::where('survey_id','=',$id)
                                          ->where('finished_at','!=',null)
                                          ->get();
            $array_data = [];
            $array_biggest = [];
            $countData = 0;
            foreach($array_dayStock as $key=>$day) {
                foreach($respondents_day as $respoDay) {
                    $respo_created = new DateTime($respoDay['created_at']);
                    if($respo_created->format("n/j/Y") == $day) {
                        $countData++;
                    }
                }

                if($key < 7) {
                    array_push($array_data, $countData);
                }

                array_push($array_biggest, $countData);
                $countData = 0;
            }

            $zoomData = ['7 Days'];

            return response()->json([
                'labelsFirstCard' => $array_day,
                'dataFirstCard' => $array_data,
                'zoomData' => $zoomData,
                'firstResponse' => $firstResponse->format("n/j/Y"),
                'yMax' => max($array_biggest),
                'lengthCard1' => $lengthCard1,
            ]);
        } else { //hours
            $array_hour = [$first_date->format("g a n/j/Y")];
            $array_hourStock = [$first_date->format("g a n/j/Y")];
            $hour_diff = ($date_diff->days * 24) + $date_diff->h;
            if($hour_diff < 24) {
                $hour_diff = 24;
                $lengthCard1 = 1;
            } else {
                if($date_diff->h == 0) {
                    $lengthCard1 = ($hour_diff / 24) + 1;
                } else {
                    $lengthCard1 = (int)ceil($hour_diff / 24);
                }
                $hour_diff = $lengthCard1 * 24;
            }

            for($x = 1; $x < $hour_diff; $x++) {
                $hourValue = date("g a n/j/Y", strtotime('+' .$x. ' hour', strtotime($dateCreated)));
                if($x < 24) {
                    array_push($array_hour, $hourValue);
                }
                array_push($array_hourStock, $hourValue);
            }

            $respondents_hour = Respondents::where('survey_id','=',$id)
                                           ->where('finished_at','!=',null)
                                           ->get();
            $array_data = [];
            $array_biggest = [];
            $countData = 0;
            foreach($array_hourStock as $key=>$hour) {
                foreach($respondents_hour as $respoHour) {
                    $respo_created = new DateTime($respoHour['created_at']);
                    if($respo_created->format("g a n/j/Y") == date("g a n/j/Y", strtotime($hour))) {
                        $countData++;
                    }
                }
                if($key < 24) {
                    array_push($array_data, $countData);
                }
                array_push($array_biggest, $countData);
                $countData = 0;
            }

            $zoomData = ['24 Hours'];

            return response()->json([
                'labelsFirstCard' => $array_hour,
                'dataFirstCard' => $array_data,
                'zoomData' => $zoomData,
                'firstResponse' => $firstResponse->format("n/j/Y"),
                'yMax' => max($array_biggest),
                'lengthCard1' => $lengthCard1,
            ]);
        }
    }

    public function dataTrendsGetTrend2($id, Request $request) {
        $dateCreated = Created::where('id','=',$id)->first()->created_at;
        $first_date = new DateTime($dateCreated);
        
        $last_date = new DateTime(Respondents::where('survey_id','=',$id)
                                             ->where('finished_at','!=',null)
                                             ->orderBy('created_at', 'desc')
                                             ->first()->created_at);
        $date_diff = $first_date->diff($last_date);

        $firstResponse = new DateTime(Respondents::where('survey_id','=',$id)
                                                 ->where('finished_at','!=',null)
                                                 ->orderBy('created_at', 'asc')
                                                 ->first()->created_at);

        if($request->get('trendOption') == 'Day') {
            $array_day = [$first_date->format("n/j/Y")];
            $days_diff = $date_diff->days;
            if($days_diff < 7) {
                $lengthCard = 1;
            } else {
                if(fmod($days_diff,7) == 0) {
                    $lengthCard = ($days_diff / 7) + 1;
                } else {
                    $lengthCard = (int)ceil($days_diff / 7);
                }
            }

            for($x = 1; $x < 7; $x++) {
                $dayValue = date("n/j/Y", strtotime('+' .$x. ' day', strtotime($dateCreated)));
                array_push($array_day, $dayValue);
            }
            $labelsSecondCard = $array_day;

            //for data
            $question = Question::where('survey_id',$id)
                                ->where('id',$request->get('q_id'))
                                ->first();

            if($question->q_type == 'Star') {
                $choices = [
                    'choices' => [
                        (object)['answer' => 5],
                        (object)['answer' => 4],
                        (object)['answer' => 3],
                        (object)['answer' => 2],
                        (object)['answer' => 1]
                    ],
                    'q_id' => $question->id,
                    'q_type' => $question->q_type
                ];
            } else {
                $choices = [
                    'choices' => json_decode($question->answer),
                    'q_id' => $question->id,
                    'q_type' => $question->q_type
                ];
            }

            $array_secondData = [];
            $array_answer = [];
            foreach($choices['choices'] as $choice) {
                foreach($array_day as $key=>$day) {
                    $fromDate = date("Y-m-d 00:00:00", strtotime($day));
                    $toDate = date("Y-m-d 23:59:59", strtotime($day));
                    if($choices['q_type'] == 'Checkbox') {
                        $countData = Answers::whereBetween('created_at', [$fromDate, $toDate])
                                        ->where('q_id','=',$choices['q_id'])
                                        ->where('answer','LIKE','%'.$choice->answer.'%')
                                        ->count();
                        array_push($array_answer, $countData);
                    } else {
                        $countData = Answers::whereBetween('created_at', [$fromDate, $toDate])
                                        ->where('q_id','=',$choices['q_id'])
                                        ->where('answer','=',$choice->answer)
                                        ->count();
                        array_push($array_answer, $countData);
                    }
                }

                array_push($array_secondData, [
                    'label' => $choice->answer,
                    'stack' => 'Stack 0',
                    'data' => $array_answer,
                    'backgroundColor' => $this->getColor(rand())
                ]);
                $array_answer = [];
            }
            $dataSecondCard = $array_secondData;

            //for zoom button data
            $zoomData = ['7 Days'];
        } elseif($request->get('trendOption') == 'Hour') {
            //for labels on chart
            $array_hour = [$first_date->format("g a n/j/Y")];
            $array_hourStock = [$first_date->format("g a n/j/Y")];
            $hour_diff = ($date_diff->days * 24) + $date_diff->h;
            if($hour_diff < 24) {
                $lengthCard = 1;
            } else {
                if($date_diff->h == 0) {
                    $lengthCard = ($hour_diff / 24) + 1;
                } else {
                    $lengthCard = (int)ceil($hour_diff / 24);
                }
            }

            for($x = 1; $x < 24; $x++) {
                $hourValue = date("g a n/j/Y", strtotime('+' .$x. ' hour', strtotime($dateCreated)));
                array_push($array_hour, $hourValue);
            }
            $labelsSecondCard = $array_hour;

            //for data
            $question = Question::where('survey_id',$id)
                                ->where('id',$request->get('q_id'))
                                ->first();

            if($question->q_type == 'Star') {
                $choices = [
                    'choices' => [
                        (object)['answer' => 5],
                        (object)['answer' => 4],
                        (object)['answer' => 3],
                        (object)['answer' => 2],
                        (object)['answer' => 1]
                    ],
                    'q_id' => $question->id,
                    'q_type' => $question->q_type
                ];
            } else {
                $choices = [
                    'choices' => json_decode($question->answer),
                    'q_id' => $question->id,
                    'q_type' => $question->q_type
                ];
            }

            $array_secondData = [];
            $array_answer = [];
            foreach($choices['choices'] as $choice) {
                foreach($array_hour as $hour) {
                    $fromDate = date("Y-m-d H:00:00", strtotime($hour));
                    $toDate = date("Y-m-d H:59:59", strtotime($hour));
                    if($choices['q_type'] == 'Checkbox') {
                        $countData = Answers::whereBetween('created_at', [$fromDate, $toDate])
                                        ->where('q_id','=',$choices['q_id'])
                                        ->where('answer','LIKE','%'.$choice->answer.'%')
                                        ->count();
                        array_push($array_answer, $countData);
                    } else {
                        $countData = Answers::whereBetween('created_at', [$fromDate, $toDate])
                                        ->where('q_id','=',$choices['q_id'])
                                        ->where('answer','=',$choice->answer)
                                        ->count();
                        array_push($array_answer, $countData);
                    }
                }

                array_push($array_secondData, [
                    'label' => $choice->answer,
                    'stack' => 'Stack 0',
                    'data' => $array_answer,
                    'backgroundColor' => $this->getColor(rand())
                ]);
                $array_answer = [];
            }
            $dataSecondCard = $array_secondData;

            //for zoom button data
            $zoomData = ['24 Hours'];
        }

        return response()->json([
            'labelsSecondCard' => $labelsSecondCard,
            'dataSecondCard' => $dataSecondCard,
            'zoomData' => $zoomData,
            'lengthCard1' => $lengthCard,
        ]);
    }

    public function dataTrendsNextGraph($id, Request $request) {
        $dateCreated = Created::where('id','=',$id)->first()->created_at;
        $respondents_data = Respondents::where('survey_id','=',$id)
                                       ->where('finished_at','!=',null)
                                       ->get();

        if($request->get('type') == 'firstGraph') {
            //first graph
            if($request->get('trend') == "Hour") {
                $countNo = ($request->get('count') - 1) * 24;
                $array_hour = [date("g a n/j/Y", strtotime('+'.$countNo.' hour', strtotime($dateCreated)))];

                for($x = ($countNo + 1); $x < ($countNo + 24); $x++) {
                    $hourValue = date("g a n/j/Y", strtotime('+' .$x. ' hour', strtotime($dateCreated)));
                    array_push($array_hour, $hourValue);
                }

                $array_data = [];
                $countData = 0;
                foreach($array_hour as $key => $hour) {
                    foreach($respondents_data as $respoHour) {
                        $respo_created = new DateTime($respoHour['created_at']);
                        if($respo_created->format("g a n/j/Y") == date("g a n/j/Y", strtotime($hour))) {
                            $countData++;
                        }
                    }

                    array_push($array_data, $countData);
                    $countData = 0;
                }

                $array_label = $array_hour;
            } elseif($request->get('trend') == "Day") {
                $countNo = ($request->get('count') - 1) * 7;
                $array_day = [date("n/j/Y", strtotime('+'.$countNo.' day', strtotime($dateCreated)))];

                for($x = ($countNo + 1); $x < ($countNo + 7); $x++) {
                    $dayValue = date("n/j/Y", strtotime('+' .$x. ' day', strtotime($dateCreated)));
                    array_push($array_day, $dayValue);
                }

                $array_data = [];
                $countData = 0;
                foreach($array_day as $key => $day) {
                    foreach($respondents_data as $respoDay) {
                        $respo_created = new DateTime($respoDay['created_at']);
                        if($respo_created->format("n/j/Y") == date("n/j/Y", strtotime($day))) {
                            $countData++;
                        }
                    }

                    array_push($array_data, $countData);
                    $countData = 0;
                }

                $array_label = $array_day;
            }

            return response()->json([
                'labelsFirstCard' => $array_label,
                'dataFirstCard' => $array_data
            ]);
        } elseif($request->get('type') == 'secondQuestion') {
            //second question
            //2nd card
            if($request->get('trend') == 'Hour') {
                $first_date = new DateTime($dateCreated);
                $last_date = new DateTime(
                    Respondents::where('survey_id','=',$id)
                               ->where('finished_at','!=',null)
                               ->orderBy('created_at', 'desc')
                               ->first()->created_at
                );
                $day_diff = $first_date->diff($last_date);
                $hour_diff = ($day_diff->days * 24) + $day_diff->h;
                if($hour_diff < 24) {
                    $lengthCard2 = 1;
                } else {
                    if($day_diff->h == 0) {
                        $lengthCard2 = ($hour_diff / 24) + 1;
                    } else {
                        $lengthCard2 = (int)ceil($hour_diff / 24);
                    }
                }

                $secondCard = [];
                $question = Question::where('survey_id','=',$id)
                                ->skip($request->get('count') - 1)
                                ->first();

                $array_questions = [
                    'q_title' => strip_tags($question->q_title),
                    'q_type' => $question->q_type,
                    'q_id' => $question->id
                ];

                $secondCard['question'] = $array_questions;

                if($question->q_type == 'Multiple Choice' ||
                    $question->q_type == 'Checkbox' ||
                    $question->q_type == 'Dropdown'){
                    $choices = [
                        'choices' => json_decode($question->answer),
                        'q_id' => $question->id,
                        'q_type' => $question->q_type
                    ];
                } elseif($question->q_type == 'Star') {
                    $choices = [
                        'choices' => [
                            (object)['answer' => 5],
                            (object)['answer' => 4],
                            (object)['answer' => 3],
                            (object)['answer' => 2],
                            (object)['answer' => 1]
                        ],
                        'q_id' => $question->id,
                        'q_type' => $question->q_type
                    ];
                } else {
                    $choices = null;
                }

                $first_date = new DateTime($dateCreated);
                $array_hour = [$first_date->format("g a n/j/Y")];
                for($x = 1; $x < 24; $x++) {
                    $hourValue = date("g a n/j/Y", strtotime('+' .$x. ' hour', strtotime($dateCreated)));
                    array_push($array_hour, $hourValue);
                }
                $secondCard['labelsSecondCard'] = $array_hour;
                
                //data for second card graph
                if(is_array($choices)) {
                    $array_secondData = [];
                    $array_answer = [];
                    foreach($choices['choices'] as $choice) {
                        if($choices['q_type'] == 'Checkbox') {
                            //pag checkbox sya
                            foreach($array_hour as $hour) {
                                $fromDate = date("Y-m-d H:00:00", strtotime($hour));
                                $toDate = date("Y-m-d H:59:59", strtotime($hour));
                                $countData = Answers::whereBetween('created_at', [$fromDate, $toDate])
                                                ->where('q_id','=',$choices['q_id'])
                                                ->where('answer','LIKE','%'.$choice->answer.'%')
                                                ->count();
                                array_push($array_answer, $countData);
                            }

                            array_push($array_secondData, [
                                'label' => $choice->answer,
                                'stack' => 'Stack 0',
                                'data' => $array_answer,
                                'backgroundColor' => $this->getColor(rand())
                            ]);
                            $array_answer = [];
                        } else {
                            //and pag hindi
                            foreach($array_hour as $hour) {
                                $fromDate = date("Y-m-d H:00:00", strtotime($hour));
                                $toDate = date("Y-m-d H:59:59", strtotime($hour));
                                $countData = Answers::whereBetween('created_at', [$fromDate, $toDate])
                                                ->where('q_id','=',$choices['q_id'])
                                                ->where('answer','=',$choice->answer)
                                                ->count();
                                array_push($array_answer, $countData);
                            }

                            array_push($array_secondData, [
                                'label' => $choice->answer,
                                'stack' => 'Stack 0',
                                'data' => $array_answer,
                                'backgroundColor' => $this->getColor(rand())
                            ]);
                            $array_answer = [];
                        }
                    }

                    $secondCard['dataSecondCard'] = $array_secondData;

                    $isArray = true;
                } else {
                    // graph not applicable
                    $isArray = false;
                    $secondCard = [];
                    $question = Question::where('survey_id','=',$id)
                                    ->skip($request->get('count') - 1)
                                    ->first();

                    $array_questions = [
                        'q_title' => strip_tags($question->q_title),
                        'q_type' => $question->q_type
                    ];

                    $secondCard['question'] = $array_questions;
                }
            } else {//days
                $first_date = new DateTime($dateCreated);
                $array_day = [$first_date->format("n/j/Y")];
                $last_date = new DateTime(
                    Respondents::where('survey_id','=',$id)
                               ->where('finished_at','!=',null)
                               ->orderBy('created_at', 'desc')
                               ->first()->created_at
                );
                $date_diff = $first_date->diff($last_date);
                $days_diff = $date_diff->days;
                if($days_diff < 7) {
                    $lengthCard2 = 1;
                } else {
                    if(fmod($days_diff,7) == 0) {
                        $lengthCard2 = ($days_diff / 7) + 1;
                    } else {
                        $lengthCard2 = (int)ceil($days_diff / 7);
                    }
                }

                $secondCard = [];
                $question = Question::where('survey_id','=',$id)
                                ->skip($request->get('count') - 1)
                                ->first();

                $array_questions = [
                    'q_title' => strip_tags($question->q_title),
                    'q_type' => $question->q_type,
                    'q_id' => $question->id
                ];

                $secondCard['question'] = $array_questions;

                if($question->q_type == 'Multiple Choice' ||
                    $question->q_type == 'Checkbox' ||
                    $question->q_type == 'Dropdown'){
                    $choices = [
                        'choices' => json_decode($question->answer),
                        'q_id' => $question->id,
                        'q_type' => $question->q_type
                    ];
                } elseif($question->q_type == 'Star') {
                    $choices = [
                        'choices' => [
                            (object)['answer' => 5],
                            (object)['answer' => 4],
                            (object)['answer' => 3],
                            (object)['answer' => 2],
                            (object)['answer' => 1]
                        ],
                        'q_id' => $question->id,
                        'q_type' => $question->q_type
                    ];
                } else {
                    $choices = null;
                }

                for($x = 1; $x < 7; $x++) {
                    $dayValue = date("n/j/Y", strtotime('+' .$x. ' day', strtotime($dateCreated)));
                    array_push($array_day, $dayValue);
                }
                $secondCard['labelsSecondCard'] = $array_day;
                
                //data for second card graph
                if(is_array($choices)) {
                    $array_secondData = [];
                    $array_answer = [];
                    foreach($choices['choices'] as $choice) {
                        foreach($array_day as $key=>$day) {
                            $fromDate = date("Y-m-d 00:00:00", strtotime($day));
                            $toDate = date("Y-m-d 23:59:59", strtotime($day));
                            if($choices['q_type'] == 'Checkbox') {
                                $countData = Answers::whereBetween('created_at', [$fromDate, $toDate])
                                                ->where('q_id','=',$choices['q_id'])
                                                ->where('answer','LIKE','%'.$choice->answer.'%')
                                                ->count();
                                array_push($array_answer, $countData);
                            } else {
                                $countData = Answers::whereBetween('created_at', [$fromDate, $toDate])
                                                ->where('q_id','=',$choices['q_id'])
                                                ->where('answer','=',$choice->answer)
                                                ->count();
                                array_push($array_answer, $countData);
                            }
                        }

                        array_push($array_secondData, [
                            'label' => $choice->answer,
                            'stack' => 'Stack 0',
                            'data' => $array_answer,
                            'backgroundColor' => $this->getColor(rand())
                        ]);
                        $array_answer = [];
                    }

                    $secondCard['dataSecondCard'] = $array_secondData;

                    $isArray = true;
                } else {
                    // graph not applicable
                    $isArray = false;
                    $secondCard = [];
                    $question = Question::where('survey_id','=',$id)
                                    ->skip($request->get('count') - 1)
                                    ->first();

                    $array_questions = [
                        'q_title' => strip_tags($question->q_title),
                        'q_type' => $question->q_type
                    ];

                    $secondCard['question'] = $array_questions;
                }
            }

            return response()->json([
                'isArray' => $isArray,
                'secondCard' => $secondCard,
                'lengthCard2' => $lengthCard2
            ]);
        } else {
            //second graph
            if($request->get('trend') == "Hour") {
                $countNo = ($request->get('count') - 1) * 24;
                $array_hour = [date("g a n/j/Y", strtotime('+'.$countNo.' hour', strtotime($dateCreated)))];

                for($x = ($countNo + 1); $x < ($countNo + 24); $x++) {
                    $hourValue = date("g a n/j/Y", strtotime('+' .$x. ' hour', strtotime($dateCreated)));
                    array_push($array_hour, $hourValue);
                }

                $question = Question::where('survey_id',$id)
                                    ->where('id',$request->get('q_id'))
                                    ->first();
                $array_data = [];
                $array_secondGraph = [];
                
                if($request->get('q_type') != 'Star') {
                    $choices = [
                        'choices' => json_decode($question->answer),
                        'q_id' => $question->id,
                        'q_type' => $question->q_type
                    ];
                } else {
                    $choices = [
                        'choices' => [
                            (object)['answer' => 5],
                            (object)['answer' => 4],
                            (object)['answer' => 3],
                            (object)['answer' => 2],
                            (object)['answer' => 1]
                        ],
                        'q_id' => $question->id,
                        'q_type' => $question->q_type
                    ];
                }
                foreach($choices['choices'] as $choice) {
                    foreach($array_hour as $key => $hour) {
                        $fromDate = date("Y-m-d H:00:00", strtotime($hour));
                        $toDate = date("Y-m-d H:59:59", strtotime($hour));
                        if($request->get('q_type') == 'Checkbox') {
                            $countData = Answers::whereBetween('created_at', [$fromDate, $toDate])
                                                ->where('q_id','=',$choices['q_id'])
                                                ->where('answer','LIKE','%'.$choice->answer.'%')
                                                ->count();
                        } else {
                            $countData = Answers::whereBetween('created_at', [$fromDate, $toDate])
                                                ->where('q_id','=',$choices['q_id'])
                                                ->where('answer','=',$choice->answer)
                                                ->count();
                        }
                        array_push($array_data, $countData);     
                    }

                    array_push($array_secondGraph, [
                        'label' => $choice->answer,
                        'stack' => 'Stack 0',
                        'data' => $array_data,
                        'backgroundColor' => $this->getColor(rand())
                    ]);
                    $array_data = [];
                }

                $array_label = $array_hour;
            } elseif($request->get('trend') == "Day") {
                $countNo = ($request->get('count') - 1) * 7;
                $array_day = [date("n/j/Y", strtotime('+'.$countNo.' day', strtotime($dateCreated)))];

                for($x = ($countNo + 1); $x < ($countNo + 7); $x++) {
                    $dayValue = date("n/j/Y", strtotime('+' .$x. ' day', strtotime($dateCreated)));
                    array_push($array_day, $dayValue);
                }

                $question = Question::where('survey_id',$id)
                                    ->where('id',$request->get('q_id'))
                                    ->first();
                $array_data = [];
                $array_secondGraph = [];
                
                if($request->get('q_type') != 'Star') {
                    $choices = [
                        'choices' => json_decode($question->answer),
                        'q_id' => $question->id,
                        'q_type' => $question->q_type
                    ];
                } else {
                    $choices = [
                        'choices' => [
                            (object)['answer' => 5],
                            (object)['answer' => 4],
                            (object)['answer' => 3],
                            (object)['answer' => 2],
                            (object)['answer' => 1]
                        ],
                        'q_id' => $question->id,
                        'q_type' => $question->q_type
                    ];
                }
                foreach($choices['choices'] as $choice) {
                    foreach($array_day as $key => $day) {
                        $fromDate = date("Y-m-d H:00:00", strtotime($day));
                        $toDate = date("Y-m-d H:59:59", strtotime($day));
                        if($request->get('q_type') == 'Checkbox') {
                            $countData = Answers::whereBetween('created_at', [$fromDate, $toDate])
                                                ->where('q_id','=',$choices['q_id'])
                                                ->where('answer','LIKE','%'.$choice->answer.'%')
                                                ->count();
                        } else {
                            $countData = Answers::whereBetween('created_at', [$fromDate, $toDate])
                                                ->where('q_id','=',$choices['q_id'])
                                                ->where('answer','=',$choice->answer)
                                                ->count();
                        }
                        array_push($array_data, $countData);     
                    }

                    array_push($array_secondGraph, [
                        'label' => $choice->answer,
                        'stack' => 'Stack 0',
                        'data' => $array_data,
                        'backgroundColor' => $this->getColor(rand())
                    ]);
                    $array_data = [];
                }

                $array_label = $array_day;
            }

            return response()->json([
                'labelsSecondCard' => $array_label,
                'dataSecondCard' => $array_secondGraph
            ]);
        }
    }

    public function indResponsesGetAll($id) {
        $title = Survey::where('survey_id','=',$id)->first()->title;
        $respondents_count = Respondents::where('survey_id','=',$id)
                                        ->where('finished_at','!=',null)
                                        ->count();
        
        //respondent data
        $respondents = Respondents::where('survey_id','=',$id)
                                  ->where('finished_at','!=',null)
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
            'title' => $title,
            'respondents_count' => $respondents_count,
            'respondents' => $respondents,
            'questions' => $questionsArr,
            'answers' => $answersArr
        ]);
    }

    public function indResponsesGetid($id, Request $request) {
        $respondents = Respondents::where('survey_id','=',$id)
                                  ->where('finished_at','!=',null)
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
                                    ->where('finished_at','!=',null)
                                    ->skip($request->get('respondent_no') - 1)
                                    ->first()->id;
        $deleted_response = Respondents::where('id','=',$respondent_id)
                                       ->where('finished_at','!=',null)
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
