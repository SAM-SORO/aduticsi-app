"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "aduti.sidebar.collapsed";

const listeners = new Set<() => void>();
let collapsed: boolean | null = null;

function read() {
  if (collapsed === null) {
    try {
      collapsed = window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      collapsed = false;
    }
  }
  return collapsed;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Le serveur rend toujours la barre depliee : l'hydratation part de cet etat,
// puis React relit le snapshot client.
function getServerSnapshot() {
  return false;
}

export function useSidebarCollapsed(): [boolean, () => void] {
  const value = useSyncExternalStore(subscribe, read, getServerSnapshot);

  const toggle = useCallback(() => {
    collapsed = !read();
    try {
      window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      // Stockage indisponible : la preference ne survit pas au rechargement.
    }
    listeners.forEach((listener) => listener());
  }, []);

  return [value, toggle];
}
