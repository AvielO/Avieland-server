import { getUserByUsername } from "../db/users.js";
import ValidationError from "../utils/errorsTypes.js";

export const depositResources = async (
  username,
  resourceName,
  copperToDeposit,
  silverToDeposit,
  goldToDeposit
) => {
  const user = await getUserByUsername(username);
  if (!user) return;

  switch (resourceName) {
    case "copper": {
      if (copperToDeposit <= 0)
        throw new ValidationError(
          "כמות נחושת להפקדה אמורה להכיל מספר גדול מ0",
          400
        );
      if (user.resources.copper >= copperToDeposit) {
        user.bank.copper += +copperToDeposit;
        user.resources.copper -= +copperToDeposit;
      } else {
        throw new ValidationError("אין לך מספיק נחושת להפקדה", 403);
      }
      break;
    }
    case "silver": {
      if (silverToDeposit <= 0)
        throw new ValidationError(
          "כמות כסף להפקדה אמורה להכיל מספר גדול מ0",
          400
        );
      if (user.resources.silver >= silverToDeposit) {
        user.bank.silver += +silverToDeposit;
        user.resources.silver -= +silverToDeposit;
      } else {
        throw new ValidationError("אין לך מספיק כסף להפקדה", 403);
      }
      break;
    }
    case "gold": {
      if (goldToDeposit <= 0)
        throw new ValidationError(
          "כמות זהב להפקדה אמורה להכיל מספר גדול מ0",
          400
        );
      if (user.resources.gold >= goldToDeposit) {
        user.bank.gold += +goldToDeposit;
        user.resources.gold -= +goldToDeposit;
      } else {
        throw new ValidationError("אין לך מספיק זהב להפקדה", 403);
      }
      break;
    }
  }
  await user.save();

  return { updatedResources: user.resources, updatedBankResources: user.bank };
};

export const withdrawResources = async (
  username,
  resourceName,
  copperToWithdraw,
  silverToWithdraw,
  goldToWithdraw
) => {
  const user = await getUserByUsername(username);
  if (!user) return;

  switch (resourceName) {
    case "copper": {
      if (copperToWithdraw <= 0)
        throw new ValidationError(
          "כמות הנחושת למשיכה אמורה להכיל מספר גדול מ0",
          400
        );
      if (user.bank.copper >= copperToWithdraw) {
        user.bank.copper -= +copperToWithdraw;
        user.resources.copper += +copperToWithdraw;
      } else {
        throw new ValidationError("אין לך מספיק נחושת למשיכה", 403);
      }
      break;
    }
    case "silver": {
      if (silverToWithdraw <= 0)
        throw new ValidationError(
          "כמות הכסף למשיכה אמורה להכיל מספר גדול מ0",
          400
        );
      if (user.bank.silver >= silverToWithdraw) {
        user.bank.silver -= +silverToWithdraw;
        user.resources.silver += +silverToWithdraw;
      } else {
        throw new ValidationError("אין לך מספיק כסף למשיכה", 403);
      }
      break;
    }
    case "gold": {
      if (goldToWithdraw <= 0)
        throw new ValidationError(
          "כמות הזהב למשיכה אמורה להכיל מספר גדול מ0",
          400
        );
      if (user.bank.gold >= goldToWithdraw) {
        user.bank.gold -= +goldToWithdraw;
        user.resources.gold += +goldToWithdraw;
      } else {
        throw new ValidationError("אין לך מספיק זהב למשיכה", 403);
      }
      break;
    }
  }
  await user.save();

  return { updatedResources: user.resources, updatedBankResources: user.bank };
};
