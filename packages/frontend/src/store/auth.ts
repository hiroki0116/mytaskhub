import { atom } from "jotai";
import { User } from "@/types/auth";
import { getUser } from "@/lib/auth";

export const userAtom = atom<User | null>(getUser());

export const isAuthenticatedAtom = atom((get) => {
  const user = get(userAtom);
  return !!user;
});
