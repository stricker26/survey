<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\User;
use DB;

class AuthController extends Controller
{
    public function login(Request $request) {
    	$username = $request->get('username');
    	$password = $request->get('password');
    	$tokens = Hash::make(microtime(true) . random_bytes('16'));
 
    	if($this->usernameValidate($username)) {
    		$passwordHashed = $this->getPasswordHashed($username);
    		if($this->passwordValidate($passwordHashed, $password)) {
    			$this->setSessionToken($username, $tokens);
    			return response()->json(['success' => $tokens]);
    		} else {
    			return response()->json(['warning' => 'credentials unmatched']);
    		}
    	} else {
			return response()->json(['warning' => 'credentials unmatched']);
    	}
    }

    public function register(Request $request) {
    	//unique username dapat gawa validation
    	$username = $request->get('username');
    	$password = Hash::make($request->get('password'));
        $name = $request->get('name');
    	$tokens = Hash::make(microtime(true) . random_bytes('16'));
    	$usernew = new User;
    	$usernew->name = $name;
    	$usernew->username = $username;
    	$usernew->password = $password;
    	$usernew->token = $tokens;
    	$usernew->save();
        return response()->json(['success' => $tokens]);
    }

    public function getName(Request $request) {
        $token = $request->get('token');

        $user = User::where('token', '=', $token)->first();

        if($user) {
            return response()->json(['user' => $user->name]);
        } else {
            return response()->json(['error' => 'Error']);
        }

    }

    public function usernameValidate($username) {
    	return User::where('username', '=', $username)->count();
    }

    public function getPasswordHashed($username) {
    	return DB::table('users')->where('username',$username)->first()->password;
    }

    public function passwordValidate($pw_h, $pw_uh) {
    	return Hash::check($pw_uh, $pw_h);
    }

    public function setSessionToken($username, $token) {
    	$user_token = User::where('username', '=', $username)->first();
    	$user_token->token = $token;
    	$user_token->save();
    }
}
