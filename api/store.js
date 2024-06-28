import { Router } from "express";
import { getStore, buyWeapons } from "../app/storeActions.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const storeWeapons = await getStore();
    res.status(200).send(storeWeapons);
  } catch (err) {
    res.status(500).send({ message: "בעיה בהבאת הנתונים" });
  }
});

router.post("/:weaponID", async (req, res) => {
  try {
    const { weaponID } = req.params;
    const { username, quantity } = req.body;

    await buyWeapons(weaponID, username, quantity);
  } catch (err) {
    res.status(500).send({ message: "בעיה בהבאת הנתונים" });
  }
});

export default router;
