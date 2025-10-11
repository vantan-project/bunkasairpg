import Image from "next/image";

export function UserStatus() {
  return (
    <div className="relative w-[80%] h-24">
      <Image
        className="w-full h-full"
        src="/user-status-backgrand.png"
        alt=""
        fill
      />
      user status
    </div>
  );
}
