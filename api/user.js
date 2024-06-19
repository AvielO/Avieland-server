import { Router } from "express";
import {
  isUserCredentialsCorrect,
  createUser,
  getUser,
} from "../app/usersActions.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const username = req.query.username;
    const password = req.query.password;

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

router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await getUser(username);

    if (user) {
      res.status(200).send({ resources: user.resources });
    } else {
      res.status(404).send({ message: "המשתמש אינו קיים" });
    }
  } catch (err) {
    res.status(500).send({ message: "בעיה בהבאת הנתונים" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { username, email, password, passwordAgain } = req.body;
    await createUser(username, email, password, passwordAgain);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send({ message: "המשתמש לא נוצר" });
  }
});

export default router;
