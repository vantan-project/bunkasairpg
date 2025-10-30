<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user = Auth::user();

        return [
            'name' => 'nullable|string|max:255' . ($user ? $user->id : ''),
            'imageFile' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'level' => 'nullable|integer|min:1',
            'hitPoint' => 'nullable|integer|min:0',
            'experiencePoint' => 'nullable|integer|min:0',
            'weaponId' => 'nullable|integer|exists:weapons,id',
        ];
    }

}
