import { Router } from "express";
import { createUser, getUser, getUsers } from "../app/usersActions.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await getUsers();
    if (users) {
      res.status(200).send(users);
    } else {
      res.status(404).send({ message: "שגיאה בהבאת המשתמשים" });
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
    const { username, email, password, passwordAgain, type } = req.body;
    await createUser(username, email, password, passwordAgain, type);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send({ message: "המשתמש לא נוצר" });
  }
});

export default router;
