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

    await hireWorkers(
      username,
      copperWorkersQuantity,
      silverWorkersQuantity,
      goldWorkersQuantity
    );
  } catch (err) {
    res.status(500).send({ message: "לא היה ניתן להעסיק עובדים" });
  }
});

export default router;
