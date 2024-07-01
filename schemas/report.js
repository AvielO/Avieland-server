import mongoose, { Schema } from "mongoose";

const UserReportSchema = new Schema({
  id: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  powerLevel: {
    type: Number,
    require: true,
  },
  bonusPowerLevel: {
    type: Number,
    require: true,
  },
});

export const ReportSchema = new Schema({
  id: {
    type: String,
    require: true,
  },
  attacker: {
    type: UserReportSchema,
    require: true,
  },
  defender: {
    type: UserReportSchema,
    require: true,
  },
  winner: {
    type: String,
    require: true,
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
