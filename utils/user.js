import User from "../schemas/user.js";

export const isUsernameExists = async (username) => {
  const user = await User.findOne({ username });
  return user ? true : false;
};

export const isPasswordsSimilar = (password, passwordAgain) => {
  if (password === passwordAgain) {
    return true;
  } else {
    return false;
  }
};

export const isValidEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};
