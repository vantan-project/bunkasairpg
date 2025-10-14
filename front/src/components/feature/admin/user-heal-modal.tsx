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
      classNames={{ closeButton: "text-2xl" }}
      size="xl"
    >
      <ModalContent>
        <ModalHeader>ユーザー回復</ModalHeader>
        <ModalBody className="py-6 relative">
          <video
            ref={ref}
            className="w-full aspect-square object-cover"
            autoPlay
            muted
            playsInline
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <p className="text-white text-center pb-4">
              QRコードをスキャンしてください。
            </p>
            <div className="w-80 h-80 border-2 border-white" />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
