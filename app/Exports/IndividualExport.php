<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

use App\Answers;
use App\Respondents;
use App\Question;
use Date;

class IndividualExport implements FromQuery, WithHeadings, WithMapping
{
    private $respo_id;
    private $respondent_email;
    private $respondent_age;
    private $respondent_gender;
    private $respondent_sec;
    private $questions;

	public function __construct($rid) {

		$respondent_db = Respondents::where('id','=',$rid)->first();
		$this->respo_id = $rid;
    	$this->respondent_email = $respondent_db->email;
    	$this->respondent_age = $respondent_db->age;
    	$this->respondent_gender = $respondent_db->gender;
    	$this->respondent_sec = $respondent_db->sec;
    	$this->questions = Question::get();

	}

    public function query() {

        return Answers::where('respondent_id','=',$this->respo_id);

    }

    public function map($data): array {

        return [
            $data->id,
            $data->answer,
            strip_tags($this->questions->where('id','=',$data->q_id)->first()->q_title),
            $this->respondent_email,
            $this->respondent_age,
            $this->respondent_gender,
            $this->respondent_sec,
            $data->created_at,
        ];

    }

    public function headings(): array {

    	return [
    		'ID',
    		'ANSWER',
    		'QUESTION',
    		'RESPONDENT NAME',
    		'RESPONDENT AGE',
    		'RESPONDENT GENDER',
    		'RESPONDENT SOCIAL ECONOMIC CLASS',
    		'CREATED AT',
    	];

    }
}
