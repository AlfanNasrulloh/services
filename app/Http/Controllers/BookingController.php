<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Booking;
use App\Models\Service;
use Inertia\Controller;
use Illuminate\Http\Request;
use App\Mail\BookingCreatedMail;
use App\Mail\MailableName;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class BookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::with('user', 'service')->get();
        $services = Service::all();
        return Inertia::render('booking/list', [
            'bookings' => $bookings,
            'services' => $services,
            'userRole' => Auth::user()->role
        ]);
    }

    public function create()
    {
        $services = Service::all();
        return Inertia::render('booking/add', [
            'services' => $services,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'date_booking' => 'required|date',
        ]);

        $existingBooking = Booking::where('user_id', Auth::id())
            ->where('service_id', $validated['service_id'])
            ->whereDate('date_booking', $validated['date_booking'])
            ->first();

        if ($existingBooking) {
            return redirect()->back()->withErrors([
                'date_booking' => 'You have already booked this service on that date. It can only be used once per day.'
            ])->withInput();
        }

        $booking = Booking::create([
            'user_id' => Auth::id(),
            'service_id' => $validated['service_id'],
            'date_booking' => $validated['date_booking'],
        ]);

        $booking->load('user');

        // Kirim email ke user
        Mail::to($booking->user->email)->send(new MailableName($booking));

        return redirect()->route('booking.index')->with('success', 'Booking created successfully!');
    }

    public function update(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:completed,pending',
            'date_booking' => 'required|date',
            'service_id' => 'required|exists:services,id',
        ]);

        $booking->update($validated);
        return redirect()->route('booking.index')->with('success', 'Booking updated successfully!');
    }


    public function destroy($id)
    {
        $booking = Booking::find(request('id'));
        // dd($service);

        $booking->delete();

        return redirect()->route('booking.index')->with('success', 'Service added successfully!');
    }
}
