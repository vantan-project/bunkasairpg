import Image from "next/image";

export default function Ranking() {
  return (
    <div
      className="h-screen w-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center font-dotgothic"
      style={{ backgroundImage: `url(${"/bg-ranking.png"})` }}
    >
      <h1 className="text-xl">ランキング</h1>
      <Image
        className="w-[70%] h-[2px]"
        width={100}
        height={100}
        src="/profile-border.png"
        alt="マイページの下線"
      />
      <div className="[clip-path:polygon(13%_0,90%_0,100%_19%,100%_100%,0_100%,0_19%)] w-[40%] h-12 bg-gradient-to-b from-[#E0DDD8] to-[#DFD7D5]"></div>
    </div>
  );
}
