const User = require("../models/User");

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    // Create token
    // const token = user.getSignedJwtToken();
    // res.status(200).json({ success: true, data: user, token: token });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false });
    console.log(err.stack);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  // Validate email & password
  if (!email || !password) {
    // next(new ErrorResponse('Please provide an email and password', 400));
    return res
      .status(400)
      .json({ success: false, error: "Please provide an email and password" });
  }
  // Check for user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    // next(new ErrorResponse('Invalid credentials', 401));
    return res
      .status(400)
      .json({ success: false, error: "Cannot find given user's email" });
  }
  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    // next(new ErrorResponse('Invalid credentials', 401));
    return res.status(401).json({ success: false, error: "Invalid password" });
  }
  // Create token
  // const token = user.getSignedJwtToken();
  // res.status(200).json({ success: true, token: token})
  sendTokenResponse(user, 200, res);
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ), // in ms
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode)/*.cookie("token", token, options)*/.json({
    success: true,
    //add for frontend
    _id: user._id,
    name: user.name,
    email: user.email,
    //end for frontend
    token,
  });
};

// @desc    Get current logged in user
// @route   POST /api/v1/auth/me
// @access Private
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
};
