import { Arguments } from "../types";

export const link = ({ action }: Arguments): void => {
  const link = action.trim();
  window.open(link);
}; 