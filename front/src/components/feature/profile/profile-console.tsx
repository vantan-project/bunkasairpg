export type BattleConsoleProps = {
    children: React.ReactNode;
    setClose: (close: boolean) => void;
  };
  
  export function ProfileConsole({ children, setClose }: BattleConsoleProps) {
    return (
      <div
          className="fixed w-full h-full z-30"
          onClick={() => {
            setClose(false);
          }}
        >
          <div
            className="fixed bottom-0 w-full bg-black/70 text-white p-2 z-20"
            onClick={(e) => e.stopPropagation()}
          >
        {children}
      </div>
      </div>
    );
  }
  