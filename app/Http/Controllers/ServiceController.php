<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;


class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::all();
        return Inertia::render('manage-customer/list', [
            'services' => $services,
        ]);
    }

    public function create()
    {
        $services = Service::all();
        return Inertia::render('manage-customer/add', [
            'services' => $services,
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string',
            'price' => 'required|numeric',
            'photo' => 'nullable',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('services', 'public');
        }

        Service::create($validated);

        return redirect()->route('service.index')->with('success', 'Service added successfully!');
    }

    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);
        $validated = $request->validate([
            'description' => 'required|string',
            'price' => 'required|numeric',
            'photo' => 'nullable',
        ]);

        if ($request->hasFile('photo')) {
            if ($service->photo && Storage::disk('public')->exists($service->photo)) {
                Storage::disk('public')->delete($service->photo);
            }
            $path = $request->file('photo')->store('services', 'public');
            $validated['photo'] = $path;
        }
        // dd($request->all());

        $service->update($validated);

        return redirect()->route('service.index')->with('success', 'Service updated successfully!');
    }

    public function destroy($id)
    {
        $service = Service::find(request('id'));
        // dd($service);
        if ($service->photo && Storage::disk('public')->delete($service->photo)) {
            Storage::delete('public/' . $service->photo);
        }
        // dd($service->photo, Storage::delete('public/' . $service->photo));

        $service->delete();

        return redirect()->route('service.index')->with('success', 'Service added successfully!');
    }
}
