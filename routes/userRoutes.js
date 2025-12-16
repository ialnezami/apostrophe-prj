const express = require('express');
const router = express.Router();
const User = require('../models/User');
const HTTP_STATUS = require('../constants/httpStatus');

let users = [];
let userIdCounter = 1;

router.post('/signup', (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'all fields are required'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'invald emial format'
      });
    }

    if (password !== confirmPassword) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'password and confirm passwrod do not match'
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'password must be at least 8 charcters long and contain at least one uppercase lette, one lowercase letter, and one number'
      });
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        status: 'error',
        message: 'User with this emial alredy exists'
      });
    }

    const newUser = new User(userIdCounter++, name, email, password);
    users.push(newUser);

    res.status(HTTP_STATUS.CREATED).json({
      status: 'success',
      message: 'user registered successfully',
      data: newUser.toJSON()
    });

  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;

