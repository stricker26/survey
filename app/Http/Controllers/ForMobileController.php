<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use DB;

class ForMobileController extends Controller
{
    public function getSurvey($token) {

    	//$token is encrypted, we will decrypt it later
    	$sid = $token;
    	$q_db = DB::table('questions')->where('survey_id','=',$sid)->get();
        $l_db = DB::table('logics')->whereIn('question_id',$q_db->pluck('id')->all());
        $p_db = DB::table('popups')->whereIn('logic_id',$l_db->pluck('id')->all());
    	$arr = array();
    	$obj = (object)[];
    	foreach($q_db as $q) {

    		$obj->q_title = strip_tags($q->q_title);
    		$obj->q_type = $q->q_type;
    		$obj->q_order = $q->q_order;
    		$obj->q_choices = $q->answer;


            $obj_storage = $l_db->where('question_id','=',$q->id)->get();
            if($obj_storage) {

                $obj_logic = (object)[];
                foreach($obj_storage as $o_s) $obj_logic->{$o_s->id} = $o_s;
                $obj->q_logic = $obj_logic;


                $obj_storage = $p_db->whereIn('logic_id',array_keys((array)$obj_logic))->get();
                if($obj_storage) {

                    $obj_popup = (object)[];
                    foreach($obj_popup as $o_p) $obj_popup->{$o_p->id} = $o_p;

                } else {

                    $obj_popup = (object)[];

                }
                $obj->q_popup = $obj_popup;

            } else {

                $obj_logic = (object)[];
                $obj_popup = (object)[];

            }
            $obj->q_logic = $obj_logic;
            $obj->q_popup = $obj_popup;


            array_push($arr, $obj);
            $obj = (object)[];

    	}
        $data = $arr;

    	
    	return response()->json([
            'data' => $data,
            'surveyID' => $sid,
        ]);
    }

    public function checkConn() {
        
        return response()->json(['success'=>1]);

    }
}
