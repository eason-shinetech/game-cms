import { create } from "zustand";

export const useGameVistorStore = create((set) => ({
  visitor: "",
  setVisitor: (visitor: string) => set(() => ({ visitor })),
}));
