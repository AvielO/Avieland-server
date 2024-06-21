import mongoose, { Schema } from "mongoose";
import { ResourcesSchema } from "./resources.js";
import { WorkersSchema } from "./workers.js";

const UserSchema = new Schema({
  id: {
    type: String,
    require: true,
  },
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  resources: {
    type: ResourcesSchema,
    required: true,
  },
  workers: {
    type: WorkersSchema,
    required: true,
  },
  soliders: {
    type: Number,
    required: true,
  },
  group: {
    type: String,
    required: false,
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
