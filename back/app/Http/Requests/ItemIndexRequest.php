<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ItemIndexRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
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
            'effectType' => ['nullable', 'in:heal,buff,defuff'],
            'sort' => ['required', 'in:createdAt,name,updatedAt'],
            'desc' => ['required', 'boolean'],
        ];
    }
}
