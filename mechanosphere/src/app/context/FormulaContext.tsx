import React, { createContext, useContext, useState, ReactNode } from 'react';

type FormulaSetting = {
    symbol: string;
    name: string;
    key: string;
}

interface FormulaContextType {
  selectedMachineEnv: FormulaSetting;
  setSelectedMachineEnv: React.Dispatch<React.SetStateAction<FormulaSetting>>;
  selectedConstraints: FormulaSetting[];
  setSelectedConstraints: React.Dispatch<React.SetStateAction<FormulaSetting[]>>;
  selectedObjective: FormulaSetting;
  setSelectedObjective: React.Dispatch<React.SetStateAction<FormulaSetting>>;
}

const FormulaContext = createContext<FormulaContextType | undefined>(undefined);

export const FormulaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedMachineEnv, setSelectedMachineEnv] = useState<{ symbol: string; name: string; key: string }>({ symbol: '\\alpha', name: '', key: '' });
  const [selectedConstraints, setSelectedConstraints] = useState<{ symbol: string; name: string; key: string }[]>([]);
  const [selectedObjective, setSelectedObjective] = useState<{ symbol: string; name: string; key: string }>({ symbol: '\\gamma', name: '', key: '' });

  return (
    <FormulaContext.Provider value={{ selectedMachineEnv, setSelectedMachineEnv, selectedConstraints, setSelectedConstraints, selectedObjective, setSelectedObjective }}>
      {children}
    </FormulaContext.Provider>
  );
};

export const useFormula = () => {
  const context = useContext(FormulaContext);
  if (!context) {
    throw new Error("useFormula must be used within a FormulaProvider");
  }
  return context;
}; 