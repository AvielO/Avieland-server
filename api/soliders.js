import { Router } from "express";
import { hireSoliders } from "../app/soliderActions.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { username, solidersQuantity } = req.body;

    const { updatedSolidersQuantity, updatedResources } = await hireSoliders(
      username,
      solidersQuantity
    );
    res.status(200).send({ updatedSolidersQuantity, updatedResources });
  } catch (err) {
    res.status(500).send({ message: "לא היה ניתן להעסיק חיילים" });
  }
});

export default router;
