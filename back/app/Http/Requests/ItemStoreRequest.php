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
            'imageFile' => ['required', 'file', 'image', 'max:2048'],
            'effectType' => ['required', 'string', 'in:heal,buff,debuff'],
            'amount' => ['required_if:effectType,heal', 'integer', 'min:0'],
            'rate' => ['required_if:effectType,buff,debuff', 'numeric', 'between:0,1'],
            'target' => ['required_if:effectType,buff,debuff', 'string', 'in:slash,blow,shoot,neutral,flame,water,wood,shine,dark'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => '名前は必須です。',
            'name.string' => '名前は文字列で入力してください。',
            'name.max' => '名前は255文字以内で入力してください。',

            'imageFile.required' => '画像ファイルは必須です。',
            'imageFile.file' => '画像ファイルをアップロードしてください。',
            'imageFile.image' => '画像ファイル形式である必要があります。',
            'imageFile.max' => '画像ファイルのサイズは2MB以内でなければなりません。',

            'effectType.required' => '効果タイプは必須です。',
            'effectType.string' => '効果タイプは文字列で入力してください。',
            'effectType.in' => '効果タイプは heal, buff, debuff のいずれかを指定してください。',

            'amount.integer' => '回復量は整数で入力してください。',
            'amount.min' => '回復量は0以上で指定してください。',

            'rate.numeric' => '倍率は数値で入力してください。',
            'rate.between' => '倍率は0以上1以下で指定してください。',

            'target.string' => '対象属性は文字列で入力してください。',
            'target.in' => '対象属性は slash, blow, shoot, neutral, flame, water, wood, shine, dark のいずれかを指定してください。',
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
