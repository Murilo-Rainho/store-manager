const {
  sequelize,
  checkModelName,
  checkPropertyExists,
} = require('sequelize-test-helpers');

const { expect } = require('chai');

describe('The model', () => {

  describe('Product', () => {
    const { Product: ProductModel } = require('../../models');
    const Product = ProductModel(sequelize);
    const product = new Product();

    console.log('Product', Product);
    console.log('product', product);
  
    it('has the name "Product"', () => {
      checkModelName(Product)('Product');
    });
  
    it('has the properties "id", "name" and "quantity"', () => {
      ['id', 'name', 'quantity'].forEach(checkPropertyExists(product));
    });

    it('has the create method working normally', async () => {
      const allProducts = await ProductModel.findAll();
      
      expect(allProducts.length).to.be.equal(3);
    });
  });

  describe('Sale', () => {
    const { Sale: SaleModel } = require('../../models');
    const Sale = SaleModel(sequelize);
    const sale = new Sale();

    console.log('Sale', Sale);
    console.log('sale', sale);
  
    it('has the name "Sale"', () => {
      checkModelName(Sale)('Sale');
    });
  
    it('has the properties "id" and "date"', () => {
      ['id', 'date'].forEach(checkPropertyExists(sale));
    });

    it('has the create method working normally', async () => {
      const allSales = await SaleModel.findAll();
      
      expect(allSales.length).to.be.equal(2);
    });
  });

  describe('SaleProduct', () => {
    const { SaleProduct: SaleProductModel } = require('../../models');
    const SaleProduct = SaleProductModel(sequelize);
    const saleProduct = new SaleProduct();

    console.log('SaleProduct', SaleProduct);
    console.log('saleProduct', saleProduct);
  
    it('has the name "SaleProduct"', () => {
      checkModelName(SaleProduct)('SaleProduct');
    });
  
    it('has the properties "sale_id", "product_id" and "quantity"', () => {
      ['sale_id', 'product_id', 'quantity'].forEach(checkPropertyExists(saleProduct));
    });

    it('has the create method working normally', async () => {
      const allSalesProducts = await SaleProductModel.findAll();
      
      expect(allSalesProducts.length).to.be.equal(3);
    });
  });

});
