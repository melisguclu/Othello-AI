const User = require('../models/user');
const {hashPassword, comparePassword} = require('../helpers/auth');
const jwt = require('jsonwebtoken');


const test = (req, res) => {
  res.json({ message: 'test route' });
}

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //check if name was entered
    if (!name) {
      return res.json({ error: 'Name is required' });
    }
    //check if email was entered
    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({ error: 'Email already exists' });
    }
    if (!email) {
      return res.json({ error: 'Email is required ' });
    }

    //check if password was entered
    if (!password || password.length < 6) {
      return res.json({ error: 'Password is required' });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.json({ message: 'User created', user });

  } catch (error) {
    console.error(error);
    return res.json({ error: 'Something went wrong' });
  }

}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if password matches
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        email: user.email,
        _id: user._id,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token valid for 1 day
    );
    console.log('Token:', token);

    // Send cookie with token
    return res
    .cookie('token', token, {
      domain: process.env.COOKIE_DOMAIN,
      httpOnly: true,
      path: "/",
      expires: new Date(Date.now() + 60 * 60 * 24 * 14 * 1000),
      // secure: process.env.NODE_ENV === 'production' ? true : false,
      secure: true,
      // sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      sameSite: 'None',
    })
    .json({ message: 'Login successful', user });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getProfile = (req, res) =>{
  res.json(req.user)
}

const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });

  res.status(200).json({ message: 'Logout successful' });
};


module.exports = {
  test, registerUser, loginUser, getProfile, logoutUser
}