import { Schema } from "mongoose";

export const WorkersSchema = new Schema({
  copper: {
    type: Number,
    require: true,
  },
  silver: {
    type: Number,
    require: true,
  },
  gold: {
    type: Number,
    required: true,
  },
  diamond: {
    type: Number,
    required: true,
  },
});
