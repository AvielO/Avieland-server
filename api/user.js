import { Router } from "express";
import {
  attackUser,
  createUser,
  getLeaderboardUsers,
  getUserInfo,
  getUserReportsByPage,
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

router.get("/leaderboard/:page", authMiddleware, async (req, res) => {
  try {
    const { page } = req.params;
    const leaderboardInfo = await getLeaderboardUsers(page);
    if (leaderboardInfo) {
      res.status(200).send(leaderboardInfo);
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
      expires: new Date(Date.now() + 3600000),
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

router.get("/:username/reports/:page", authMiddleware, async (req, res) => {
  try {
    const { username, page } = req.params;
    const [reports, totalPages] = await getUserReportsByPage(username, page);
    res.status(200).send({ reports, totalPages });
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
