import { Router } from "express";
import { getReportInformation } from "../app/reportActions.js";

const router = Router();

router.get("/:reportID", async (req, res) => {
  try {
    const { reportID } = req.params;
    const reportInformation = await getReportInformation(reportID);
    res.status(200).send(reportInformation);
  } catch (err) {
    res.status(500).send({ message: "בעיה בהבאת הנתונים" });
  }
});

export default router;
