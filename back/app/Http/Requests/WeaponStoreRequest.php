<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class WeaponStoreRequest extends FormRequest
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
      'indexNumber' => ['required', 'string', 'regex:/^\d{3}$/', 'unique:weapons,index_number'],
      'physicsAttack' => ['required', 'integer', 'min:0'],
      'elementAttack' => ['nullable', 'integer', 'min:0'],
      'physicsType' => ['required', 'in:slash,blow,shoot'],
      'elementType' => ['required', 'in:neutral,flame,water,wood,shine,dark'],
    ];
  }
  public function messages(): array
  {
    return [
      'name.required' => '名前は必須です。',
      'name.string' => '名前は文字列で入力してください。',
      'name.max' => '名前は255文字以内で入力してください。',

      'imageFile.required' => '画像ファイルは必須です。',
      'imageFile.file' => '有効なファイルを指定してください。',
      'imageFile.image' => '画像ファイル形式で指定してください。',
      'imageFile.max' => '画像ファイルは2MB以下にしてください。',

      'indexNumber.required' => '図鑑番号は必須です。',
      'indexNumber.string'   => '図鑑番号は文字列でなければなりません。',
      'indexNumber.regex' => '図鑑番号は000~999の数字でなければなりません。',
      'indexNumber.unique' => '図鑑番号が既に登録されています。',

      'physicsAttack.required' => '物理攻撃力は必須です。',
      'physicsAttack.integer' => '物理攻撃力は整数で入力してください。',
      'physicsAttack.min' => '物理攻撃力は0以上で指定してください。',

      'elementAttack.integer' => '属性攻撃力は整数で入力してください。',
      'elementAttack.min' => '属性攻撃力は0以上で指定してください。',

      'physicsType.required' => '物理タイプは必須です。',
      'physicsType.in' => '物理タイプは slash、blow、shoot のいずれかで指定してください。',

      'elementType.required' => '属性タイプは必須です。',
      'elementType.in' => '属性タイプは neutral、flame、water、wood、shine、dark のいずれかで指定してください。',
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
