import { usePathname, useRouter } from "next/navigation";
import { useZxing } from "react-zxing";

export function BgCamera() {
  const router = useRouter();
  const pathname = usePathname();
  const { ref } = useZxing({
    onDecodeResult(result) {
      if (pathname === "/camera") return;
      const text = result.getText();

      const url = new URL(text, window.location.origin);
      const currentOrigin = window.location.origin;

      if (url.origin === currentOrigin && url.pathname.startsWith("/battle")) {
        router.push(url.pathname + url.search + url.hash);
      }
    },
  });

  return (
    <div className="fixed inset-0 -z-10">
      <video
        ref={ref}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />
    </div>
  );
}
