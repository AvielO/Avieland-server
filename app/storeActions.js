import { getAllWeapons } from "../db/store.js";

export const getStore = async () => {
  const weapons = await getAllWeapons();
  return weapons;
};
