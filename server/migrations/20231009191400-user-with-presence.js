module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('t_user', 'presence_device_features', {
      allowNull: true,
      type: Sequelize.JSON,
    });
  },
  down: async (queryInterface, Sequelize) => {},
};
