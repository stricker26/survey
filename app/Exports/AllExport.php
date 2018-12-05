<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

use App\Answers;
use App\Respondents;
use App\Question;
use Date;

class AllExport implements FromQuery, WithHeadings, WithMapping
{
	private $respo_ids;
    private $respondents;
    private $questions;

	public function __construct($sid) {

		$respondents_db = Respondents::where('survey_id','=',$sid)->get();
		$this->respo_ids = $respondents_db->pluck('id')->all();
    	$this->respondents = $respondents_db;
    	$this->questions = Question::get();

	}

    public function query() {

        return Answers::whereIn('respondent_id',$this->respo_ids)
        				->orderBy('respondent_id','asc');

    }

    public function map($data): array {

        return [
            $data->id,
            $data->answer,
            strip_tags($this->questions->where('id','=',$data->q_id)->first()->q_title),
            $this->respondents->where('id','=',$data->respondent_id)->first()->email,
            $this->respondents->where('id','=',$data->respondent_id)->first()->age,
            $this->respondents->where('id','=',$data->respondent_id)->first()->gender,
            $this->respondents->where('id','=',$data->respondent_id)->first()->sec,
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
