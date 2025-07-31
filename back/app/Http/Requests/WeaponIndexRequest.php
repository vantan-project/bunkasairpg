<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class WeaponIndexRequest extends FormRequest
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
            'currentPage' => ['required', 'integer', 'min:1'],
            'name' => ['nullable', 'string', 'max:255'],
            'physicsType' => ['nullable', 'in:slash,blow,shoot'],
            'elementType' => ['nullable', 'in:neutral,flame,water,wood,shine,dark'],
            'sort' => ['required', 'in:physicsAttack,elementType,createdAt,name,updatedAt'],
            'desc' => ['required', 'boolean'],
        ];
    }
}
