const {
  sequelize,
  checkModelName,
  checkPropertyExists,
} = require('sequelize-test-helpers');

const { expect } = require('chai');

const Models = require('../../models');

describe('The model', () => {

  describe('Product', () => {
    const { Product: ProductModel } = Models;
    const product = new ProductModel(sequelize);
  
    it('has the properties "id", "name" and "quantity"', () => {
      ['id', 'name', 'quantity'].forEach(checkPropertyExists(product));
    });

    // it('has the create method working normally', async () => {
    //   const allProducts = await ProductModel.findAll();
      
    //   expect(allProducts.length).to.be.equal(3);
    // });
  });

  describe('Sale', () => {
    const { Sale: SaleModel } = Models;
    const sale = new SaleModel(sequelize);
  
    it('has the properties "id"', () => {
      ['id'].forEach(checkPropertyExists(sale));
    });

    // it('has the create method working normally', async () => {
    //   const allSales = await SaleModel.findAll();
      
    //   expect(allSales.length).to.be.equal(2);
    // });
  });

  describe('SaleProduct', () => {
    const { SaleProduct: SaleProductModel } = Models;
    const saleProduct = new SaleProductModel(sequelize);
  
    it('has the properties "saleId", "productId" and "quantity"', () => {
      ['saleId', 'productId', 'quantity'].forEach(checkPropertyExists(saleProduct));
    });

    // it('has the create method working normally', async () => {
    //   const allSalesProducts = await SaleProductModel.findAll();
      
    //   expect(allSalesProducts.length).to.be.equal(3);
    // });
  });

});
