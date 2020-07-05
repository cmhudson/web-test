'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('restaurants', [{
      id: 3,
      name: "Carriage House",
      address: "123 W Main",
      open_time: "10:00",
      close_time: "21:00",
      created_at: new Date(),
      updated_at: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('restaurants', null, {})
  }
};
