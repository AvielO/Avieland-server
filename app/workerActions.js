import { getUserByUsername } from "../db/users.js";

const COPPER_WORKER_COST = 100;
const SILVER_WORKER_COST = 100;
const GOLD_WORKER_COST = 100;

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
    console.log("H");
    throw new Error("Not a number");
  }
  const user = await getUserByUsername(username);
  if (!user) return;

  const copperCost = copperWorkersQuantity * COPPER_WORKER_COST;
  const silverCost = silverWorkersQuantity * SILVER_WORKER_COST;
  const goldCost = goldWorkersQuantity * GOLD_WORKER_COST;

  const { copper, silver, gold } = user.resources;

  const copperRemaining = copper - copperCost;
  const silverRemaining = silver - silverCost;
  const goldRemaining = gold - goldCost;

  if (copperRemaining >= 0 && silverRemaining >= 0 && goldRemaining >= 0) {
    user.resources.copper = copperRemaining;
    user.resources.silver = silverRemaining;
    user.resources.gold = goldRemaining;

    user.workers.copper += +copperWorkersQuantity;
    user.workers.silver += +silverWorkersQuantity;
    user.workers.gold += +goldWorkersQuantity;

    await user.save();
  } else {
    throw new Error("Have no enough resources");
  }
};
