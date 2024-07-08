const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const organisationRoutes = require('./src/routes/organisations');

const app = express();

app.get("/", (req, res)=> {
  res.send("hello")
})

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
