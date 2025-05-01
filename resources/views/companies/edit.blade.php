@extends('layouts.app')

@section('title', 'Edit Company')

@section('content')
    <h1>Edit Company</h1>

    <form action="{{ route('companies.update', $company->id) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')

        <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" class="form-control" id="name" name="name" value="{{ $company->name }}" required>
        </div>

        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" name="email" value="{{ $company->email }}">
        </div>

        <div class="mb-3">
            <label for="logo" class="form-label">Logo (min 100x100)</label>
            <input type="file" class="form-control" id="logo" name="logo">
            @if ($company->logo)
                <img src="{{ asset('storage/' . $company->logo) }}" alt="Company Logo" width="100" class="mt-2">
            @endif
        </div>

        <div class="mb-3">
            <label for="website" class="form-label">Website</label>
            <input type="url" class="form-control" id="website" name="website" value="{{ $company->website }}">
        </div>

        <button type="submit" class="btn btn-primary">Update</button>
        <a href="{{ route('companies.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
@endsection