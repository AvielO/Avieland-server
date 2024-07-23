import Report from "../schemas/report.js";

export const getUserAllReports = async (username) => {
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

export const getReportsByUsername = async (username, page = 1, limit = 10) => {
  const reports = await Report.find({
    $or: [
      { "attacker.name": username },
      {
        "defender.name": username,
      },
    ],
  })
    .sort({ time: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  return reports;
};

export const getTotalReportsAmount = async (username, limit = 10) => {
  const totalReports = await Report.countDocuments({
    $or: [{ "attacker.name": username }, { "defender.name": username }],
  });
  const totalPages = Math.ceil(totalReports / limit);
  return totalPages;
};
