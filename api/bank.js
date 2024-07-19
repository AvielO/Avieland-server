import { Router } from "express";
import { depositResources, withdrawResources } from "../app/bankActions.js";

const router = Router();

router.post("/:username/deposit", async (req, res) => {
  try {
    const { username } = req.params;
    const { resourceName, copperToDeposit, silverToDeposit, goldToDeposit } =
      req.body;
    const { updatedResources, updatedBankResources } = await depositResources(
      username,
      resourceName,
      copperToDeposit,
      silverToDeposit,
      goldToDeposit
    );
    res.status(200).send({ updatedResources, updatedBankResources });
  } catch (err) {
    res.status(err.statusCode).send({ message: err.message });
  }
});

router.post("/:username/withdraw", async (req, res) => {
  try {
    const { username } = req.params;
    const { resourceName, copperToWithdraw, silverToWithdraw, goldToWithdraw } =
      req.body;
    const { updatedResources, updatedBankResources } = await withdrawResources(
      username,
      resourceName,
      copperToWithdraw,
      silverToWithdraw,
      goldToWithdraw
    );
    res.status(200).send({ updatedResources, updatedBankResources });
  } catch (err) {
    res.status(err.statusCode).send({ message: err.message });
  }
});

export default router;
