const { stub } = require('sinon');
const { expect } = require('chai');

describe('The router', () => {

  describe('"product" has the service', () => {
    const { Product: productModel } = require('../../models');
    
    describe('postProduct that', () => {
      const { postProduct } = require('../../services/product');
      const validateNameAndQuantity = require('../../middlewares/product/validateNameAndQuantity');

      const mockObj = {
        id: 2,
        name: 'Traje de encolhimento',
        quantity: 20
      };

      before(() => {
        stub(productModel, 'create').resolves({ dataValues: mockObj  });
      });
  
      after(() => {
        productModel.create.restore();
      });

      it('is possible create a product', async () => {
        stub(productModel, 'findOne').resolves();

        const { result } = await postProduct(mockObj);

        expect(result).to.be.all.keys('id', 'name', 'quantity');

        productModel.findOne.restore();
      });

      it('isn\'t possible create a product if it already exists', async () => {
        stub(productModel, 'findOne').resolves(mockObj);

        const result = await postProduct(mockObj);

        expect(result.message).to.be.equal('Product already exists');

        productModel.findOne.restore();
      });
      
      it('must have the properties "name" and "quantity" in the body of request', async () => {
        const response = {};
        const request = {};
        request.body = {}
        let next = () => {};

        response.status = stub().returns(response);
        response.json = stub().returns();
        next = stub().returns();

        await validateNameAndQuantity(request, response, next);

        expect(response.status.calledWith(400)).to.be.equal(true);

        // request.body = {
        //   name: 'orange',
        //   quantity: 10,
        // };

        // await validateNameAndQuantity(request, response, next);

        // console.log(next());

        // expect(next).to.be.equal(true);
      });

    });
    
    describe('getProducts that', () => {
      const { getProducts } = require('../../services/product');

      const mockArray = [
        {
          id: 2,
          name: 'Traje de encolhimento',
          quantity: 20
        },
        {
          id: 3,
          name: 'Escudo do Capitão América',
          quantity: 30
        }
      ];

      it('returns a product\'s array', async () => {
        stub(productModel, 'findAll').resolves(mockArray);

        const { result } = await getProducts();

        expect(result).to.be.equal(mockArray);

        productModel.findAll.restore();
      });
      
      it('returns a error message if don\'t have products registered', async () => {
        stub(productModel, 'findAll').resolves();

        const { message } = await getProducts();

        expect(message).to.be.equal('Has no product registered');

        productModel.findAll.restore();
      });

    });

    describe('getProductById that', () => {
      const { getProductById } = require('../../services/product');

      const mockObj = {
        id: 2,
        name: 'Traje de encolhimento',
        quantity: 20
      };

      const mockId = 2

      it('return just one product', async () => {
        stub(productModel, 'findByPk').resolves({ dataValues: mockObj });

        const { result } = await getProductById(mockId);

        expect(result.id).to.be.equal(mockId);

        productModel.findByPk.restore();
      });
      
      it('return a error message if the productId not exists', async () => {
        stub(productModel, 'findByPk').resolves();

        const { message } = await getProductById(mockId);

        expect(message).to.be.equal('Product not found');

        productModel.findByPk.restore();
      });

    });

    describe('deleteProductById that', () => {
      const { deleteProductById } = require('../../services/product');
      
      const mockObj = {
        id: 2,
        name: 'Traje de encolhimento',
        quantity: 20
      };

      const mockId = 2;

      before(() => {
        stub(productModel, 'destroy').resolves();
      });
  
      after(() => {
        productModel.destroy.restore();
      });

      it('return the product object when the product has been deleted', async () => {
        stub(productModel, 'findByPk').resolves({ dataValues: mockObj });

        const { result } = await deleteProductById(mockId);

        expect(result).to.be.equal(mockObj);

        productModel.findByPk.restore();
      });
      
      it('return a error message when has no product with this productId', async () => {
        stub(productModel, 'findByPk').rejects();

        const { message } = await deleteProductById(mockId);

        console.log(message);

        expect(message).to.be.equal('Product not found');

        productModel.findByPk.restore();
      });
    });

    describe('editProductById that', () => {
      const { editProductById } = require('../../services/product');

      const mockObj = {
        name: 'Traje de encolhimento',
        quantity: 20
      };

      const mockId = 1

      it('return the objProduct edited when edit a product', async () => {
        stub(productModel, 'update').resolves([1]);

        const { result } = await editProductById({ ...mockObj, productId: mockId });

        expect(result).to.deep.equals({ ...mockObj, id: mockId });

        productModel.update.restore();
      });

      it('return an error message when has no product with this productId', async () => {
        stub(productModel, 'update').resolves([0]);

        const { message } = await editProductById({ ...mockObj, productId: mockId });

        expect(message).to.be.equal('Product not found');

        productModel.update.restore();
      });
    });
  });

});

