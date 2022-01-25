const saleId = 'sale_id';
const productId = 'product_id';

module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('sales_products', [
      { [saleId]: 1, [productId]: 1, quantity: 5 },
      { [saleId]: 1, [productId]: 2, quantity: 10 },
      { [saleId]: 2, [productId]: 3, quantity: 30 },
    ]);
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('sales_products', null, {});
  },
};
