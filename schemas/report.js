import mongoose, { Schema } from "mongoose";

const countryTime = () => {
  const now = new Date();
  const timeOffset = now.getTimezoneOffset() * 60000;
  const localTime = new Date(now.getTime() - timeOffset);
  return localTime;
};

const UserReportSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  powerLevel: {
    type: Number,
    required: true,
  },
  bonusPowerLevel: {
    type: Number,
    required: true,
  },
});

export const ReportSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: countryTime,
  },
  attacker: {
    type: UserReportSchema,
    required: true,
  },
  defender: {
    type: UserReportSchema,
    required: true,
  },
  winner: {
    type: String,
    required: true,
  },
  stolenCopper: {
    type: Number,
  },
  stolenSilver: {
    type: Number,
  },
  stolenGold: {
    type: Number,
  },
});

const Report = mongoose.model("Report", ReportSchema);
export default Report;
