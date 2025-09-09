"use client";

import { useForm } from "react-hook-form";
import { AuthAdminLoginRequset, authAdminLogin, AuthAdminLoginResponse } from "@/api/auth-admin-login";
import {
    Form,
    Button,
    Input
} from "@heroui/react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { MailIcon } from "@/components/shared/icons/mail-icon";
import { LockIcon } from "@/components/shared/icons/lock-icon";
import "../admin.module.css"


export default function () {
    const router = useRouter();
    const [errMessages, setErrMessage] = useState<string>("");
    const { register, handleSubmit, formState: {
        errors, isSubmitting
    } } = useForm<AuthAdminLoginRequset>()

    useEffect(() => {
        // tokenがあればリダイレクト
        const token = Cookies.get('authToken');
        if (token) {
            router.push("/admin/item");
        }
    }, [router])

    const onSubmit = async (data: AuthAdminLoginRequset) => {
        try {
            const res = await authAdminLogin(data)

            if (res.success) {
                Cookies.set('authToken', res.token, {
                    expires: 3,
                    // これはローカルじゃ使えないからコメントアウト
                    // secure: true,
                    sameSite: 'strict'
                });
                setErrMessage("");
                router.push("/admin/item");
            } else {
                setErrMessage(res.messages.join(','));
            }
        } catch (error) {
            setErrMessage("ログインに失敗しました。")
        }
    }

    return (
        <div className="h-screen grid place-items-center w-full">
            <div className="rounded-2xl bg-gray-900 px-28 py-24 border border-t-purple-800 border-t-8 flex flex-col items-center">
                <h1 className="text-4xl font-bold text-white pb-4 px-2 border-b-6 border-purple-800 text-center">
                    Login
                </h1>
                <Form onSubmit={handleSubmit(onSubmit)} className="pt-10">
                    <Input
                        classNames={{
                            base: "w-80",
                            input: "group-data-[has-value=true]:text-white",
                            inputWrapper: [
                                "after:bg-purple-800",
                                "after:w-full"
                            ],
                            label: "text-white",
                        }}
                        type="email"
                        variant="underlined"
                        label="Email"
                        endContent={<MailIcon className="text-white" />}
                        {...register("email", { required: "メールアドレスを入力してください" })}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                    <Input
                        classNames={{
                            base: "w-80 pt-4",
                            input: "group-data-[has-value=true]:text-white",
                            inputWrapper: [
                                "after:bg-purple-800",
                                "after:w-full"
                            ],
                            label: "text-white",
                        }}
                        type="password"
                        label="Password"
                        variant="underlined"
                        endContent={<LockIcon className="text-white" />}
                        {...register("password", { required: "パスワードを入力してください" })}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                        className="
                            mt-14
                            text-center
                            block 
                            bg-gradient-to-b from-purple-800 via-purple-500 to-purple-800 
                            w-full 
                            rounded-full 
                            h-12
                            text-white 
                            font-bold 
                            shadow-[2px_2px_4px_0_rgba(240,240,240,0.25)_inset,-2px_-2px_4px_0_rgba(240,240,240,0.25)_inset]"
                    >
                        login
                    </Button>
                    {errMessages && (
                        <div className="text-red-500 text-sm mt-4"> {errMessages}</div>
                    )}
                </Form>
            </div >
        </div >
    )
}
