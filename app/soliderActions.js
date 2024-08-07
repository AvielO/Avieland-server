import { getUserByUsername } from "../db/users.js";
import ValidationError from "../utils/errorsTypes.js";

const SOLIDER_COST = 100;

export const hireSoliders = async (username, solidersQuantity) => {
  if (isNaN(solidersQuantity)) {
    throw new ValidationError("כמות החיילים חייבת להכיל מספר שלם", 400);
  } else if (solidersQuantity <= 0) {
    throw new ValidationError("כמות החיילים חייבת להכיל מספר גדול מ0", 400);
  }
  const user = await getUserByUsername(username);
  if (!user) return;

  const { gold } = user.resources;
  const soliderCost = solidersQuantity * SOLIDER_COST;

  const goldRemaining = gold - soliderCost;

  if (goldRemaining >= 0) {
    user.resources.gold = goldRemaining;
    user.soliders += +solidersQuantity;

    await user.save();

    const updatedSolidersQuantity = user.soliders;
    const updatedResources = {
      copper: user.resources.copper,
      silver: user.resources.silver,
      gold: user.resources.gold,
      diamond: user.resources.diamond,
    };

    return { updatedSolidersQuantity, updatedResources };
  } else {
    throw new ValidationError("אין לך מספיק משאבים", 403);
  }
};
