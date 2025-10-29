import { UserStoreRequest, userStore } from "@/api/user-store";
import { addToasts } from "@/utils/add-toasts";
import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { QRCodeSVG } from "qrcode.react";

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function UserStoreModal({ isOpen, onOpenChange }: Props) {
  const { register, handleSubmit, reset } = useForm<UserStoreRequest>();
  const [userId, setUserId] = useState("");
  const [loginUrl, setLoginUrl] = useState("");

  useEffect(() => {
    setLoginUrl(`${window.location.origin}/login/${userId}`);
  }, [userId]);

  const onSubmit = (data: UserStoreRequest) => {
    userStore(data).then((res) => {
      addToasts(res.success, res.messages);
      if (res.success) {
        setUserId(res.id);
        reset();
      }
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={() => {
        setUserId("");
        reset();
      }}
      classNames={{ closeButton: "text-2xl" }}
    >
      <ModalContent>
        <ModalHeader>ユーザー登録</ModalHeader>
        <ModalBody className="py-6">
          {userId ? (
            <div className="mx-auto">
              <QRCodeSVG
                value={loginUrl}
                size={256} // QRコードのサイズ
              />
            </div>
          ) : (
            <Form
              className="flex flex-col gap-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input label="ユーザー名" {...register("name")} />
              <Button className="bg-black text-white" fullWidth type="submit">
                登録
              </Button>
            </Form>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
