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

    const newUserData = await buyWeapons(weaponID, username, quantity);
    res.status(200).send(newUserData);
  } catch (err) {
    res.status(err.statusCode).send({ message: err.message });
  }
});

export default router;
