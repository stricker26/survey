<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Exports\IndividualExport;
use App\Exports\AllExport;

use App\Respondents;
use Excel;

class ExcelExportController extends Controller
{
    public function individual($rid) {

    	$r_name = Respondents::where('id','=',$rid)->first()->email;
    	return Excel::download(new IndividualExport($rid), 'RespondentID#'.$rid.'.xlsx');

    }

    public function all($sid) {

    	return Excel::download(new AllExport($sid), 'SurveyID#'.$sid.'.xlsx');

    }
}
