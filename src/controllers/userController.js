const User = require('../../models/user');

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['userId', 'firstName', 'lastName', 'email', 'phone'],
    });

    if (!user) {
      return res.status(404).json({
        status: 'Not found',
        message: 'User not found',
        statusCode: 404,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
      statusCode: 500,
    });
  }
};