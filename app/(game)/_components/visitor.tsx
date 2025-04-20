"use client";

import { useGameVistorStore } from "@/store/game-visitor-store";
import { useEffect } from "react";

const VisitorPage = () => {
  const visitor = useGameVistorStore((state: any) => state.visitor);
  const setVisitor = useGameVistorStore((state: any) => state.setVisitor);

  useEffect(() => {
    if (!visitor) {
      const id = localStorage.getItem("visitor");
      if (id) {
        setVisitor(id);
      } else {
        const newId = crypto.randomUUID();
        localStorage.setItem("visitor", newId);
        setVisitor(newId);
      }
    }
  }, [visitor, setVisitor]);
  return <></>;
};

export default VisitorPage;
