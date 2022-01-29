const { stub } = require('sinon');
const { expect } = require('chai');

describe('The router', () => {

  const { Product: productModel, Sale: saleModel, SaleProduct: saleProductModel, sequelize } = require('../../models');

  describe('"product" has the service', () => {
    
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

      it('returns a error message if has a server error', async () => {
        stub(productModel, 'findAll').rejects();

        const responseService = await getProducts();

        expect(responseService).to.have.own.property('message')

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
        stub(productModel, 'findByPk').resolves();

        const { message } = await deleteProductById(mockId);

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

      it('return an error message when has an internal error', async () => {
        stub(productModel, 'update').resolves();

        const serviceResponse = await editProductById({ ...mockObj, productId: mockId });

        expect(serviceResponse).to.have.own.property('message')

        productModel.update.restore();
      });

    });

  });

  describe('"saleProduct" has the service', () => {

    describe('postSaleProduct that', () => {

      const { postSaleProduct } = require('../../services/saleProduct');
      const { validateProductIdAndQuantity } = require('../../middlewares/saleProduct');

      const successMockArray = [
        {
          product_id: 1,
          quantity: 2
        },
        {
          product_id: 2,
          quantity: 2
        },
        {
          product_id: 3,
          quantity: 7
        },
        {
          product_id: 4,
          quantity: 5
        },
      ];

      const failMockArrayOne = [
        {
          quantity: 1,
        },
        {
          product_id: 2,
          quantity: 20,
        },
      ];

      const failMockArrayTwo = [
        {
          product_id: 1,
          quantity: 1,
        },
        {
          product_id: 2,
          quantity: 100,
        },
      ];

      const productMockArray = [
        { dataValues: {
          id: 1,
          name: 'Martelo de Thor',
          quantity: 10
        } },
        { dataValues: {
          id: 2,
          name: 'Traje de encolhimento',
          quantity: 10
        } },
        { dataValues: {
          id: 3,
          name: 'Pedras do infinito',
          quantity: 30
        } },
        { dataValues: {
          id: 4,
          name: 'Armadura de ferro',
          quantity: 20
        } },
      ];

      before(() => {
        stub(sequelize, 'transaction').resolves({
          commit: () => {},
          rollback: () => {}
        });
        stub(sequelize, 'literal').resolves(true);
        stub(saleProductModel, 'create').resolves();
        stub(productModel, 'findAll').resolves(productMockArray);
      });
  
      after(() => {
        saleProductModel.create.restore();
        productModel.findAll.restore();
        sequelize.transaction.restore();
        sequelize.literal.restore();
      });

      it('return an array of objects in the key "itemsSold" when bulk insert are a success', async () => {
        stub(saleModel, 'create').resolves({ id: 2 });

        const { result: { itemsSold } } = await postSaleProduct(successMockArray);

        expect(itemsSold).to.deep.equals(successMockArray);

        saleModel.create.restore();
      });

      it('return an error of "many_sales"', async () => {
        stub(saleModel, 'create').resolves({ id: 2 });

        const responseService = await postSaleProduct(failMockArrayTwo);

        expect(responseService).to.have.own.property('message');

        saleModel.create.restore();
      });

      it('return an error server', async () => {
        stub(saleModel, 'create').rejects(new Error('Something went wrong'));

        const responseService = await postSaleProduct(failMockArrayOne);

        expect(responseService).to.have.own.property('message');

        saleModel.create.restore();
      });
      
      it('validate the array of salesObj, that must have, which one, the keys "product_id" and "quantity"', () => {
        const response = {};
        const request = {};
        request.body = failMockArrayOne;
        let next = () => {};

        response.status = stub().returns(response);
        response.json = stub().returns();
        next = stub().returns();

        validateProductIdAndQuantity(request, response, next);

        expect(response.status.calledWith(400)).to.be.equal(true);
      });

    });
    
    describe('getSalesProducts that', () => {
      
      const { getSalesProducts } = require('../../services/saleProduct');

      const saleProductModelMockArray = [
        {
          dataValues: {
            saleId: 1,
            sale_id: 1,
            quantity: 5,
            product_id: 1,
            productId: 1,
          },
        },
        {
          dataValues: {
            saleId: 1,
            sale_id: 1,
            quantity: 10,
            product_id: 2,
            productId: 2,
          },
        },
      ];
      
      const saleModelMockObj = {
        dataValues: {
          id: 1,
          date: new Date('2022-01-27T15:56:02.000Z'),
        },
      };

      const resultMockArray = [
        {
          saleId: 1,
          quantity: 5,
          product_id: 1,
          date: new Date('2022-01-27T15:56:02.000Z'),
        },
        {
          saleId: 1,
          quantity: 10,
          product_id: 2,
          date: new Date('2022-01-27T15:56:02.000Z'),
        },
      ];

      before(() => {
        stub(saleModel, 'findByPk').resolves(saleModelMockObj);
      });
  
      after(() => {
        saleModel.findByPk.restore();
      });

      it('return all sales_products', async () => {
        stub(saleProductModel, 'findAll').resolves(saleProductModelMockArray);

        const { result } = await getSalesProducts();

        expect(result).to.deep.equals(resultMockArray);

        saleProductModel.findAll.restore();
      });

      it('return an error server', async () => {
        stub(saleProductModel, 'findAll').resolves();

        const responseService = await getSalesProducts();

        expect(responseService).to.have.own.property('message');

        saleProductModel.findAll.restore();
      });

    });
    
    describe('getSalesProductsById that', () => {
      
      const { getSalesProductsById } = require('../../services/saleProduct');

      const saleProductModelMockArray = [
        {
          dataValues: {
            saleId: 1,
            sale_id: 1,
            quantity: 5,
            product_id: 1,
            productId: 1,
          },
        },
        {
          dataValues: {
            saleId: 1,
            sale_id: 1,
            quantity: 10,
            product_id: 2,
            productId: 2,
          },
        },
      ];

      const saleModelMockArray = {
        id: 1,
        date: new Date('2022-01-27T15:56:02.000Z'),
      };

      const resultMockArray = [
        {
          quantity: 5,
          product_id: 1,
          date: new Date('2022-01-27T15:56:02.000Z'),
        },
        {
          quantity: 10,
          product_id: 2,
          date: new Date('2022-01-27T15:56:02.000Z'),
        }
      ];

      before(() => {
        stub(saleProductModel, 'findAll').resolves(saleProductModelMockArray);
      });
  
      after(() => {
        saleProductModel.findAll.restore();
      });

      it('return all sales_products with this saleId', async () => {
        stub(saleModel, 'findByPk').resolves(saleModelMockArray);

        const { result } = await getSalesProductsById(1);

        expect(result).to.deep.equals(resultMockArray);

        saleModel.findByPk.restore();
      });

      it('return a error message if has no one sale with this saleId', async () => {
        stub(saleModel, 'findByPk').resolves();

        const { message } = await getSalesProductsById(1);

        expect(message).to.be.equals('Sale not found');

        saleModel.findByPk.restore();
      });
      

    });
    
    describe('editSalesProductsById that', () => {
      
      const { editSalesProductsById } = require('../../services/saleProduct');

      const mockArray = [
        {
          product_id: 1,
          quantity: 10,
        }
      ];

      it('return all the updated items in the key "itemUpdated" in the obj', async () => {
        stub(saleProductModel, 'update').resolves(mockArray);

        const responseService = await editSalesProductsById(
          { saleArray: mockArray, saleId: 1 },
        );

        expect(responseService.result.itemUpdated).to.deep.equals(mockArray);

        saleProductModel.update.restore();
      });

      it('return an error server', async () => {
        stub(saleProductModel, 'update').rejects(new Error('Something went wrong'));

        const responseService = await editSalesProductsById(
          { saleArray: mockArray, saleId: 1 },
        );

        expect(responseService).to.have.own.property('message');

        saleProductModel.update.restore();
      });

    });

    describe('deleteSalesProductsById that', () => {
      
      const { deleteSalesProductsById } = require('../../services/saleProduct');

      const mockArrayResult = [
        {
          product_id: 1,
          quantity: 15,
          date: new Date('2022-01-28T21:30:37.000Z')
        },
        {
          product_id: 2,
          quantity: 30,
          date: new Date('2022-01-28T21:30:37.000Z')
        }
      ];

      const saleMock = {
        dataValues: { date: new Date('2022-01-28T21:30:37.000Z') },
      };

      const allSalesProductsMock = [
        {
          product_id: 1,
          quantity: 15,
        },
        {
          product_id: 2,
          quantity: 30,
        },
      ];

      const allProductsMock = [
        { dataValues: {
          id: 1,
          quantity: 15,
        } },
        { dataValues: {
          id: 2,
          quantity: 30,
        } },
      ];

      before(() => {
        stub(sequelize, 'transaction').resolves({
          commit: () => {},
          rollback: () => {},
        });
        stub(sequelize, 'literal').returns(true)
        stub(productModel, 'update').resolves(Promise.resolve(true));
        stub(productModel, 'findAll').resolves(Promise.resolve(allProductsMock));
        stub(saleModel, 'destroy').resolves(true);
      });
  
      after(() => {
        sequelize.transaction.restore();
        productModel.update.restore();
        productModel.findAll.restore();
        saleModel.destroy.restore();
        sequelize.literal.restore();
      });

      it('return all the products that have had your quantity increased when the sale was deleted', async () => {
        stub(saleProductModel, 'findAll').resolves(allSalesProductsMock);
        stub(saleModel, 'findByPk').resolves(saleMock);

        const { result } = await deleteSalesProductsById(2);

        expect(result).to.deep.equals(mockArrayResult);

        saleProductModel.findAll.restore();
        saleModel.findByPk.restore();
      });

      it('return a message when the server broken in the first trycatch', async () => {
        stub(saleModel, 'findByPk').resolves();
        
        const { message: catchOneMessage } = await deleteSalesProductsById(2);
        
        expect(catchOneMessage).to.deep.equals('Sale not found');
        
        saleModel.findByPk.restore();
      });

      it('return a message when the server broken in the second trycatch', async () => {
        stub(saleModel, 'findByPk').resolves(saleMock);
        stub(saleProductModel, 'findAll').resolves();
        
        const { message: catchTwoMessage } = await deleteSalesProductsById(2);
        
        expect(catchTwoMessage).to.deep.equals('Something went wrong');
        
        saleModel.findByPk.restore();
        saleProductModel.findAll.restore();
      });
      

    });

  });

});
