const { validationResult } = require('express-validator');
const HTTP_STATUS = require('../constants/httpStatus');

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg
    }));

    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'validation failed',
      errors: errorMessages
    });
  }
  next();
}

module.exports = {
  handleValidationErrors
};

