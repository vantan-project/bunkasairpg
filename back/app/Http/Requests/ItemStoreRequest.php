<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ItemStoreRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'imageFile' => ['nullable', 'file', 'image', 'max:2048'],
            'effectType' => ['required', 'string', 'in:heal,buff,debuff'],
            'amount' => ['required_if:effectType,heal', 'integer', 'min:0'],
            'rate' => ['required_if:effectType,buff,debuff', 'numeric', 'between:0,1'],
            'target' => ['required_if:effectType,buff,debuff', 'string', 'in:slash,blow,shoot,neutral,flame,water,wood,shine,dark'],
        ];
    }
}
