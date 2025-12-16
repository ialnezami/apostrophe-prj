const { body, param } = require('express-validator');

const signupValidation = [
  body('name')
    .notEmpty()
    .withMessage('name is required')
    .trim()
    .isLength({ min: 2 })
    .withMessage('name must be at least 2 characters long'),

  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invald emial format')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 charcters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('password must contain at least one uppercase lette, one lowercase letter, and one number'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('password and confirm passwrod do not match');
      }
      return true;
    })
];

const loginValidation = [
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('password is required')
];

const updateUserValidation = [
  param('id')
    .isMongoId()
    .withMessage('invalid user id'),

  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('name cannot be empty')
    .isLength({ min: 2 })
    .withMessage('name must be at least 2 characters long'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('invald emial format')
    .normalizeEmail(),

  body('password')
    .optional()
    .custom((value, { req }) => {
      if (value && !req.body.confirmPassword) {
        throw new Error('confirm password is required when updating password');
      }
      return true;
    })
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 charcters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('password must contain at least one uppercase lette, one lowercase letter, and one number'),

  body('confirmPassword')
    .optional()
    .custom((value, { req }) => {
      if (req.body.password && value !== req.body.password) {
        throw new Error('password and confirm passwrod do not match');
      }
      return true;
    }),

  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('role must be either user or admin')
];

const deleteUserValidation = [
  param('id')
    .isMongoId()
    .withMessage('invalid user id')
];

const changeRoleValidation = [
  param('id')
    .isMongoId()
    .withMessage('invalid user id'),

  body('role')
    .notEmpty()
    .withMessage('role is required')
    .isIn(['user', 'admin'])
    .withMessage('role must be either user or admin')
];

module.exports = {
  signupValidation,
  loginValidation,
  updateUserValidation,
  deleteUserValidation,
  changeRoleValidation
};
