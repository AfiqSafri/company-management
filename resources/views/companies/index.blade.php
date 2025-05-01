@extends('layouts.app')

@section('title', 'Companies')

@section('content')
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h1>Companies</h1>
        <a href="{{ route('companies.create') }}" class="btn btn-primary">Add Company</a>
    </div>

    @if (session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif

    <table class="table table-striped">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Website</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($companies as $company)
                <tr>
                    <td>{{ $company->id }}</td>
                    <td>{{ $company->name }}</td>
                    <td>{{ $company->email }}</td>
                    <td>{{ $company->website }}</td>
                    <td>
                        <a href="{{ route('companies.show', $company->id) }}" class="btn btn-info btn-sm">View</a>
                        <a href="{{ route('companies.edit', $company->id) }}" class="btn btn-warning btn-sm">Edit</a>
                        <form action="{{ route('companies.destroy', $company->id) }}" method="POST" style="display: inline-block;">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure?')">Delete</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{ $companies->links() }}
@endsection