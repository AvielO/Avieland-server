import User from "../schemas/user.js";

export const isUserCredentialsCorrect = async (username, password) => {
  const user = await User.findOne({ username, password });
  return user ? true : false;
};
