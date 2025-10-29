import { userHeal } from "@/api/user-heal";
import { addToasts } from "@/utils/add-toasts";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { useZxing } from "react-zxing";

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function UserHealModal({ isOpen, onOpenChange }: Props) {
  const { ref } = useZxing({
    paused: !isOpen,
    onDecodeResult(result) {
      const text = result.getText();
      const url = new URL(text, window.location.origin);

      if (url.pathname.startsWith("/login/")) {
        const userId = url.pathname.replace("/login/", "");
        userHeal(userId).then((res) => {
          addToasts(res.success, res.messages);
        });
      }
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        closeButton: "text-2xl",
      }}
      size="lg"
    >
      <ModalContent>
        <ModalHeader>ユーザー回復</ModalHeader>
        <ModalBody>
          <div className="py-6 relative">
            <video
              ref={ref}
              className="w-full aspect-square object-cover"
              autoPlay
              muted
              playsInline
            />
            <div className="absolute top-0 w-full h-full flex flex-col items-center justify-center">
              <p className="text-white text-center pb-4">
                QRコードをスキャンしてください。
              </p>
              <div className="w-64 lg:w-80 aspect-square border-2 border-white" />
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
