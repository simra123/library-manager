import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Profile = {
  name: string;
  email: string;
  phone: string;
  department?: string;
  avatar: string; 
};

type State = { profiles: Record<string, Profile> };
type Actions = {
  updateProfile: (userId: string, patch: Partial<Profile>) => void;
  ensureProfile: (userId: string, initial: Profile) => void;
};

const noopStorage: Storage = {
  length: 0,
  clear: () => {},
  getItem: () => null,
  key: () => null,
  removeItem: () => {},
  setItem: () => {},
};
const safeStorage = createJSONStorage(() =>
  typeof window === "undefined" ? noopStorage : window.localStorage,
);

export const useProfileStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      profiles: {},
      updateProfile: (userId, patch) =>
        set((s) => ({
          profiles: {
            ...s.profiles,
            [userId]: {
              ...(s.profiles[userId] ?? { name: "", email: "", phone: "", avatar: "" }),
              ...patch,
            },
          },
        })),
      ensureProfile: (userId, initial) => {
        if (!get().profiles[userId]) {
          set((s) => ({ profiles: { ...s.profiles, [userId]: initial } }));
        }
      },
    }),
    {
      name: "libraryhub-profiles",
      storage: safeStorage,
      partialize: (s) => ({ profiles: s.profiles }),
    },
  ),
);

export function useProfileHydrated(): boolean {
  const [hydrated, setHydrated] = useState(
    () => useProfileStore.persist.hasHydrated(),
  );
  useEffect(() => {
    const unsubFinish = useProfileStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    if (useProfileStore.persist.hasHydrated()) setHydrated(true);
    return () => {
      unsubFinish();
    };
  }, []);
  return hydrated;
}
