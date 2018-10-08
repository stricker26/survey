<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Laravel</title>
        <link rel="stylesheet" type="text/css" href="{{ asset('css/app.css') }}">
        <link rel="stylesheet" type="text/css" href="{{ asset('css/style.css') }}">
        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" crossorigin="anonymous">
    </head>
    <body>
        <header>
            <div class="container-full">
                <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
                        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                            <li class="nav-item active">
                                <a class="nav-link" href="#">Dashboard <span class="sr-only">(current)</span></a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">My Serveys</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Responses</a>
                            </li>
                        </ul>
                        <div class="flex-row">
                            <div class="dropdown">
                                <button type="button" class="btn btn-warning">Create Survey</button>
                                <button id="btnGroupDrop1" class="dropdown-toggle btn btn-primary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fas fa-user fa-lg"></i> &nbsp; rjhonnas
                                </button>
                                <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                  <a class="dropdown-item" href="#">Dropdown link</a>
                                  <a class="dropdown-item" href="#">Dropdown link</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav> 
            </div>
        </header>
        
        <section>
            @yield('content')
        </section>
        <!-- <footer>
            <div class="container-full bg-secondary">
                <nav class="nav">
                  <a class="nav-link" href="#">Home</a>
                  <a class="nav-link" href="#">Privacy Statement</a>
                  <a class="nav-link" href="#">terms and Conditions</a>
                  <a class="nav-link" href="#">Contact</a>
                  <a class="nav-link" href="#">Help</a>
                </nav>
            </div>    
        </footer> -->

        <script src="{{ asset('js/app.js') }}"></script>
    </body>
</html>
