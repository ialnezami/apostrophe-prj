const express = require('express');
const router = express.Router();
const User = require('../models/User');
const HTTP_STATUS = require('../constants/httpStatus');
const { generateToken } = require('../utils/jwt');
const { signupValidation, loginValidation, updateUserValidation, deleteUserValidation } = require('../validators/userValidators');
const { handleValidationErrors } = require('../middleware/validation');

let users = [];
let userIdCounter = 1;

router.post('/signup', signupValidation, handleValidationErrors, (req, res) => {
  try {
    const { name, email, password } = req.body;

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

router.post('/login', loginValidation, handleValidationErrors, (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: 'error',
        message: 'invalid email or password'
      });
    }

    if (user.password !== password) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: 'error',
        message: 'invalid email or password'
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'login successful',
      data: {
        user: user.toJSON(),
        token: token
      }
    });

  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
});

router.get('/list', (req, res) => {
  try {
    const usersList = users.map(user => user.toJSON());

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'users retrieved successfully',
      data: usersList,
      count: usersList.length
    });

  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
});

router.put('/:id', updateUserValidation, handleValidationErrors, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email, password, role } = req.body;

    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'user not found'
      });
    }

    const user = users[userIndex];
    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (email !== undefined) {
      const existingUser = users.find(u => u.email === email && u.id !== userId);
      if (existingUser) {
        return res.status(HTTP_STATUS.CONFLICT).json({
          status: 'error',
          message: 'User with this emial alredy exists'
        });
      }
      updateData.email = email;
    }

    if (password !== undefined) {
      updateData.password = password;
    }

    if (role !== undefined) {
      updateData.role = role;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'no fields to update'
      });
    }

    user.update(updateData);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'user updated successfully',
      data: user.toJSON()
    });

  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
});

router.delete('/:id', deleteUserValidation, handleValidationErrors, (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'user not found'
      });
    }

    users.splice(userIndex, 1);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'user deleted successfully'
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

