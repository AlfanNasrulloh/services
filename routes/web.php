<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ServiceController;

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Route::get('dashboard', function () {
    //     return Inertia::render('dashboard');
    // })->name('dashboard');
    Route::get('dashboard', [UserController::class, 'index'])->name('dashboard');
    // Route::get('list-customer', [UserController::class, 'index'])->name('manage.user');

    Route::get('add-service', [ServiceController::class, 'create'])->name('service.store');
    Route::post('add-service', [ServiceController::class, 'store'])->name('service.store');
    Route::get('list-service', [ServiceController::class, 'index'])->name('service.index');
    Route::delete('services/{id}', [ServiceController::class, 'destroy'])->name('service.destroy');
    Route::put('/services/{id}', [ServiceController::class, 'update'])->name('service.update');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
