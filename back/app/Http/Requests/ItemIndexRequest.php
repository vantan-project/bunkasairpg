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

    public function messages(): array
    {
        return [
            'currentPage.required' => '現在のページ番号は必須です。',
            'currentPage.integer' => '現在のページ番号は整数でなければなりません。',
            'currentPage.min' => 'ページ番号は1以上で指定してください。',

            'name.string' => '名前は文字列で入力してください。',
            'name.max' => '名前は255文字以内で入力してください。',

            'effectType.in' => '効果タイプは heal, buff, defuff のいずれかを指定してください。',

            'sort.required' => '並び順の項目は必須です。',
            'sort.in' => '並び順には createdAt, name, updatedAt のいずれかを指定してください。',

            'desc.required' => '降順指定は必須です。',
            'desc.boolean' => '降順指定は true または false を指定してください。',
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
