import mongoose, { Schema } from "mongoose";
import { ResourcesSchema } from "./resources.js";

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
  resources: {
    type: ResourcesSchema,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
