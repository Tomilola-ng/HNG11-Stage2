const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const organisationRoutes = require('./src/routes/organisations');

const app = express();

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Backend Task: User Authentication & Organisation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            color: #2980b9;
        }
        ul {
            padding-left: 20px;
        }
        code {
            background-color: #f4f4f4;
            padding: 2px 4px;
            border-radius: 4px;
        }
        .highlight {
            background-color: #fffacd;
            padding: 10px;
            border-left: 4px solid #ffd700;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <h1>Backend Stage 2 Task: User Authentication & Organisation</h1>
    
    <div class="highlight">
        <strong>Note:</strong> Read all requirements carefully before implementation.
    </div>

    <h2>Acceptance Criteria</h2>
    <ul>
        <li>Connect your application to a Postgres database server. (Optional: use an ORM of your choice)</li>
        <li>Create a User model with the following properties:
            <ul>
                <li><code>userId</code>: string (must be unique)</li>
                <li><code>firstName</code>: string (required, non-null)</li>
                <li><code>lastName</code>: string (required, non-null)</li>
                <li><code>email</code>: string (unique and required, non-null)</li>
                <li><code>password</code>: string (required, non-null)</li>
                <li><code>phone</code>: string</li>
            </ul>
        </li>
        <li>Provide validation for all fields. Return status code 422 with appropriate error messages for validation errors.</li>
    </ul>

    <h2>User Authentication</h2>
    <ul>
        <li>Implement user registration:
            <ul>
                <li>Hash user's password before storing in the database</li>
                <li>Return 201 success status code on successful registration</li>
            </ul>
        </li>
        <li>Implement user login:
            <ul>
                <li>Use JWT token for accessing protected endpoints</li>
            </ul>
        </li>
    </ul>

    <h2>Organisation</h2>
    <ul>
        <li>A user can belong to one or more organisations</li>
        <li>An organisation can contain one or more users</li>
        <li>Create a default organisation for every new user registration</li>
        <li>Organisation name should be "[user's firstName]'s Organisation"</li>
        <li>Logged in users can access organisations they belong to and organisations they created</li>
    </ul>

    <h2>Organisation Model</h2>
    <ul>
        <li><code>orgId</code>: string (unique)</li>
        <li><code>name</code>: string (required, non-null)</li>
        <li><code>description</code>: string</li>
    </ul>

    <h2>Required Endpoints</h2>
    <ul>
        <li><code>[POST] /auth/register</code>: Register a user and create a default organisation</li>
        <li><code>[POST] /auth/login</code>: Log in a user</li>
        <li><code>[GET] /api/users/:id</code>: Get user record (protected)</li>
        <li><code>[GET] /api/organisations</code>: Get all organisations user belongs to (protected)</li>
        <li><code>[GET] /api/organisations/:orgId</code>: Get a single organisation record (protected)</li>
        <li><code>[POST] /api/organisations</code>: Create a new organisation (protected)</li>
        <li><code>[POST] /api/organisations/:orgId/users</code>: Add a user to an organisation (protected)</li>
    </ul>

    <h2>Testing Requirements</h2>
    <ul>
        <li>Write unit tests for:
            <ul>
                <li>Token generation (ensure correct expiration and user details)</li>
                <li>Organisation access control</li>
            </ul>
        </li>
        <li>Implement end-to-end tests for the register endpoint, covering:
            <ul>
                <li>Successful user registration</li>
                <li>Validation errors</li>
                <li>Database constraints</li>
            </ul>
        </li>
    </ul>

    <h2>Submission Guidelines</h2>
    <ul>
        <li>Host your API on a free hosting service</li>
        <li>Submit only the endpoint's base URL (e.g., https://example.com)</li>
        <li>Use the provided Google form for submission</li>
        <li><strong>Deadline:</strong> Sunday, July 7, 2024, at 11:59 PM GMT</li>
    </ul>

    <div class="highlight">
        <strong>Important:</strong> Thoroughly review your work to ensure accuracy, functionality, and adherence to the specified guidelines before submission.
    </div>
</body>
</html>`);
});

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organisations', organisationRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

module.exports = app;
