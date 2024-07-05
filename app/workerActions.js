import { getUserByUsername } from "../db/users.js";

export const hireWorkers = async (
  username,
  copperWorkersQuantity,
  silverWorkersQuantity,
  goldWorkersQuantity
) => {
  if (
    isNaN(copperWorkersQuantity) ||
    isNaN(silverWorkersQuantity) ||
    isNaN(goldWorkersQuantity)
  ) {
    console.log("H")
    throw new Error("Not a number");
  }
  const user = await getUserByUsername(username);
  if (!user) return;

  user.workers.copper += +copperWorkersQuantity;
  user.workers.silver += +silverWorkersQuantity;
  user.workers.gold += +goldWorkersQuantity;

  await user.save();
};
