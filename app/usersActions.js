import User from "../schemas/user.js";

export const isUserCredentialsCorrect = async (username, password) => {
  const user = await User.findOne({ username, password });
  return user ? true : false;
};

export const createUser = async (username, email, password, passwordAgain) => {
  //Check if username exists
  //Check if the passwords is the same
  //Check if that's valid email.
};
