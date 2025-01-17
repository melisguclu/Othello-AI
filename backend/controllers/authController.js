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
        id: user._id,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token valid for 1 day
    );
    console.log('Token:', token);

    // Send cookie with token
    return res
      .cookie('token', token, {
        httpOnly: true, // Prevents access from client-side JavaScript
        secure: process.env.NODE_ENV === 'production', // Ensures HTTPS in production
        sameSite: 'strict', // Prevents CSRF
      })
      .json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getProfile = (req, res) =>{
  const {token } = req.cookies
  if(token){
    jwt.verify(token, process.env.JWT_SECRET, {},  (err, user) => {
      if(err) {
        return res.status(401).json({error: 'Unauthorized'})
      }
      res.json(user)
    })

  }
  else{
    res.json(null)
  }
}

const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: 'Logout successful' });
};


module.exports = {
  test, registerUser, loginUser, getProfile, logoutUser
}