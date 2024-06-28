import Weapon from "../schemas/weapon.js";

export const getAllWeapons = async () => {
  const weapons = await Weapon.find();
  return weapons;
};

export const getWeaponByID = async (weaponID) => {
  const weapon = await Weapon.findOne({ id: weaponID });
  return weapon;
};
