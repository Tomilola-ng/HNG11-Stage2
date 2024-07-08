const { User, Organisation } = require('../../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validateRegistration, validateLogin } = require('../utils/validation');

exports.register = async (req, res) => {
  try {
    const { errors, isValid } = validateRegistration(req.body);
    if (!isValid) {
      return res.status(422).json({ errors });
    }

    const { firstName, lastName, email, password, phone } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(422).json({
        errors: [{ field: 'email', message: 'Email already exists' }],
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });

    const organisation = await Organisation.create({
      name: `${firstName}'s Organisation`,
      description: `Default organisation for ${firstName} ${lastName}`,
    });

    // Ensure the models are correctly associated
    await user.addOrganisation(organisation);

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      status: 'Bad request',
      message: 'Registration unsuccessful: ' + error.message,
      statusCode: 400,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { errors, isValid } = validateLogin(req.body);
    if (!isValid) {
      return res.status(422).json({ errors });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401,
      });
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(401).json({
      status: 'Bad request',
      message: 'Authentication failed',
      statusCode: 401,
    });
  }
};
