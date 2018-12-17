<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use DB;
use App\Respondents;
use App\Answers;
use App\User;
use App\Researchers;
use App\ResearchersData;
use Illuminate\Support\Facades\Hash;

class ForMobileController extends Controller
{

    public function getSurvey($token, $rid) {

    	$sid = $token;

        //survey
    	$q_db = DB::table('questions')->where('survey_id','=',$sid)->get();
        if(count($q_db) == 0) {
            return response()->json(['data' => []]);
        }


        //check researcher can use the survey
        $researcher = Researchers::where('id','=',$rid)->first();
        if(DB::table('surveys')->where('user_id','=',$researcher->user_id)->count() == 0) {
            return response()->json(['data' => []]);
        }


        $s_title = DB::table('surveys')->where('survey_id','=',$sid)->first()->title;
    	$arr = array();
    	$obj = (object)[];
    	foreach($q_db as $q) {

            $obj->q_id = $q->id;
    		$obj->q_title = strip_tags($q->q_title);
    		$obj->q_type = $q->q_type;
    		$obj->q_order = $q->q_order;
    		$obj->q_choices = $q->answer;


            $obj_storage = DB::table('logics')->where('question_id','=',$q->id)->get();
            if($obj_storage) {

                $obj_logic = (object)[];
                $logicID_arr = array();
                foreach($obj_storage as $o_s) {

                    $obj_logic->{$o_s->answer} = $o_s;
                    if($o_s->logic == 'popup') array_push($logicID_arr, $o_s->id);

                }
                

                $obj_popup = (object)[];
                if(count($logicID_arr) != 0) {

                    $obj_storage = DB::table('popups')->whereIn('logic_id', $logicID_arr)->get();
                    foreach($obj_storage as $o_s) $obj_popup->{$o_s->logic_id} = $o_s;

                } else $obj_popup = (object)[];

            } else {

                $obj_logic = (object)[];
                $obj_popup = (object)[];

            }
            $obj->logic = $obj_logic;
            $obj->popup = $obj_popup;


            array_push($arr, $obj);
            $obj = (object)[];

    	}
        $data = $arr;

    	
    	return response()->json([
            'data' => $data,
            'surveyID' => $sid,
            'surveyTitle' => $s_title,
        ]);
    
    }

    public function checkConn() {
        
        return response()->json(['success'=>1]);

    }

    public function saveData(Request $request) {

        $respondents = json_decode($request->get('respondents'));
        $answers = json_decode($request->get('answers'));

        foreach($respondents as $sid=>$r) {

            foreach($r as $r_data) {
            
                $new_response = new Respondents;
                $new_response->email = $r_data->name;
                $new_response->survey_source = 'Mobile Link 1 (Mobile App)';
                $new_response->age = $r_data->age;
                $new_response->gender = $r_data->gender;
                $new_response->sec = ($r_data->sec == '' ? null : $r_data->sec);
                $new_response->ip = $r_data->ip;
                if($r_data->finishedAt != null) $new_response->finished_at = date("Y-m-d H:i:s", $r_data->finishedAt);
                $new_response->created_at = date("Y-m-d H:i:s", $r_data->createdAt);
                $new_response->survey_id = $sid;
                $new_response->save();


                $rid = $new_response->id;
                if($r_data->finishedAt != null) {

                    $a_data = ($answers->$sid)->{$r_data->id};
                    foreach($a_data as $a) {

                        $new_answer = new Answers;
                        $new_answer->q_id = $a->qId;
                        $new_answer->answer = $a->answer;
                        $new_answer->respondent_id = $rid;
                        $new_answer->created_at = date("Y-m-d H:i:s", $a->createdAt);
                        $new_answer->save();

                    }

                }

            }

        }

        return response()->json(['success'=>'Save Success!']);

    }

    public function saveLocation(Request $request) {

        $data = $request->get('data');

        foreach($data as $d) {

            $r_data = new ResearchersData;
            $r_data->researcher_id = $d['researcher_id'];
            $r_data->longitude = $d['longitude'];
            $r_data->latitude = $d['latitude'];
            $r_data->heading = $d['heading'];
            $r_data->survey = $d['survey'];
            $r_data->serial = $d['serial'];
            $r_data->model = $d['model'];
            $r_data->created_at = date("Y-m-d H:i:s", $d['created_at']);
            $r_data->save();

        }

    }

    public function loginMobile(Request $request) {

        $username = $request->get('username');
        $password = $request->get('password');
 
        if(Researchers::where('username', '=', $username)->count() != 0) {
            $passwordHashed = Researchers::where('username',$username)->first();
            if(Hash::check($password, $passwordHashed->password)) {
                return response()->json([
                    'login' => 'success',
                    'id' => $passwordHashed->id,
                    'username' => $passwordHashed->username,
                    'name' => $passwordHashed->name
                ]);
            } else {
                return response()->json(['login' => 'credentials unmatched']);
            }
        } else {
            return response()->json(['login' => 'credentials unmatched']);
        }

    }

}
