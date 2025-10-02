<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class MonsterIndexRequest extends FormRequest
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
            'sort' => ['required', 'in:createdAt,name,attack,hitPoint,experiencePoint,updatedAt'],
            'desc' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'currentPage.required' => '現在のページ番号は必須です。',
            'currentPage.integer' => '現在のページ番号は整数で入力してください。',
            'currentPage.min' => '現在のページ番号は1以上で指定してください。',

            'name.string' => '名前は文字列で入力してください。',
            'name.max' => '名前は255文字以内で入力してください。',

            'sort.required' => 'ソート条件は必須です。',
            'sort.in' => 'ソート条件は createdAt、name、attack、hitPoint、experiencePoint、updatedAt のいずれかで指定してください。',

            'desc.required' => '昇順・降順の指定は必須です。',
            'desc.boolean' => '昇順・降順は true または false で指定してください。',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'messages' => collect($validator->errors()->messages())
                    ->flatten()
                    ->toArray()
            ], 422)
        );
    }
}
