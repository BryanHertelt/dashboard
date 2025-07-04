"use client";
import { create } from "zustand";

export type SyncStatusItem = {
  status: "noSync" | "syncing" | "synced" | "error";
  holdingId: number;
};

export type SyncStoreState = {
  clearCache: boolean;
  syncStatus: SyncStatusItem[];
  setSyncStatus: (
    syncObjects: SyncStatusItem[] | ((prev: SyncStatusItem[]) => SyncStatusItem[])
  ) => void;
  setCache: (value: boolean) => void;
};

export const syncSingleHolding = create<SyncStoreState>((set) => ({
  clearCache: false,
  syncStatus: [],
  setSyncStatus: (syncObjects) =>
    set((state) => ({
      syncStatus: typeof syncObjects === "function" ? syncObjects(state.syncStatus) : syncObjects,
    })),
  setCache: (value) => set(() => ({ clearCache: value })),
}));