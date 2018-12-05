<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Survey;
use App\Answers;
use App\Question;
use App\Respondents;
use App\Created;
use App\User;
use DB;
use DateTime;

class ResponseController extends Controller
{
    public function getAll(Request $request) {
        $token = $request->get('token');
        $user_id = User::where('token', '=', $token)->first()->id;

        date_default_timezone_set("Asia/Manila");
        $date_now = date("Y-m-d 00:00:00");
        $date_for_respon = date("Y-m-d");

    	$all_survey = Survey::select('id','title','status','survey_id')->where('user_id','=',$user_id)->get();
        if(count($all_survey) != 0) {
        	foreach($all_survey as $survey) {
        		if($survey->status == '1') {
        			$survey->status = 'Active Survey';
        		} else {
                    $survey->status = 'Drafted Survey';
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
                } else {
                    $survey->respondents_ago = 0;
                    $survey->respondents_today = 0;
                }

                $respondents_dates = (
                    new DateTime(
                        Created::where('id','=',$survey->survey_id)
                               ->first()
                               ->created_at
                    )
                )->format("Y-m-d");
                $survey->respondents_days_ago = (new DateTime($respondents_dates))->diff(new DateTime($date_for_respon))->format('%a');
        	}
        }

    	return response()->json(['success' => $all_survey]);
    }

    public function questionSummaryView($id, Request $request) {
        $survey_id = $id;


        //top part of the page
        $done_respondents = Respondents::where('survey_id', '=', $survey_id)
                                    ->where('finished_at', '!=', null)
                                    ->count();

        $overall_respondents = Respondents::where('survey_id', '=', $survey_id)
                                    ->count();

        $survey_title = Survey::where('survey_id', '=', $survey_id)->first()->title;
        //end


        //get survey data e.g: questions
        $survey_data = Question::where('survey_id', '=', $survey_id)->get();
        $arr_store = array();
        $obj_store = (object)[];
        foreach($survey_data as $d) {

            $obj_store->title = strip_tags($d->q_title);
            $obj_store->type = $d->q_type;
            $obj_store->id = $d->id;


            $answers = Answers::where('q_id','=',$d->id)->get();
            $answer_length = count($answers);
            $obj_store->answerLength = $answer_length;

            if($answer_length != 0) {

                //get the labels for chart
                if($d->q_type == 'Star') {

                    $starArray = array();
                    $colorArray = array(); //color array storage
                    for($x = 1; $x <= 5; $x++) {

                        array_push($starArray, $x);
                        array_push($colorArray, $this->getColor(rand())); //get color

                    }
                    $obj_store->labelChart = $starArray;
                    $obj_store->color = $colorArray; //store all of the colors

                } elseif($d->q_type == 'Slider') {

                    $sliderArray = array();
                    for($x = 1; $x <= 100; $x++) array_push($sliderArray, $x);
                    $obj_store->labelChart = $sliderArray;

                } elseif($d->q_type == 'Multiple Choice' || $d->q_type == 'Checkbox' || $d->q_type == 'Dropdown') {

                    $jsonChoices = json_decode($d->answer);
                    $storArray = array();
                    $colorArray = array(); //color array storage
                    foreach($jsonChoices as $key=>$c) {

                        array_push($storArray, $c->answer);
                        array_push($colorArray, $this->getColor(rand())); //get color
                    }
                    $obj_store->labelChart = $storArray;
                    $obj_store->color = $colorArray; //store all of the colors

                } else {

                    $obj_store->labelChart = [];
                    $jsonLabels = json_decode($d->answer);
                    $elseArray = array();
                    foreach($jsonLabels as $jsl) array_push($elseArray, $jsl->answer);
                    $obj_store->jsonLabels = $elseArray;

                    if($d->q_type == 'Contact') {

                        $contact_values = array(
                            'Name',
                            'Company',
                            'Address',
                            'Address 2',
                            'City / Town',
                            'State / Province',
                            'ZIP / PostalCode',
                            'Country',
                            'Email',
                            'Phone',
                        );
                        $objStore = array();
                        foreach($obj_store->jsonLabels as $key=>$dtarr) if($dtarr) array_push($objStore, $contact_values[$key]);
                        $obj_store->jsonLabels = $objStore;

                    }

                }


                //get the answers and data for chart
                if($answer_length != 0) {//got data

                    if(count($obj_store->labelChart) == 0) {//walnag choices

                        if($d->q_type == 'Textboxes' || $d->q_type == 'Contact') {

                            //get total answers
                            $data_array = array_fill(0, count($obj_store->jsonLabels), 0);
                            foreach($answers as $a) {

                                $jsonAnswer = json_decode($a->answer);
                                foreach($jsonAnswer as $key=>$ja) if($ja) $data_array[$key]++;

                            }
                            //$obj_store->answer = $data_array;


                            //get percentage
                            $percentage_array = array();
                            foreach($data_array as $dtArr) {

                                $percentage = number_format((float)($dtArr/$answer_length)*100, 2, '.', '');
                                array_push($percentage_array, $percentage);

                            }
                            //$obj_store->percentage = $data_percentage;


                            //setup data tables
                            $dt_arr = array();
                            foreach($obj_store->jsonLabels as $jsonL) {

                                $dt_obj = (object)[ //data on table
                                    "choice" => $jsonL,
                                    "answerTotal" => $data_array[$key],
                                    "answerPercentage" => $percentage_array[$key],
                                ];
                                array_push($dt_arr, $dt_obj);

                            }
                            $obj_store->dataTable = $dt_arr;
                            $data_array = array();

                        } else {

                            $dc_arr = array();
                            $dc_obj = (object)[];
                            foreach($answers as $a) {

                                $dc_obj->answer = $a->answer;
                                $dc_obj->created_at = $a->created_at;
                                array_push($dc_arr, $dc_obj);
                                $dc_obj = (object)[];

                            }
                            $obj_store->answer = $dc_arr;

                        }

                    } else {//may choices

                        $data_chart = array_fill(0, count($obj_store->labelChart), 0);
                        foreach($answers as $a) {

                            if($d->q_type == 'Checkbox') {

                                $cb_explode = explode(",", $a->answer);
                                foreach($cb_explode as $oneByone) {

                                    $idx = array_search($oneByone, $obj_store->labelChart);
                                    if($idx >= 0) $data_chart[$idx]++;

                                }

                            } else {

                                $idx = array_search($a->answer, $obj_store->labelChart);
                                $data_chart[$idx]++;

                            }
                        }
                        //$obj_store->answer = $data_chart;


                        //get data on table and stacked data on charts and get percentage
                        if($d->q_type != 'Slider') {// if qtype is not slider

                            $data_percentage = array();
                            foreach($data_chart as $dc) {

                                $percentage = number_format((float)($dc/array_sum($data_chart))*100, 2, '.', '');
                                array_push($data_percentage, $percentage);

                            }
                            $obj_store->percentage = $data_percentage;


                            $dt_arr = array();
                            $sd_arr = array();
                            foreach($obj_store->labelChart as $key=>$lc) {

                                $dt_obj = (object)[ //data on table
                                    "choice" => $lc,
                                    "answerTotal" => $data_chart[$key],
                                    "answerPercentage" => $data_percentage[$key],
                                ];
                                array_push($dt_arr, $dt_obj);

                                $sd_obj = (object)[//stacked data on charts
                                    "backgroundColor" => $obj_store->color[$key],
                                    "borderWidth" => 1,
                                    "data" => [$data_percentage[$key]],
                                    "label" => $lc,
                                ];
                                array_push($sd_arr, $sd_obj);

                            }
                            $obj_store->dataTable = $dt_arr;
                            $obj_store->stackedData = $sd_arr;
                        } elseif($d->q_type == 'Slider') {// qtype is slider

                            $sliderTotal = 0;
                            foreach($data_chart as $key=>$dc) {
                                if($dc != 0) {
                                    $sliderTotal += $obj_store->labelChart[$key] * $dc;
                                }
                            }
                            $sliderAverage = $sliderTotal / $answer_length;
                            $obj_store->data = [$sliderAverage];
                            $obj_store->total = $sliderTotal;
                            $obj_store->average = $sliderAverage;

                        }

                    }

                } else {
                    //no data


                }


                //number of respondents who answered ans skipped
                $obj_store->skipped_respondents = $done_respondents - $answer_length;
                $obj_store->answered_respondents = $answer_length;

            } else {

                //number of respondents who answered ans skipped
                $obj_store->skipped_respondents = $done_respondents;
                $obj_store->answered_respondents = $answer_length;

            }


            array_push($arr_store, $obj_store);
            $obj_store = (object)[];

        }

        return response()->json([
            'data' => $arr_store,
            'doneRespondents' => $done_respondents,
            'overallRespondents' => $overall_respondents,
            'surveyTitle' => $survey_title,
        ]);
    }

    public function dataTrendsView($id) {
        //first date
        $dateCreated = Created::where('id','=',$id)->first()->created_at;
        $firstDate = date("Y-m-d H:00:00", strtotime($dateCreated));
        $first_date = new DateTime($firstDate);
        //last date
        $dateRespondents = Respondents::where('survey_id','=',$id)
                             ->where('finished_at','!=',null)
                             ->orderBy('created_at', 'desc')
                             ->first()->created_at;
        $seconds = (int)(new DateTime($dateRespondents))->format("s");
        $minutes = (int)(new DateTime($dateRespondents))->format("i");
        if($seconds == 0 && $minutes == 0) {
            $lastDate = date("Y-m-d H:00:00", strtotime($dateRespondents));
        } else {
            $lastDate = date("Y-m-d H:00:00", strtotime("+1 hour", strtotime($dateRespondents)));
        }
        $last_date = new DateTime($lastDate);
        
        $day_diff = $first_date->diff($last_date);
        $hour_diff = ($day_diff->days * 24) + $day_diff->h;
        if($hour_diff < 24) {
            $hour_diff = 24;
            $lengthCard1 = 1;
        } else {
            if(fmod($hour_diff, 24) == 0) {
                $lengthCard1 = ($hour_diff / 24) + 1;
            } else {
                $lengthCard1 = (int)ceil($hour_diff / 24);
            }
            $hour_diff = $lengthCard1 * 24;
        }

        $array_hour = [$first_date->format("g a n/j/Y")];
        $array_hourStock = [$first_date->format("g a n/j/Y")];
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

        //respondent answered
        $total_respondents = Respondents::where('survey_id','=',$id)
                                        ->where('finished_at','!=',null)
                                        ->count();
        $overall_respondents = Respondents::where('survey_id','=',$id)
                                        ->count();
        $secondCard['questionCount'] = count($array_questions);
        $secondCard['question'] = [$array_questions[0]];
        $secondCard['skippedCount'] = $total_respondents - Answers::where('q_id',$array_questions[0]['q_id'])->count();
        $secondCard['answerCount'] = $total_respondents - $secondCard['skippedCount'];
        $checkNull = Answers::where('q_id','=',$questions[0]->id)->count();
        if($checkNull == 0) {
            return response()->json([
                'isArray' => false,
                'title' => $returnData,
                'labelsFirstCard' => $array_hour,
                'dataFirstCard' => $array_data,
                'zoomData' => $zoomData,
                'yMax1' => max($array_biggest),
                'firstResponse' => $firstResponse->format("n/j/Y"),
                'lengthCard1' => $lengthCard1,
                'secondCard' => $secondCard,
                'respondentsOverall' => $overall_respondents,
                'respondentsTotal' => $total_respondents,
            ]);
        }

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
            'isArray' => true,
            'title' => $returnData,
            'labelsFirstCard' => $array_hour,
            'dataFirstCard' => $array_data,
            'zoomData' => $zoomData,
            'yMax1' => max($array_biggest),
            'firstResponse' => $firstResponse->format("n/j/Y"),
            'lengthCard1' => $lengthCard1,
            'secondCard' => $secondCard,
            'respondentsOverall' => $overall_respondents,
            'respondentsTotal' => $total_respondents,
        ]);
    }

    public function dataTrendsGetTrend($id, Request $request) {
        //first date
        $dateCreated = Created::where('id','=',$id)->first()->created_at;
        $firstDate = date("Y-m-d H:00:00", strtotime($dateCreated));
        $first_date = new DateTime($firstDate);

        //last date
        $dateRespondents = Respondents::where('survey_id','=',$id)
                             ->where('finished_at','!=',null)
                             ->orderBy('created_at', 'desc')
                             ->first()->created_at;

        if($request->get('trendOption') == 'Day') {
            $hours = (int)(new DateTime($dateRespondents))->format("H");
            $seconds = (int)(new DateTime($dateRespondents))->format("s");
            $minutes = (int)(new DateTime($dateRespondents))->format("i");
            if($seconds == 0 && $minutes == 0 && $hours === 0) {
                $lastDate = date("Y-m-d H:00:00", strtotime($dateRespondents));
            } else {
                $lastDate = date("Y-m-d H:00:00", strtotime("+1 day", strtotime($dateRespondents)));
            }
            $last_date = new DateTime($lastDate);

            //difference between two dates
            $date_diff = $first_date->diff($last_date);

            $firstResponse = new DateTime(Respondents::where('survey_id','=',$id)
                                                     ->where('finished_at','!=',null)
                                                     ->orderBy('created_at', 'asc')
                                                     ->first()->created_at);

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
                    $respo_created = new DateTime($respoDay['finished_at']);
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
            $seconds = (int)(new DateTime($dateRespondents))->format("s");
            $minutes = (int)(new DateTime($dateRespondents))->format("i");
            if($seconds == 0 && $minutes == 0) {
                $lastDate = date("Y-m-d H:00:00", strtotime($dateRespondents));
            } else {
                $lastDate = date("Y-m-d H:00:00", strtotime("+1 hour", strtotime($dateRespondents)));
            }
            $last_date = new DateTime($lastDate);

            //difference between two dates
            $date_diff = $first_date->diff($last_date);

            $firstResponse = new DateTime(Respondents::where('survey_id','=',$id)
                                                     ->where('finished_at','!=',null)
                                                     ->orderBy('created_at', 'asc')
                                                     ->first()->created_at);
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
                    $respo_created = new DateTime($respoHour['finished_at']);
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
        //first date
        $dateCreated = Created::where('id','=',$id)->first()->created_at;

        //last date
        $dateRespondents = Answers::where('q_id',$request->get('q_id'))
                             ->orderBy('created_at', 'desc')
                             ->first()->created_at;

        if($request->get('trendOption') == 'Day') {
            $firstDate = date("Y-m-d 00:00:00", strtotime($dateCreated));
            $first_date = new DateTime($firstDate);
            $lastDate = date("Y-m-d 00:00:00", strtotime($dateRespondents));
            $last_date = new DateTime($lastDate);

            //difference between two dates
            $date_diff = $first_date->diff($last_date);
            $firstResponse = new DateTime(Respondents::where('survey_id','=',$id)
                                                     ->where('finished_at','!=',null)
                                                     ->orderBy('created_at', 'asc')
                                                     ->first()->created_at);

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
            $firstDate = date("Y-m-d H:00:00", strtotime($dateCreated));
            $first_date = new DateTime($firstDate);
            $seconds = (int)(new DateTime($dateRespondents))->format("s");
            $minutes = (int)(new DateTime($dateRespondents))->format("i");
            if($seconds == 0 && $minutes == 0) {
                $lastDate = date("Y-m-d H:00:00", strtotime($dateRespondents));
            } else {
                $lastDate = date("Y-m-d H:00:00", strtotime("+1 hour", strtotime($dateRespondents)));
            }
            $last_date = new DateTime($lastDate);

            //difference between two dates
            $date_diff = $first_date->diff($last_date);

            $firstResponse = new DateTime(Respondents::where('survey_id','=',$id)
                                                     ->where('finished_at','!=',null)
                                                     ->orderBy('created_at', 'asc')
                                                     ->first()->created_at);

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
        //first date
        $dateCreated = Created::where('id','=',$id)->first()->created_at;

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
                foreach($array_hour as $key => $hour) {
                    $fromDate = date("Y-m-d H:00:00", strtotime($hour));
                    $toDate = date("Y-m-d H:59:59", strtotime($hour));
                    $countData = Respondents::whereBetween('finished_at', [$fromDate, $toDate])
                                    ->where('survey_id','=',$id)
                                    ->count();
                    array_push($array_data, $countData);
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
                foreach($array_day as $key => $hour) {
                    $fromDate = date("Y-m-d 00:00:00", strtotime($hour));
                    $toDate = date("Y-m-d 23:59:59", strtotime($hour));
                    $countData = Respondents::whereBetween('finished_at', [$fromDate, $toDate])
                                    ->where('survey_id','=',$id)
                                    ->count();
                    array_push($array_data, $countData);
                }

                $array_label = $array_day;
            }

            return response()->json([
                'labelsFirstCard' => $array_label,
                'dataFirstCard' => $array_data
            ]);
        } elseif($request->get('type') == 'secondQuestion') {
            //second question

            $question = Question::where('survey_id','=',$id)
                            ->skip($request->get('count') - 1)
                            ->first();

            //last date
            $checkNull = Answers::where('q_id',$question->id)->count();
            if($checkNull == 0) {
                $dateRespondents = 0;

                $secondCard = [];
                $array_questions = [
                    'q_title' => strip_tags($question->q_title),
                    'q_type' => $question->q_type,
                ];
                $secondCard['question'] = $array_questions;

                return response()->json([
                    'isArray' => 'noData',
                    'secondCard' => $secondCard,
                    'lengthCard2' => 1,
                    'respondentCount' => 0,
                    'respondentSkipped' => 0,
                ]);
            } else {
                $dateRespondents = Answers::where('q_id',$question->id)
                                 ->orderBy('created_at', 'desc')
                                 ->first()->created_at;
            }

            //respondents data 
            $respondents_data = Respondents::where('survey_id','=',$id)
                                           ->where('finished_at','!=',null)
                                           ->get();
            
            //total respondent who skipped
            $respondent_skipped = count($respondents_data) - Answers::where('q_id',$question->id)->count();

            //total respondent who answered
            $respondent_answered = count($respondents_data) - $respondent_skipped;

            if($request->get('trend') == 'Hour') {
                $firstDate = date("Y-m-d H:00:00", strtotime($dateCreated));
                $first_date = new DateTime($firstDate);
                $lastDate = date("Y-m-d H:00:00", strtotime($dateRespondents));
                $last_date = new DateTime($lastDate);

                //difference between two dates
                $date_diff = $first_date->diff($last_date);
                $hour_diff = ($date_diff->days * 24) + $date_diff->h;
                if($hour_diff < 24) {
                    $lengthCard2 = 1;
                } else {
                    if($date_diff->h == 0) {
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
                $firstDate = date("Y-m-d 00:00:00", strtotime($dateCreated));
                $first_date = new DateTime($firstDate);
                $lastDate = date("Y-m-d 00:00:00", strtotime($dateRespondents));
                $last_date = new DateTime($lastDate);

                //difference between two dates
                $date_diff = $first_date->diff($last_date);
                $firstResponse = new DateTime(Respondents::where('survey_id','=',$id)
                                                         ->where('finished_at','!=',null)
                                                         ->orderBy('created_at', 'asc')
                                                         ->first()->created_at);
                
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

                $array_day = [$first_date->format("n/j/Y")];
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
                'lengthCard2' => $lengthCard2,
                'respondentCount' => $respondent_answered,
                'respondentSkipped' => $respondent_skipped,
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
                        $fromDate = date("Y-m-d 00:00:00", strtotime($day));
                        $toDate = date("Y-m-d 23:59:59", strtotime($day));
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
        $respondentsOverall = Respondents::where('survey_id','=',$id)
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
            array_push($questionsArr, [
                'question' => strip_tags($question['q_title']),
                'q_type' => $question['q_type'],
                'id' => $question['id'],
                'choices' => $question['answer'],
            ]);
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

        $respondents_email = DB::table('respondents')->where('survey_id','=',$id)
                                                     ->where('finished_at','!=',null)
                                                     ->get();

        return response()->json([
            'title' => $title,
            'respondents_count' => $respondents_count,
            'respondents' => $respondents,
            'questions' => $questionsArr,
            'answers' => $answersArr,
            'respondentsOverall' => $respondentsOverall,
            'respondentsEmail' => $respondents_email->pluck('email')->all(),
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
