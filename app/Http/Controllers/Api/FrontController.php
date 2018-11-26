<?php

namespace App\Http\Controllers\Api;

use DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;

use App\Logics;
use App\Question;
use App\Popup;

class FrontController extends Controller
{
    public function survey($id) {
    	$query = $this->getQuestions($id);
    	return response()->json(['surveyLength' => count($query), 'survey' => [$query[0]], 'title' => $query[0]->title]);
    }

    public function surveyWelcome($id) {
        $query = $this->getQuestions($id);
        return response()->json(['survey' => [$query[0]], 'title' => $query[0]->title]);
    }

    public function surveyLogic($id, Request $request) {
        $q_id = $request->get('questionId');
        $q_type = $request->get('questionType');
        $answer = $request->get('answer');
        $pageCount = $request->get('questionCount');
        $logic_query = Logics::where('question_id',$q_id)
                             ->where('answer',$answer)
                             ->first();

        if($logic_query) {
            //check if the logic is popup or end
            if($logic_query->logic == 'popup') {
                $query = [];
                $logic = [
                    $logic_query->logic,
                    $logic_query->answer
                ];
                $newPageCount = $pageCount;
                $hasLogic = true;
                $logicContent = Popup::where('logic_id','=',$logic_query->id)->first();
            } elseif($logic_query->logic == 'end') {
                $query = [];
                $logic = $logic_query->logic;
                $newPageCount = count($this->getQuestions($id));
                $hasLogic = true;
                $logicContent = false;
            } else { //skip to question
                $query = DB::table('questions')
                            ->select('answer','id','q_title','q_type')
                            ->where('id',$logic_query->action)
                            ->first();
                $logic = $logic_query->logic;
                $newPageCount = $this->newPageCount($id, $logic_query->action);
                $hasLogic = true;
                $logicContent = false;
            }
        } else {
            $query = $this->getQuestions($id);
            $query = $query[$pageCount - 1];
            $newPageCount = $pageCount;
            $logic = 'no logic';
            $hasLogic = false;
            $logicContent = false;
        }
        return response()->json([
            'hasLogic' => true,
            'logic' => $logic,
            'survey' => [$query],
            'newPageCount' => $newPageCount,
            'logicContent' => $logicContent
        ]);
    }

    public function newPageCount($id, $q_id) {
        $questions = $this->getQuestions($id);
        foreach($questions as $key=>$question) {
            if($question->id == $q_id) {
                $newPageCount = $key + 1;
            }
        }

        return $newPageCount;
    }

    public function getQuestions($id) {
        return DB::table('surveys AS s')
            ->join('questions AS q', 's.survey_id', '=', 'q.survey_id')
            ->select('q.id', 'q.q_title', 'q.q_type', 'q.answer', 's.title')
            ->where('s.survey_id', '=', $id)
            ->orderBy('q.id', 'ASC')
            ->get();
    }
}
