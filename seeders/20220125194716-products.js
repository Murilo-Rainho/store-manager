module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('products', [
      { name: 'Martelo de Thor', quantity: 10 },
      { name: 'Traje de encolhimento', quantity: 20 },
      { name: 'Escudo do Capitão América', quantity: 30 },
    ]);
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('products', null, {});
  },
};
