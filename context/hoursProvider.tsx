"use client";
import { Extras } from "@prisma/client";
import { createContext, useContext, useState } from "react";

interface Provider {
  extra: Extras | null;
  setExtra: React.Dispatch<React.SetStateAction<Extras | null>>;
}

const ExtraProviderValues: Provider = {
  extra: null,
  setExtra: () => "",
};

const ExtraContext = createContext<Provider>(ExtraProviderValues);

export function useExtra() {
  return useContext(ExtraContext);
}

type Props = {
  children: React.ReactNode;
};

export function ExtraProvider({ children }: Props) {
  const [extra, setExtra] = useState<Extras | null>(null);

  return (
    <>
      <ExtraContext.Provider value={{ extra, setExtra }}>
        {children}
      </ExtraContext.Provider>
    </>
  );
}
