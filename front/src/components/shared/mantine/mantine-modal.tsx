import { Modal, ModalProps } from "@mantine/core";
import clsx from "clsx";

export function MantineModal(props: ModalProps) {
  return (
    <Modal
      {...props}
      classNames={{
        ...props.classNames,
        content: clsx(
          props.classNames?.content,
          "[&::-webkit-scrollbar]:hidden"
        ),
      }}
    />
  );
}
