import Weapon from "../schemas/weapon.js";

export const getAllWeapons = async () => {
  const weapons = await Weapon.find();
  return weapons;
};
