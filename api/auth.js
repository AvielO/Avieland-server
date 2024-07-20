import { Router } from "express";
import { isUserCredentialsCorrect } from "../app/authActions.js";
import { passwordValidation, usernameValidation } from "../utils/general.js";
import ValidationError from "../utils/errorsTypes.js";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { username, password } = req.query;
    usernameValidation(username);
    passwordValidation(password);

    const isUserExist = await isUserCredentialsCorrect(username, password);
    if (isUserExist) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      });
      res.sendStatus(200);
    } else {
      throw new ValidationError("שם המשתמש או הסיסמה אינם נכונים", 404);
    }
  } catch (err) {
    res.status(err.statusCode).send({ message: err.message });
  }
});

export default router;
