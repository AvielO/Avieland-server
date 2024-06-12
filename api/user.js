import { Router } from "express";
import { isUserCredentialsCorrect, createUser } from "../app/usersActions.js";

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
    console.log(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const { username, email, password, passwordAgain } = req.body;

    const isUserCreated = await createUser(
      username,
      email,
      password,
      passwordAgain
    );
    if (isUserCreated) {
      res.sendStatus(200);
    } else {
      res.status(500).send({ message: "המשתמש לא נוצר" });
    }
  } catch (err) {
    console.log(err);
  }
});

export default router;
