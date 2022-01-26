const { stub } = require('sinon');
const { expect } = require('chai');

describe('The router', () => {

  describe('"product" has the service', () => {
    const { Product: productModel } = require('../../models');
    const productService = require('../../services/product');

    const mockObj = { name: 'banana', quantity: 10 };

    before(() => {
      stub(productModel, 'create').resolves({ dataValues: { ...mockObj, id: 1, }  })
      stub(productModel, 'findOne').resolves()
    });

    after(() => {
      productModel.create.restore();
      productModel.findOne.restore();
    });
    
    describe('postProduct that', () => {
      const validateNameAndQuantity = require('../../middlewares/product/validateNameAndQuantity');

      it('has possible create a product', async () => {
        const { result } = await productService.postProduct(mockObj);

        expect(result).to.be.all.keys('id', 'name', 'quantity');
      });

      // it('must have the properties "name" and "quantity" in the body of request', () => {
        
      // });
      

      // it('must have the properties "name" and "quantity" in the body of request', async () => {
      // });

    });
    

  });
  

});

