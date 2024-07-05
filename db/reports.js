import Report from "../schemas/report.js";

export const getReportsByUsername = async (username) => {
  const reports = await Report.find({
    $or: [
      { "attacker.name": username },
      {
        "defender.name": username,
      },
    ],
  }).sort({ time: -1 });
  return reports;
};
