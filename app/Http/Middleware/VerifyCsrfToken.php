<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        //
        'm-survey/submitData/s38rV3eY&',
        'm-survey/researchersLocation/s38rV3eY&',
        'm-survey/login/s38rV3eY&',
    ];
}
