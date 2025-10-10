"use client";

import { useForm } from "react-hook-form";
import { AuthAdminLoginRequset, authAdminLogin } from "@/api/auth-admin-login";
import { Form, Button, Input } from "@heroui/react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { MailIcon } from "@/components/shared/icons/mail-icon";
import { LockIcon } from "@/components/shared/icons/lock-icon";
import "../admin.module.css";
import { addToasts } from "@/utils/add-toasts";
import { useEffect } from "react";
import { adminToken } from "@/api/admin-token";

export default function () {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthAdminLoginRequset>();

  const onSubmit = async (data: AuthAdminLoginRequset) => {
    const res = await authAdminLogin(data);

    if (res.success) {
      Cookies.set("authToken", res.token);
      router.push("/admin/item");
    }

    addToasts(res.success, res.messages);
  };

  const tokenApi = async () => {
    const res = await adminToken();
    if (res.success) {
      router.push("/admin/monster");
    }
  };
  useEffect(() => {
    tokenApi();
  }, []);

  return (
    <div className="h-screen grid place-items-center w-full">
      <div className="relative rounded-2xl overflow-hidden bg-gray-900 px-28 py-24 flex flex-col items-center">
        <div className="absolute top-0 w-full h-2 bg-[linear-gradient(90deg,hsl(194,74%,56%),hsl(266,74%,56%),hsl(338,74%,56%),hsl(50,74%,56%),hsl(122,74%,56%))]" />
        <h1 className="text-4xl font-bold text-white pb-4 px-2 border-b-6 [border-image:linear-gradient(90deg,hsl(194,74%,56%),hsl(266,74%,56%),hsl(338,74%,56%),hsl(50,74%,56%),hsl(122,74%,56%))_1] text-center">
          Login
        </h1>
        <Form onSubmit={handleSubmit(onSubmit)} className="pt-10">
          <Input
            classNames={{
              base: "w-80",
              input: [
                "group-data-[has-value=true]:text-white",
                "[&:-webkit-autofill]:![-webkit-text-fill-color:white]",
              ],
              inputWrapper: [
                "after:bg-[linear-gradient(90deg,hsl(194,74%,56%),hsl(266,74%,56%),hsl(338,74%,56%),hsl(50,74%,56%),hsl(122,74%,56%))]",
                "after:w-full",
              ],
              label: "!text-white",
            }}
            type="email"
            labelPlacement="outside-top"
            variant="underlined"
            label="Email"
            endContent={<MailIcon className="text-white" />}
            {...register("email", {
              required: "メールアドレスを入力してください",
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
          <Input
            classNames={{
              base: "w-80 pt-4",
              input: [
                "group-data-[has-value=true]:text-white",
                "[&:-webkit-autofill]:![-webkit-text-fill-color:white]",
              ],
              inputWrapper: [
                "after:bg-[linear-gradient(90deg,hsl(194,74%,56%),hsl(266,74%,56%),hsl(338,74%,56%),hsl(50,74%,56%),hsl(122,74%,56%))]",
                "after:w-full",
              ],
              label: "!text-white",
            }}
            labelPlacement="outside-top"
            type="password"
            label="Password"
            variant="underlined"
            endContent={<LockIcon className="text-white" />}
            {...register("password", {
              required: "パスワードを入力してください",
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="
                            mt-14
                            text-center
                            block 
                            bg-[linear-gradient(90deg,hsl(194,74%,56%),hsl(266,74%,56%),hsl(338,74%,56%),hsl(50,74%,56%),hsl(122,74%,56%))]
                            w-full 
                            rounded-full 
                            h-12
                            text-white 
                            font-bold 
                            text-lg 
                            shadow-[2px_2px_4px_0_rgba(240,240,240,0.25)_inset,-2px_-2px_4px_0_rgba(240,240,240,0.25)_inset]"
          >
            login
          </Button>
        </Form>
      </div>
    </div>
  );
}
