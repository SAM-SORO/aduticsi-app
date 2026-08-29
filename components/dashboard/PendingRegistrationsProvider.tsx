"use client";

import { createContext, useContext } from "react";

const PendingContext = createContext(0);

export function PendingRegistrationsProvider({
  count,
  children,
}: {
  count: number;
  children: React.ReactNode;
}) {
  return <PendingContext.Provider value={count}>{children}</PendingContext.Provider>;
}

/** Nombre de demandes d'enregistrement en attente, 0 hors super-administration. */
export function usePendingRegistrations() {
  return useContext(PendingContext);
}
