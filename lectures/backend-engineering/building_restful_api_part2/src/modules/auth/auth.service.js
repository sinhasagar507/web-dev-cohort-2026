import ApiError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyRefreshToken,
} from "../../common/utils/jwt.utils.js";
import User from "./auth.model.js";

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const register = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict("Email already exisits");

  const { rawToken, hashedToken } = generateResetToken();

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken: hashedToken,
  });

  // TODO: send an email to user with token: rawToken
  try {
    await sendVerificationEmail(email, token)
  } catch (error) {
    console.log(error)
  }

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.verificationToken;

  return userObj;
};

const login = async ({ email, password }) => {
  //take email and find user in DB
  // then check if password is correct
  // check if verified or not

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw ApiError.unauthorized("Invalid Email or password");

  // somehow I will check password

  if (!user.isVerified) {
    throw ApiError.forbidden("Please verify your email before loggin");
  }

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });

  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, accessToken, refreshToken };
};

const refresh = async (token) => {
  if (!token) throw ApiError.unauthorized("Refresh token missing");
  const decoded = verifyRefreshToken(token);

  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user) throw ApiError.unauthorized("User not found");

  if (user.refreshToken !== hashToken(token)) {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });

  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const logout = async (userId) => {
  //   const user = await User.findById(userId);
  //   if (!user) throw ApiError.unauthorized("User not found");

  //   user.refreshToken = undefined;
  //   await user.save({ validateBeforeSave: false });

  await User.findByIdAndUpdate(userId, { refreshToken: null });

};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw ApiError.notfound("No acccount with that email");

  const { rawToken, hashedToken } = generateResetToken();
  user.resetPasswordtoken = hashedToken;
  user.resetpasswordExpires = Date.now() + 15 * 60 * 1000;

  await user.save();

  // TODO: send an email 
  try{
  }
};

const verifyEmail = async (token) => {
  const hashedToken = hashToken(token); 
  // We select +verificationToken cause it is essentially required to do so. Its saved as include:False in DB and I have to make sure I select it. That's why its a '+'.
  User.findOne({verificationToken: hashedToken}).select("+verificationToken")

  // if user not found
  if (!user) throw ApiError.notfound("No acccount with that email");

  user.isVerified = true 
  user.verificationToken = undefined; 
  await user.save(); 
  return user; 
}

export { register, login, refresh, logout, forgotPassword };
