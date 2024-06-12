export const isUserCredentialsCorrect = async (username, password) => {
  if (username === "AvielO") {
    return true;
  } else {
    return false;
  }
};

export const createUser = async (username, email, password, passwordAgain) => {
  //Check if username exists
  //Check if the passwords is the same
  //Check if that's valid email.
};
