import Report from "../schemas/report.js";

export const getReportInformation = async (reportID) => {
  const report = Report.findOne({ id: reportID });
  return report;
};
