import { Router } from "express";
import { hireWorkers } from "../app/workerActions.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const {
      username,
      copperWorkersQuantity,
      silverWorkersQuantity,
      goldWorkersQuantity,
    } = req.body;

    const { updatedWorkersQuantity, updatedResources } = await hireWorkers(
      username,
      copperWorkersQuantity,
      silverWorkersQuantity,
      goldWorkersQuantity
    );
    res.status(200).send({ updatedWorkersQuantity, updatedResources });
  } catch (err) {
    res.status(err.statusCode).send({ message: err.message });
  }
});

export default router;
