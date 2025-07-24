"use client";

import { useRouter } from "next/navigation";
import { useZxing } from "react-zxing";

export default function Page() {
  const router = useRouter();
  const { ref } = useZxing({
    onDecodeResult(result) {
      window.location.assign(result.getText());
    },
  });

  return (
    <div>
      <video ref={ref} />
    </div>
  );
};
