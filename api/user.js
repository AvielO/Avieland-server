import { Router } from "express";
import {
  attackUser,
  createUser,
  getLeaderboardUsers,
  getUserInfo,
  getUserReports,
  getUserWithExtraInfo,
} from "../app/usersActions.js";
import { getAllUsers, getUserByUsername } from "../db/users.js";
import { authMiddleware } from "../utils/authMiddleware.js";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const allUsers = await getAllUsers();
    if (allUsers) {
      res.status(200).send(allUsers);
    } else {
      res.status(404).send({ message: "שגיאה בהבאת המשתמשים" });
    }
  } catch (err) {
    res.status(500).send({ message: "בעיה בהבאת הנתונים" });
  }
});

router.get("/leaderboard", authMiddleware, async (req, res) => {
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

router.get("/:username", authMiddleware, async (req, res) => {
  try {
    const { username } = req.params;
    const userExpended = await getUserWithExtraInfo(username);
    res.status(200).send(userExpended);
  } catch (err) {
    res.status(500).send({ message: "בעיה בהבאת הנתונים" });
  }
});

router.get("/:username/resources", authMiddleware, async (req, res) => {
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

router.get("/:username/info", authMiddleware, async (req, res) => {
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
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(200).send({ message: "Register successful", user: req.user });
  } catch (err) {
    res.status(err.statusCode).send({ message: err.message });
  }
});

router.post(
  "/:attackerUserame/attack/:targetUserame",
  authMiddleware,
  async (req, res) => {
    try {
      const { attackerUserame, targetUserame } = req.params;
      const [reportID, updatedResources] = await attackUser(
        attackerUserame,
        targetUserame
      );
      res.status(200).send({ reportID, updatedResources });
    } catch (err) {
      res.status(500).send({ message: "ההתקפה לא קרתה" });
    }
  }
);

router.get("/:username/reports", authMiddleware, async (req, res) => {
  try {
    const { username } = req.params;
    const reports = await getUserReports(username);
    res.status(200).send({ reports });
  } catch (err) {
    res.status(500).send({ message: "לא ניתן לקבל את הדוחות" });
  }
});

router.get("/:username/bank", authMiddleware, async (req, res) => {
  try {
    const { username } = req.params;
    const { bank } = await getUserByUsername(username);
    res.status(200).send({ bank });
  } catch (err) {
    res.status(500).send({ message: "לא ניתן לקבל את הדוחות" });
  }
});

export default router;
