<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Popup;
use App\Logics;
use DB;
use Illuminate\Support\Facades\Input;

class LogicController extends Controller
{
    public function logic(Request $request) {
    	$choices = $request->get('choice');
    	$actions = $request->get('action');
    	$q_id = $request->get('q_id');

    	//popup
    	$popup_check = $request->get('arrayCount');
    	$popup_mess = $request->get('message');
    	$popup_ques = $request->get('question');
    	$popup_ans = $request->get('answer');
    	$popup_act = $request->get('paction');

    	foreach($choices as $key=>$choice) {
    		$logicCheck = Logics::where('question_id',$q_id)
    							->where('answer',$choice)
    							->count();
    		if($logicCheck == 0) { //check if existing na yung logic with question id and answer
	    		$logic = new Logics;
	    		$logic->question_id = $q_id;
	    		if($actions[$key] == 'popup' || $actions[$key] == 'end') {
	    			$logic->logic = $actions[$key];
	    			$logic->answer = $choice;
	    			$logic->action = null;
					$logic->save();

	    			$this->popupSave($popup_check, $popup_mess, $popup_ques, $popup_ans, $popup_act, $logic->id, "not-existing");

	    		} elseif($actions[$key] != 'removeLogic') {
	    			$logic->logic = "skip to";
	    			$logic->answer = $choice;
	    			$logic->action = $actions[$key];
					$logic->save();
	    		}
			} else {
				if($actions[$key] == 'popup' || $actions[$key] == 'end') {
					$logic = Logics::where('question_id',$q_id)
	    						->where('answer',$choice)
	    						->update([
	    							'logic' => $actions[$key],
	    							'answer' => $choice,
	    							'action' => null
	    						]);

	    			//update popup
	    			$logic_id = Logics::where('question_id',$q_id)
	    						->where('answer',$choice)
	    						->first()->id;
	    			$this->popupSave($popup_check, $popup_mess, $popup_ques, $popup_ans, $popup_act, $logic_id, "existing");

	    		} elseif($actions[$key] == 'removeLogic') {
	    			$logic = Logics::where('question_id',$q_id)
	    						->where('answer',$choice)
	    						->delete();
	    		} else {
	    			$logic = Logics::where('question_id',$q_id)
	    						->where('answer',$choice)
	    						->update([
	    							'logic' => "skip to",
	    							'answer' => $choice,
	    							'action' => $actions[$key]
	    						]);

	    			//update popup
	    			$logic_id = Logics::where('question_id',$q_id)
	    						->where('answer',$choice)
	    						->first()->id;
	    			$this->popupSave($popup_check, $popup_mess, $popup_ques, $popup_ans, $popup_act, $logic_id, "existing");
	    		}
			}
    	}

    	return response()->json([
    		'success' => 'logic saved',
    	]);
    }

    public function getAnswer(Request $request) {
    	$survey_id = $request->get('survey_id');
    	$question_no = $request->get('q_no');

    	$data = DB::table('questions')->where('survey_id',$survey_id)->get();
    	$answers = [];
    	foreach($data as $key=>$datum) {
    		if(($question_no - 1) > $key) {
	    		$answers[$key] = [
	    			'answers' => $datum->answer,
	    			'q_id' => $datum->id
	    		];
	    	}
    	}

    	return response()->json(['answers' => $answers]);
    }

    public function popupSave($popup_check, $popup_mess, $popup_ques, $popup_ans, $popup_act, $logic_id, $existCheck) {
		if($popup_check != 0) {
			if($existCheck == 'not-existing') { //create new
				foreach($popup_ques as $key=>$ques) {
					if($ques) {
						$popup = new Popup;
						$popup->logic_id = $logic_id;
						$popup->message = $popup_mess[$key];
						$popup->q_id = $ques;
						$popup->q_type = DB::table('questions')
											->where('id','=',$ques)
											->first()->q_type;
						$popup->answer = $popup_ans[$key];
						$popup->action = $popup_act[$key];
						$popup->save();
					}
				}
			} elseif($existCheck == 'existing') { //update
				foreach($popup_ques as $key=>$ques) {
					if($ques) {
						$popup = Popup::where('logic_id',$logic_id)
	    							  ->update([
	    								  'message' => $popup_mess[$key],
	    								  'q_id' => $ques,
										  'q_type' => DB::table('questions')
										  				->where('id','=',$ques)
										  				->first()->q_type,
	    								  'answer' => $popup_ans[$key],
	    								  'action' => $popup_act[$key]
	    							  ]);
					}
				}
			} else { //delete
				foreach($popup_ques as $key=>$ques) {
					if($ques) {
						$popup = Popup::where('logic_id',$logic_id)
	    							  ->delete();
					}
				}
			}
		}
    }

    public function getPopup($q_no) {
    	$explode = explode("_", $q_no);
    	$q_no = $explode[0];
    	$q_count = $explode[1];
    	$survey_id = $explode[2];
    	$equal = $explode[3];

    	//get question
    	if($q_no != 'end' && $equal == 'equal') {
	    	$question = DB::table('questions')
	    				->select('id','q_type','q_title','answer')
	    				->where('id','=',$q_no)
	    				->first();
	    	$ids = DB::table('questions')
						->select('id')
						->where('survey_id','=',$survey_id)
						->get();
			$newCount = (array_search($q_no, ($ids->pluck('id'))->all())) + 1;
		} else {
			$question = DB::table('questions')
	    				->select('id','q_type','q_title','answer')
	    				->where('survey_id','=',$survey_id)
	    				->skip($q_count - 1)
	    				->first();
	    	$newCount = $q_count;
		}

    	$question->title = DB::table('surveys')
    						->where('survey_id','=',$survey_id)
    						->first()->title;

    	return response()->json([
    		'survey' => [$question],
    		'newPageCount' => $newCount
    	]);
    }
}
