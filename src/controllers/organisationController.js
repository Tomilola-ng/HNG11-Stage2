const Organisation = require('../../models/organisation');
const User = require('../../models/user');

exports.getAllOrganisations = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    const organisations = await user.getOrganisations();

    res.status(200).json({
      status: 'success',
      message: 'Organisations retrieved successfully',
      data: { organisations },
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
      statusCode: 500,
    });
  }
};

exports.getOrganisationById = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    const organisation = await Organisation.findByPk(req.params.orgId);

    if (!organisation) {
      return res.status(404).json({
        status: 'Not found',
        message: 'Organisation not found',
        statusCode: 404,
      });
    }

    const hasAccess = await user.hasOrganisation(organisation);
    if (!hasAccess) {
      return res.status(403).json({
        status: 'Forbidden',
        message: 'You do not have access to this organisation',
        statusCode: 403,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Organisation retrieved successfully',
      data: organisation,
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Internal server error',
      statusCode: 500,
    });
  }
};

exports.createOrganisation = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(422).json({
        errors: [{ field: 'name', message: 'Name is required' }],
      });
    }

    const organisation = await Organisation.create({ name, description });
    const user = await User.findByPk(req.user.userId);
    await user.addOrganisation(organisation);

    res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: organisation,
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad Request',
      message: 'Client error',
      statusCode: 400,
    });
  }
};

exports.addUserToOrganisation = async (req, res) => {
  try {
    const { userId } = req.body;
    const organisation = await Organisation.findByPk(req.params.orgId);
    const user = await User.findByPk(userId);

    if (!organisation || !user) {
      return res.status(404).json({
        status: 'Not found',
        message: 'Organisation or user not found',
        statusCode: 404,
      });
    }

    await organisation.addUser(user);

    res.status(200).json({
      status: 'success',
      message: 'User added to organisation successfully',
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad Request',
      message: 'Client error',
      statusCode: 400,
    });
  }
};