<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class MonsterStoreRequest extends FormRequest
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
      'indexNumber' => ['required', 'string', 'regex:/^\d{3}$/', 'unique:monsters,index_number'],
      'attack' => ['required', 'integer', 'min:0'],
      'hitPoint' => ['required', 'integer', 'min:0'],
      'experiencePoint' => ['required', 'integer', 'min:0'],
      'slash' => ['required', 'numeric', 'between:-1,2'],
      'blow' => ['required', 'numeric', 'between:-1,2'],
      'shoot' => ['required', 'numeric', 'between:-1,2'],
      'neutral' => ['required', 'numeric', 'between:-1,2'],
      'flame' => ['required', 'numeric', 'between:-1,2'],
      'water' => ['required', 'numeric', 'between:-1,2'],
      'wood' => ['required', 'numeric', 'between:-1,2'],
      'shine' => ['required', 'numeric', 'between:-1,2'],
      'dark' => ['required', 'numeric', 'between:-1,2'],
      'weaponId' => ['nullable', 'integer', 'exists:weapons,id'],
      'itemId' => ['nullable', 'integer', 'exists:items,id'],
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

      'indexNumber.required' => '図鑑番号は必須です。',
      'indexNumber.string'   => '図鑑番号は文字列でなければなりません。',
      'indexNumber.regex' => '図鑑番号は000~999の数字でなければなりません。',
      'indexNumber.unique' => '図鑑番号が既に登録されています。',

      'attack.required' => '攻撃力は必須です。',
      'attack.integer' => '攻撃力は整数で入力してください。',
      'attack.min' => '攻撃力は0以上で指定してください。',

      'hitPoint.required' => 'HPは必須です。',
      'hitPoint.integer' => 'HPは整数で入力してください。',
      'hitPoint.min' => 'HPは0以上で指定してください。',

      'experiencePoint.required' => '獲得経験値は必須です。',
      'experiencePoint.integer' => '獲得経験値は整数で入力してください。',
      'experiencePoint.min' => '獲得経験値は0以上で指定してください。',

      'slash.required' => 'slashは必須です。',
      'slash.numeric' => 'slashは数値で入力してください。',
      'slash.between' => 'slashは0以上1以下で指定してください。',

      'blow.required' => 'blowは必須です。',
      'blow.numeric' => 'blowは数値で入力してください。',
      'blow.between' => 'blowは0以上1以下で指定してください。',

      'shoot.required' => 'shootは必須です。',
      'shoot.numeric' => 'shootは数値で入力してください。',
      'shoot.between' => 'shootは0以上1以下で指定してください。',

      'neutral.required' => 'neutralは必須です。',
      'neutral.numeric' => 'neutralは数値で入力してください。',
      'neutral.between' => 'neutralは0以上1以下で指定してください。',

      'flame.required' => 'flameは必須です。',
      'flame.numeric' => 'flameは数値で入力してください。',
      'flame.between' => 'flameは0以上1以下で指定してください。',

      'water.required' => 'waterは必須です。',
      'water.numeric' => 'waterは数値で入力してください。',
      'water.between' => 'waterは0以上1以下で指定してください。',

      'wood.required' => 'woodは必須です。',
      'wood.numeric' => 'woodは数値で入力してください。',
      'wood.between' => 'woodは0以上1以下で指定してください。',

      'shine.required' => 'shineは必須です。',
      'shine.numeric' => 'shineは数値で入力してください。',
      'shine.between' => 'shineは0以上1以下で指定してください。',

      'dack.required' => 'dackは必須です。',
      'dack.numeric' => 'dackは数値で入力してください。',
      'dack.between' => 'dackは0以上1以下で指定してください。',

      'weaponId.integer' => 'weaponIdは整数で入力してください。',
      'weaponId.exists' => '指定されたweaponIdは存在しません。',

      'itemId.integer' => 'itemIdは整数で入力してください。',
      'itemId.exists' => '指定されたitemIdは存在しません。',
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
