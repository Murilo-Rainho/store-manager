module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('sales', [{}, {}, {}]);
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('sales', null, {});
  },
};
