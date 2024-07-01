import { Router } from "express";
import {
  attackUser,
  createUser,
  getLeaderboardUsers,
  getUserInfo,
} from "../app/usersActions.js";
import { getUserByUsername } from "../db/users.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const leaderboardUsers = await getLeaderboardUsers();
    if (leaderboardUsers) {
      res.status(200).send(leaderboardUsers);
    } else {
      res.status(404).send({ message: "שגיאה בהבאת המשתמשים" });
    }
  } catch (err) {
    res.status(500).send({ message: "בעיה בהבאת הנתונים" });
  }
});

router.get("/:username/resources", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await getUserByUsername(username);

    if (user) {
      res.status(200).send({ resources: user.resources });
    } else {
      res.status(404).send({ message: "המשתמש אינו קיים" });
    }
  } catch (err) {
    res.status(500).send({ message: "בעיה בהבאת הנתונים" });
  }
});

router.get("/:username/info", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await getUserInfo(username);
    if (user) {
      res.status(200).send(user);
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

router.post("/:attackerUserame/attack/:targetUserame", async (req, res) => {
  try {
    const { attackerUserame, targetUserame } = req.params;
    const reportID = await attackUser(attackerUserame, targetUserame);
    res.status(200).send(JSON.stringify(reportID));
  } catch (err) {
    res.status(500).send({ message: "ההתקפה לא קרתה" });
  }
});

export default router;
