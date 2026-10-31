import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = {
  role: "admin" | "student";
  id: string;
  name: string;
  email: string;
  department?: string;
};

type State = {
  currentUser: AuthUser | null;
  token: string | null;
};
type Actions = {
  setSession: (user: AuthUser, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<State & Actions>()(
  persist(
    (set) => ({
      currentUser: null,
      token: null,
      setSession: (currentUser, token) => set({ currentUser, token }),
      logout: () => set({ currentUser: null, token: null }),
    }),
    { name: "libraryhub-auth" },
  ),
);
