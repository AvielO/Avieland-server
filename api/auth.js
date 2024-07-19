import { Router } from "express";
import { isUserCredentialsCorrect } from "../app/authActions.js";
import { passwordValidation, usernameValidation } from "../utils/general.js";
import ValidationError from "../utils/errorsTypes.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { username, password } = req.query;
    usernameValidation(username);
    passwordValidation(password);

    const isUserExist = await isUserCredentialsCorrect(username, password);
    if (isUserExist) {
      res.sendStatus(200);
    } else {
      throw new ValidationError("שם המשתמש או הסיסמה אינם נכונים", 404);
    }
  } catch (err) {
    res.status(err.statusCode).send({ message: err.message });
  }
});

export default router;
