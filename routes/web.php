<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Catch all routes for React Router
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
