import { Modal, ModalProps } from "@mantine/core";

export function MantineModal(props: ModalProps) {
  return <Modal {...props} className="[&_*::-webkit-scrollbar]:hidden" />;
}
