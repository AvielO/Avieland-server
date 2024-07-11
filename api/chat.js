import { Router } from "express";
import { createMessage } from "../app/chatActions.js";

const router = Router();

router.post("/:senderName", async (req, res) => {
  try {
    await createMessage("123", "!23", "123");
    res.status(200).send({ message: "message Sent" });
  } catch (err) {
    res.status(500).send({ message: "לא היה ניתן להפקיד את הכסף" });
  }
});

export default router;
