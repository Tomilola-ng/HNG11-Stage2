module.exports = (sequelize, DataTypes) => {
  const Organisation = sequelize.define('Organisation', {
    organisationId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  });

  Organisation.associate = (models) => {
    Organisation.belongsToMany(models.User, {
      through: 'UserOrganisation',
      foreignKey: 'organisationId',
      otherKey: 'userId',
    });
  };

  return Organisation;
};
