import { getUserByUsername } from "../db/users.js";

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
      if (user.resources.copper >= copperToDeposit) {
        user.bank.copper += +copperToDeposit;
        user.resources.copper -= +copperToDeposit;
      }
      break;
    }
    case "silver": {
      if (user.resources.silver >= silverToDeposit) {
        user.bank.silver += +silverToDeposit;
        user.resources.silver -= +silverToDeposit;
      }
      break;
    }
    case "gold": {
      if (user.resources.gold >= goldToDeposit) {
        user.bank.gold += +goldToDeposit;
        user.resources.gold -= +goldToDeposit;
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
      if (user.bank.copper >= copperToWithdraw) {
        user.bank.copper -= +copperToWithdraw;
        user.resources.copper += +copperToWithdraw;
      }
      break;
    }
    case "silver": {
      if (user.bank.silver >= silverToWithdraw) {
        user.bank.silver -= +silverToWithdraw;
        user.resources.silver += +silverToWithdraw;
      }
      break;
    }
    case "gold": {
      if (user.bank.gold >= goldToWithdraw) {
        user.bank.gold -= +goldToWithdraw;
        user.resources.gold += +goldToWithdraw;
      }
      break;
    }
  }
  await user.save();

  return { updatedResources: user.resources, updatedBankResources: user.bank };
};
