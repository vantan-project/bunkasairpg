type Props = {
  level: number;
  setLevelUpModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCameraAccessModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export function LevelUpModal({
  level,
  setLevelUpModal,
  setCameraAccessModal,
}: Props) {
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/60 bg-cover bg-opacity-50 z-50 bg-center"
      style={{ backgroundImage: `url(${"/bg-level.png"})` }}
      onClick={() => {
        setLevelUpModal(false);
        setCameraAccessModal(true);
      }}
    >
      <div className="bg-[#1A1207] w-full h-[40%] border-y-3 border-white flex flex-col items-center justify-between py-[15%]">
        <div className="text-[#F9DA43] text-5xl flex flex-col items-center justify-center font-abhaya text-shadow-outline">
          <div>Level</div>
          <div>UP</div>
        </div>
        <div className="text-2xl text-white">Levelが{level}になりました</div>
      </div>
    </div>
  );
}
