import { Router } from "express";
import { getStore } from "../app/storeActions.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const storeWeapons = await getStore();
    res.status(200).send(storeWeapons);
  } catch (err) {
    res.status(500).send({ message: "בעיה בהבאת הנתונים" });
  }
});

export default router;
