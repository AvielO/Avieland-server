import { getAllWeapons, getWeaponByID } from "../db/store.js";
import { getUserByUsername } from "../db/users.js";
import { convertDbMapToDict } from "../utils/general.js";

export const getStore = async () => {
  const weapons = await getAllWeapons();
  return weapons;
};

export const buyWeapons = async (weaponID, username, quantity) => {
  const weapon = await getWeaponByID(weaponID);
  const user = await getUserByUsername(username);

  if (!weapon) return;
  if (!user) return;
  const {
    copper: userCopper,
    silver: userSilver,
    gold: userGold,
  } = user.resources;
  const { copperPrice, silverPrice, goldPrice } = weapon;

  if (
    copperPrice * quantity > userCopper ||
    silverPrice * quantity > userSilver ||
    goldPrice * quantity > userGold
  )
    return;
  const updatedResources = {
    ...user.resources.toObject(),
    copper: userCopper - copperPrice * quantity,
    silver: userSilver - silverPrice * quantity,
    gold: userGold - goldPrice * quantity,
  };
  await user.updateOne({ $set: { resources: updatedResources } });

  let newQuantity;
  let newUserWeapon;
  let userWeapons = user.weapons;
  const userWeaponsIDs = Array.from(userWeapons.keys());

  if (userWeaponsIDs.includes(weaponID)) {
    const newQuantityObj = userWeapons.get(weaponID);
    newQuantityObj.quantity += +quantity;
    newQuantity = newQuantityObj.quantity;
    newUserWeapon = {
      [weaponID]: {
        ...newQuantityObj,
      },
    };
  } else {
    newUserWeapon = {
      [weaponID]: {
        name: weapon.name,
        attack: weapon.attack,
        defense: weapon.defense,
        quantity: newQuantity,
      },
    };
  }
  const weaponsDict = convertDbMapToDict(user.weapons);
  const updatedWeapons = {
    ...weaponsDict,
    ...newUserWeapon,
  };

  await user.updateOne({ $set: { weapons: updatedWeapons } });
  return { ...updatedResources, quantity: newQuantity };
};
