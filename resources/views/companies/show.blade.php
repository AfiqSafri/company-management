@extends('layouts.app')

@section('title', 'View Company')

@section('content')
    <h1>{{ $company->name }}</h1>

    <div class="card">
        <div class="card-body">
            <p><strong>Email:</strong> {{ $company->email }}</p>
            <p><strong>Website:</strong> {{ $company->website }}</p>
            
            @if ($company->logo)
                <p><strong>Logo:</strong></p>
                <img src="{{ asset('storage/' . $company->logo) }}" alt="Company Logo" width="200">
            @endif
        </div>
    </div>

    <div class="mt-3">
        <a href="{{ route('companies.edit', $company->id) }}" class="btn btn-warning">Edit</a>
        <form action="{{ route('companies.destroy', $company->id) }}" method="POST" style="display: inline-block;">
            @csrf
            @method('DELETE')
            <button type="submit" class="btn btn-danger" onclick="return confirm('Are you sure?')">Delete</button>
        </form>
        <a href="{{ route('companies.index') }}" class="btn btn-secondary">Back to List</a>
    </div>
@endsection