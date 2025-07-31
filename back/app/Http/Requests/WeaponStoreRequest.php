<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class WeaponStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::guard('sanctum')->user() instanceof \App\Models\Admin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'imageFile' => ['required', 'file', 'image', 'max:2048'],
            'physicsAttack' => ['required', 'integer', 'min:0'],
            'elementAttack' => ['nullable', 'integer', 'min:0'],
            'physicsType' => ['required', 'in:slash,blow,shoot'],
            'elementType' => ['required', 'in:neutral,flame,water,wood,shine,dark'],
        ];
    }
}
