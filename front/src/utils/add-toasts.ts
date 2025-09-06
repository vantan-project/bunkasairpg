import { addToast } from "@heroui/react";

export function addToasts(success: boolean, messages: string[]) {
  const color = success ? "success" : "warning";
  messages.forEach((message, index) => {
    setTimeout(() => {
      addToast({ title: message, color });
    }, index * 1000);
  });
}
