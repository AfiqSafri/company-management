@extends('layouts.app')

@section('title', 'Add Company')

@section('content')
    <h1>Create Company</h1>

    <form action="{{ route('companies.store') }}" method="POST" enctype="multipart/form-data">
        @csrf

        <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" class="form-control" id="name" name="name" required>
        </div>

        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" name="email">
        </div>

        <div class="mb-3">
            <label for="logo" class="form-label">Logo (min 100x100)</label>
            <input type="file" class="form-control" id="logo" name="logo">
        </div>

        <div class="mb-3">
            <label for="website" class="form-label">Website</label>
            <input type="url" class="form-control" id="website" name="website">
        </div>

        <button type="submit" class="btn btn-primary">Save</button>
        <a href="{{ route('companies.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
@endsection