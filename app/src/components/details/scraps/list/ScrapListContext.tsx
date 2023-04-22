import React, { createContext, useContext, useState } from "react";

export interface IScrapListContext {
  setInputRef: (
    index: number,
    ref: React.MutableRefObject<HTMLInputElement>
  ) => void;
  giveFocus: (index: number) => void;
}

const ScrapListContext = createContext<IScrapListContext>({
  giveFocus: null,
  setInputRef: null,
});

export const useScrapListContext = () => {
  return useContext(ScrapListContext);
};

export const ScrapListContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [inputRefs, setInputRefs] = useState<
    React.MutableRefObject<HTMLInputElement>[]
  >([]);

  const contextValue: IScrapListContext = {
    setInputRef: (index, ref) => {
      const updatedInputRefs = [...inputRefs];
      updatedInputRefs[index] = ref;
      setInputRefs(updatedInputRefs);
    },
    giveFocus: (index) => {
      inputRefs[index].current.focus();
    },
  };

  return (
    <ScrapListContext.Provider value={contextValue}>
      {children}
    </ScrapListContext.Provider>
  );
};
