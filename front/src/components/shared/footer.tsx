import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <div className="fixed bottom-0 w-full">
      <div className="relative h-24">
        <div className="absolute z-10 w-full h-24 flex justify-center overflow-hidden">
          <Image
            className="w-[110%] h-full"
            width={100}
            height={100}
            src="/tab-bar-backgrand.png"
            alt="tab-bar"
          />
        </div>
        <div className="absolute bottom-5 z-20 w-full flex justify-center gap-3">
          <Link className="w-24 h-auto" href="/camera">
            <Image
              className="w-full h-full"
              width={100}
              height={100}
              src="/btn-home.png"
              alt="home"
            />
          </Link>
          <Link className="w-24 h-auto" href="/encyclopedia">
            <Image
              className="w-full h-full"
              width={100}
              height={100}
              src="/btn-encyclopedia.png"
              alt="home"
            />
          </Link>
          <Link className="w-24 h-auto" href="/profile">
            <Image
              className="w-full h-full"
              width={100}
              height={100}
              src="/btn-profile.png"
              alt="home"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
