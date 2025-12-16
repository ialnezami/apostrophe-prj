const express = require('express');
const router = express.Router();
const User = require('../models/User');
const HTTP_STATUS = require('../constants/httpStatus');
const { generateToken } = require('../utils/jwt');
const { signupValidation, loginValidation, updateUserValidation, deleteUserValidation, changeRoleValidation } = require('../validators/userValidators');
const { handleValidationErrors } = require('../middleware/validation');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: Password123
 *               confirmPassword:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/signup', signupValidation, handleValidationErrors, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        status: 'error',
        message: 'User with this emial alredy exists'
      });
    }

    const newUser = await User.create({
      name,
      email,
      password
    });

    res.status(HTTP_STATUS.CREATED).json({
      status: 'success',
      message: 'user registered successfully',
      data: newUser.toJSON()
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        status: 'error',
        message: 'User with this emial alredy exists'
      });
    }
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user and get JWT token
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', loginValidation, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
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
      id: user._id.toString(),
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

/**
 * @swagger
 * /api/users/list:
 *   get:
 *     summary: Get list of all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: users retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 count:
 *                   type: integer
 *                   example: 5
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/list', authenticate, authorize('admin'), async (req, res) => {
  try {
    const usersList = await User.find().select('-password');

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

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: John Doe Updated
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.updated@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: NewPassword123
 *               confirmPassword:
 *                 type: string
 *                 example: NewPassword123
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: admin
 *                 description: Only admins can change roles
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: user updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', authenticate, updateUserValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password, role } = req.body;
    const currentUser = req.user;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'user not found'
      });
    }

    if (currentUser.id !== userId && currentUser.role !== 'admin') {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        status: 'error',
        message: 'you can only update your own profile'
      });
    }

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (email !== undefined) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
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
      if (currentUser.role !== 'admin') {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          status: 'error',
          message: 'only admins can change user roles'
        });
      }
      updateData.role = role;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'no fields to update'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'user updated successfully',
      data: updatedUser.toJSON()
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        status: 'error',
        message: 'User with this emial alredy exists'
      });
    }
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: user deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authenticate, authorize('admin'), deleteUserValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'user not found'
      });
    }

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

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     summary: Change user role (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: admin
 *     responses:
 *       200:
 *         description: User role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: user role updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id/role', authenticate, authorize('admin'), changeRoleValidation, handleValidationErrors, async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'user not found'
      });
    }

    user.role = role;
    await user.save();

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'user role updated successfully',
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

module.exports = router;

