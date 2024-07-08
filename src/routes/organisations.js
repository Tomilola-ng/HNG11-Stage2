const express = require('express');
const router = express.Router();
const organisationController = require('../controllers/organisationController');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, organisationController.getAllOrganisations);
router.get('/:orgId', authMiddleware, organisationController.getOrganisationById);
router.post('/', authMiddleware, organisationController.createOrganisation);
router.post('/:orgId/users', authMiddleware, organisationController.addUserToOrganisation);

module.exports = router;