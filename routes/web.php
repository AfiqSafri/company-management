<?php

// use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\CompanyController;

// Route::get('/', function () {
//     return redirect()->route('companies.index');
// });

// Route::resource('companies', CompanyController::class);
// Auth::routes();

// Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;

Route::get('/', function () {
    return redirect()->route('login');
});

Auth::routes(['register' => false]); // Disable registration

Route::middleware('auth')->group(function () {
    Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
    Route::resource('companies', CompanyController::class);
});
