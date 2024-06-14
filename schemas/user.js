import mongoose, { Schema } from "mongoose";

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
    required: false,
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
