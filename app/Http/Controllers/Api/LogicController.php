<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Logics;

class LogicController extends Controller
{
    public function logic(Request $request) {
    	$choices = $request->get('choice');
    	$actions = $request->get('action');
    	$q_id = $request->get('q_id');

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
	    		} elseif($actions[$key] != 'removeLogic') {
	    			$logic->logic = "skip to";
	    			$logic->answer = $choice;
	    			$logic->action = $actions[$key];
	    		}
				$logic->save();
			} else {
				if($actions[$key] == 'popup' || $actions[$key] == 'end') {
					$logic = Logics::where('question_id',$q_id)
	    						->where('answer',$choice)
	    						->update([
	    							'logic' => $actions[$key],
	    							'answer' => $choice,
	    							'action' => null
	    						]);
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
	    		}
			}
    	}

    	return response()->json([
    		'success' => 'logic saved',
    	]);
    }
}
