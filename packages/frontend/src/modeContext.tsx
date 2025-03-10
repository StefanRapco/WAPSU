import { ReactNode, createContext, useContext, useState } from 'react';

type ModeContextState = 'light' | 'dark';
const identifier = 'doSync.theme.mode';

const ModeContext = createContext<
  [ModeContextState, (newState: ModeContextState) => void] | undefined
>(undefined);

export function ModeContextProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ModeContextState>(
    ((): ModeContextState => {
      const mode = localStorage.getItem(identifier);

      if (mode == null) return 'light';
      if (mode === 'light') return 'light';
      if (mode === 'dark') return 'dark';

      throw new Error(`Unexpected state. Unknown mode: ${mode}`);
    })()
  );

  return (
    <ModeContext.Provider
      value={[
        mode,
        newMode => {
          localStorage.setItem(identifier, newMode);
          setMode(newMode);
        }
      ]}
    >
      {children}
    </ModeContext.Provider>
  );
}

export function useModeContext(): [
  {
    mode: ModeContextState;
    setMode: (newState: ModeContextState) => void;
  }
] {
  const context = useContext(ModeContext);

  if (context == null) throw Error('Missing <ModeContextProvider>!');

  const [mode, setMode] = context;

  return [
    {
      mode,
      setMode
    }
  ];
}
