import { Router } from "express";
import { getUniqueSenders } from "../app/chatActions.js";

const router = Router();

router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const uniqueSenders = await getUniqueSenders(username);
    res.status(200).send({ uniqueSenders });
  } catch (err) {
    res.status(500).send({ message: "לא היה ניתן להפקיד את הכסף" });
  }
});

export default router;
