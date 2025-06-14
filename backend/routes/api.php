<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\DisposalController;
use App\Http\Controllers\ReportController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Authentication Routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // User Management
    Route::apiResource('users', UserController::class);
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
    
    // Asset Management
    Route::apiResource('assets', AssetController::class);
    Route::post('/assets/{id}/move', [AssetController::class, 'moveAsset']);
    Route::post('/assets/{id}/upload-image', [AssetController::class, 'uploadImage']);
    Route::get('/assets/{id}/qr-code', [AssetController::class, 'generateQRCode']);
    Route::get('/assets/category/{category}', [AssetController::class, 'getByCategory']);
    
    // Maintenance Management
    Route::apiResource('maintenance', MaintenanceController::class);
    Route::post('/maintenance/{id}/complete', [MaintenanceController::class, 'complete']);
    Route::get('/maintenance/scheduled/upcoming', [MaintenanceController::class, 'upcomingScheduled']);
    
    // Disposal Management
    Route::apiResource('disposals', DisposalController::class);
    Route::post('/disposals/{id}/approve', [DisposalController::class, 'approve']);
    Route::post('/disposals/{id}/reject', [DisposalController::class, 'reject']);
    
    // Reports
    Route::get('/reports/dashboard', [ReportController::class, 'dashboard']);
    Route::get('/reports/annual/{year}', [ReportController::class, 'annualReport']);
    Route::get('/reports/assets/summary', [ReportController::class, 'assetSummary']);
    Route::get('/reports/maintenance/summary', [ReportController::class, 'maintenanceSummary']);
    Route::post('/reports/export', [ReportController::class, 'export']);
});
