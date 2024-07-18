import { Router } from "express";
import { isUserCredentialsCorrect } from "../app/authActions.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { username, password } = req.query;

    const isUserExist = await isUserCredentialsCorrect(username, password);
    if (isUserExist) {
      res.sendStatus(200);
    } else {
      res.status(404).send({ message: "שם המשתמש או הסיסמה אינם נכונים!" });
    }
  } catch (err) {
    res.status(500).send({ message: "בעיה בהבאת הנתונים" });
  }
});

router.get("/checking", async (req, res) => {
  try {
    res.send(<h1>NoU</h1>)
  } catch (err) {
    res.status(500).send({ message: "בעיה בהבאת הנתונים" });
  }
});

export default router;
