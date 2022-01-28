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
      
      // it('return a error message when has no product with this productId', async () => {
      //   stub(productModel, 'findByPk').rejects();

      //   const { message } = await deleteProductById(mockId);

      //   expect(message).to.be.equal('Product not found');

      //   productModel.findByPk.restore();
      // });

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

  describe('"saleProduct" has the service', () => {

    describe('postSaleProduct that', () => {

      const { postSaleProduct } = require('../../services/saleProduct');
      const { validateProductIdAndQuantity } = require('../../middlewares/saleProduct');

      const mockArray = [
        {
          product_id: 1,
          quantity: 2
        },
        {
          product_id: 2,
          quantity: 5
        },
      ]	;

      const failMockArray = [
        {
          quantity: 1,
        },
        {
          product_id: 2,
          quantity: 20,
        },
      ];

      it('return an array of objects in the key "itemsSold" when bulk insert are a success', async () => {
        stub(sequelize, 'transaction').resolves({ commit: () => {} });
        stub(saleModel, 'create').resolves({ id: 2 });
        stub(saleProductModel, 'create').resolves();

        const { result: { itemsSold } } = await postSaleProduct(mockArray);

        expect(itemsSold).to.deep.equals(mockArray);

        saleModel.create.restore();
        saleProductModel.create.restore();
        sequelize.transaction.restore();
      });
      
      it('validate the array of salesObj, that must have, which one, the keys "product_id" and "quantity"', () => {
        const response = {};
        const request = {};
        request.body = failMockArray;
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
        stub(saleProductModel, 'findAll').resolves(saleProductModelMockArray);
        stub(saleModel, 'findByPk').resolves(saleModelMockObj);
      });
  
      after(() => {
        saleProductModel.findAll.restore();
        saleModel.findByPk.restore();
      });

      it('return all sales_products', async () => {
        const { result } = await getSalesProducts();

        expect(result).to.deep.equals(resultMockArray);
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

      before(() => {
        stub(saleProductModel, 'update').resolves(true);
      });
  
      after(() => {
        saleProductModel.update.restore();
      });

      it('return all the updated items in the key "itemUpdated" in the obj', async () => {
        const { result: { itemUpdated } } = await editSalesProductsById(
          { saleArray: mockArray, saleId: 1 },
        );

        expect(itemUpdated).to.deep.equals(mockArray);
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
        stub(saleModel, 'findByPk').resolves(saleMock);
        stub(sequelize, 'transaction').resolves({ commit: () => {} });
        stub(saleProductModel, 'findAll').resolves(allSalesProductsMock);
        stub(productModel, 'update').resolves(Promise.resolve(true));
        stub(productModel, 'findAll').resolves(Promise.resolve(allProductsMock));
        stub(saleModel, 'destroy').resolves(true);
      });
  
      after(() => {
        saleModel.findByPk.restore();
        sequelize.transaction.restore();
        saleProductModel.findAll.restore();
        productModel.update.restore();
        productModel.findAll.restore();
        saleModel.destroy.restore();
      });

      it('return all the products that have had your quantity increased when the sale was deleted', async () => {
        const { result } = await deleteSalesProductsById(2);

        expect(result).to.deep.equals(mockArrayResult);
      });

    });

  });

});
