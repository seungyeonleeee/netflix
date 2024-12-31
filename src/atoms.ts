import { atom } from "recoil";
import { GetMoviesResult } from "./api";
import { GetSeriesResult } from "./api";

interface ModalState {
  dataId: number | null;
  data: GetMoviesResult | GetSeriesResult | null;
}

export interface UserData {
  userId: string;
  password: string;
  passwordCheck?: string;
  email: string;
}

export const userDataAtom = atom<UserData>({
  key: "userData",
  default: {
    userId: "",
    password: "",
    email: "",
  },
});

export const isModalAtom = atom<ModalState>({
  key: "modalState",
  default: {
    dataId: null,
    data: null,
  },
});
