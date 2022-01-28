const { expect } = require('chai');

const { stub } = require('sinon');

describe('The router', () => {

  const response = {};
  const request = {};
  let next = () => {};

  before(() => {
    response.status = stub().returns(response);
    response.json = stub().returns();
    next = stub().returns();
  });
  
  describe('"product" has the controller', () => {

    const productControllers = require('../../controllers/product');
    const productServices = require('../../services/product');

    describe('postProduct that', () => {

      const { postProduct } = productControllers;
      
      describe('when was a success', () => {

        const mockResultSuccess = {
          id: 2,
          name: 'Traje do homem de ferro',
          quantity: 4,
        };
        
        const serviceResultSuccess = {
          httpStatusCode: 201,
          result: mockResultSuccess,
        };
  
        before(() => {
          stub(productServices, 'postProduct').resolves(serviceResultSuccess);
        });
  
        after(() => {
          productServices.postProduct.restore();
        });

        request.body = {
          name: 'Traje do homem de ferro',
          quantity: 4,
        };

        it('return "201" as http status code', async () => {
          await postProduct(request, response, next);

          expect(response.status.calledWith(201)).to.be.true;
        });
        
        it('return the product object', async () => {
          await postProduct(request, response, next);

          expect(response.json.calledWith(serviceResultSuccess.result)).to.be.true;
        });

      });

      describe('when was a fail', () => {
        
        const serviceResultFail = {
          code: 'error',
          message: 'Has a error message',
          httpStatusCode: 400,
        };

        const responseReturn = {
          message: serviceResultFail.message,
          code: serviceResultFail.code,
        }

        before(() => {
          stub(productServices, 'postProduct').resolves(serviceResultFail);
        });
  
        after(() => {
          productServices.postProduct.restore();
        });
        
        it('return a correct http status code', async () => {
          await postProduct(request, response, next);

          expect(response.status.calledWith(serviceResultFail.httpStatusCode)).to.be.true;
        });

        it('return an error message and a code error', async () => {
          await postProduct(request, response, next);

          expect(response.json.calledWith(responseReturn)).to.be.true;
        });

      });
      

    });

    describe('getProducts that', () => {

      const { getProducts } = productControllers;
      
      describe('when was a success', () => {

        const mockResultSuccess = [
          {
            id: 1,
            name: 'Martelo de Thor',
            quantity: 10
          },
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
  
        const serviceResultSuccess = {
          httpStatusCode: 200,
          result: mockResultSuccess,
        };
        
        before(() => {
          stub(productServices, 'getProducts').resolves(serviceResultSuccess);
        });
  
        after(() => {
          productServices.getProducts.restore();
        });

        it('return "200" as http status code', async () => {
          await getProducts(request, response, next);

          expect(response.status.calledWith(200)).to.be.true;
        });
        
        it('return the array of products', async () => {
          await getProducts(request, response, next);

          expect(response.json.calledWith(serviceResultSuccess.result)).to.be.true;
        });

      });

      describe('when was a fail', () => {

        const serviceResultFail = {
          code: 'error',
          message: 'Has a error message',
          httpStatusCode: 400,
        };

        const responseReturn = {
          message: serviceResultFail.message,
          code: serviceResultFail.code,
        }

        before(() => {
          stub(productServices, 'getProducts').resolves(serviceResultFail);
        });
  
        after(() => {
          productServices.getProducts.restore();
        });
        
        it('return a correct http status code', async () => {
          await getProducts(request, response, next);

          expect(response.status.calledWith(serviceResultFail.httpStatusCode)).to.be.true;
        });

        it('return an error message and a code error', async () => {
          await getProducts(request, response, next);

          expect(response.json.calledWith(responseReturn)).to.be.true;
        });

      });

    });

    describe('getProductById that', () => {

      const { getProductById } = productControllers;

      request.params = { id: 2 };
      
      describe('when was a success', () => {

        const mockResultSuccess = {
          id: 2,
          name: 'Martelo de Thor',
          quantity: 10
        };
  
        const serviceResultSuccess = {
          httpStatusCode: 200,
          result: mockResultSuccess,
        };
        
        before(() => {
          stub(productServices, 'getProductById').resolves(serviceResultSuccess);
        });
  
        after(() => {
          productServices.getProductById.restore();
        });

        it('return the product object', async () => {
          await getProductById(request, response, next);

          expect(response.json.calledWith(serviceResultSuccess.result)).to.be.true;
        });

        it('return "200" as http status code', async () => {
          await getProductById(request, response, next);

          expect(response.status.calledWith(200)).to.be.true;
        });

      });

      describe('when was a fail', () => {

        const serviceResultFail = {
          code: 'error',
          message: 'Has a error message',
          httpStatusCode: 400,
        };

        const responseReturn = {
          message: serviceResultFail.message,
          code: serviceResultFail.code,
        }

        before(() => {
          stub(productServices, 'getProductById').resolves(serviceResultFail);
        });
  
        after(() => {
          productServices.getProductById.restore();
        });
        
        it('return a correct http status code', async () => {
          await getProductById(request, response, next);

          expect(response.status.calledWith(serviceResultFail.httpStatusCode)).to.be.true;
        });

        it('return an error message and a code error', async () => {
          await getProductById(request, response, next);

          expect(response.json.calledWith(responseReturn)).to.be.true;
        });

      });

    });

    describe('editProductById that', () => {

      const { editProductById } = productControllers;

      request.params = { id: 2 };
      
      describe('when was a success', () => {

        const mockResultSuccess = {
          id: 2,
          name: 'Martelo de Thor',
          quantity: 10
        };

        request.body = {
          name: mockResultSuccess.name,
          quantity: mockResultSuccess.quantity,
        };
  
        const serviceResultSuccess = {
          httpStatusCode: 201,
          result: mockResultSuccess,
        };
        
        before(() => {
          stub(productServices, 'editProductById').resolves(serviceResultSuccess);
        });
  
        after(() => {
          productServices.editProductById.restore();
        });

        it('return the product object', async () => {
          await editProductById(request, response, next);

          expect(response.json.calledWith(serviceResultSuccess.result)).to.be.true;
        });

        it('return "201" as http status code', async () => {
          await editProductById(request, response, next);

          expect(response.status.calledWith(201)).to.be.true;
        });

      });

      describe('when was a fail', () => {

        const serviceResultFail = {
          code: 'error',
          message: 'Has a error message',
          httpStatusCode: 400,
        };

        const responseReturn = {
          message: serviceResultFail.message,
          code: serviceResultFail.code,
        }

        before(() => {
          stub(productServices, 'editProductById').resolves(serviceResultFail);
        });
  
        after(() => {
          productServices.editProductById.restore();
        });
        
        it('return a correct http status code', async () => {
          await editProductById(request, response, next);

          expect(response.status.calledWith(serviceResultFail.httpStatusCode)).to.be.true;
        });

        it('return an error message and a code error', async () => {
          await editProductById(request, response, next);

          expect(response.json.calledWith(responseReturn)).to.be.true;
        });

      });

    });

    describe('deleteProductById that', () => {

      const { deleteProductById } = productControllers;

      request.params = { id: 2 };
      
      describe('when was a success', () => {

        const mockResultSuccess = {
          id: 2,
          name: 'Martelo de Thor',
          quantity: 10
        };
  
        const serviceResultSuccess = {
          httpStatusCode: 200,
          result: mockResultSuccess,
        };
        
        before(() => {
          stub(productServices, 'deleteProductById').resolves(serviceResultSuccess);
        });
  
        after(() => {
          productServices.deleteProductById.restore();
        });

        it('return the product object', async () => {
          await deleteProductById(request, response, next);

          expect(response.json.calledWith(serviceResultSuccess.result)).to.be.true;
        });

        it('return "200" as http status code', async () => {
          await deleteProductById(request, response, next);

          expect(response.status.calledWith(200)).to.be.true;
        });

      });

      describe('when was a fail', () => {

        const serviceResultFail = {
          code: 'error',
          message: 'Has a error message',
          httpStatusCode: 400,
        };

        const responseReturn = {
          message: serviceResultFail.message,
          code: serviceResultFail.code,
        }

        before(() => {
          stub(productServices, 'deleteProductById').resolves(serviceResultFail);
        });
  
        after(() => {
          productServices.deleteProductById.restore();
        });
        
        it('return a correct http status code', async () => {
          await deleteProductById(request, response, next);

          expect(response.status.calledWith(serviceResultFail.httpStatusCode)).to.be.true;
        });

        it('return an error message and a code error', async () => {
          await deleteProductById(request, response, next);

          expect(response.json.calledWith(responseReturn)).to.be.true;
        });

      });

    });

  });

  describe('"saleProduct" has the controller', () => {
    
    const saleProductControllers = require('../../controllers/saleProduct');
    const saleProductServices = require('../../services/saleProduct');

    describe('postSaleProduct that', () => {

      const { postSaleProduct } = saleProductControllers;
      
      describe('when was a success', () => {

        request.body = [
          {
            product_id: 1,
            quantity: 2
          },
          {
            product_id: 2,
            quantity: 5
          }
        ];

        const mockResultSuccess = {
          id: 4,
          itemsSold: request.body,
        };
        
        const serviceResultSuccess = {
          httpStatusCode: 201,
          result: mockResultSuccess,
        };
  
        before(() => {
          stub(saleProductServices, 'postSaleProduct').resolves(serviceResultSuccess);
        });
  
        after(() => {
          saleProductServices.postSaleProduct.restore();
        });

        it('return "201" as http status code', async () => {
          await postSaleProduct(request, response, next);

          expect(response.status.calledWith(201)).to.be.true;
        });
        
        it('return the object with a key that contains a array of the sales_products created', async () => {
          await postSaleProduct(request, response, next);

          expect(response.json.calledWith(serviceResultSuccess.result)).to.be.true;
        });

      });

      describe('when was a fail', () => {
        
        const serviceResultFail = {
          code: 'error',
          message: 'Has a error message',
          httpStatusCode: 400,
        };

        const responseReturn = {
          message: serviceResultFail.message,
          code: serviceResultFail.code,
        }

        before(() => {
          stub(saleProductServices, 'postSaleProduct').resolves(serviceResultFail);
        });
  
        after(() => {
          saleProductServices.postSaleProduct.restore();
        });
        
        it('return a correct http status code', async () => {
          await postSaleProduct(request, response, next);

          expect(response.status.calledWith(serviceResultFail.httpStatusCode)).to.be.true;
        });

        it('return an error message and a code error', async () => {
          await postSaleProduct(request, response, next);

          expect(response.json.calledWith(responseReturn)).to.be.true;
        });

      });
      

    });

    describe('getSalesProducts that', () => {

      const { getSalesProducts } = saleProductControllers;
      
      describe('when was a success', () => {

        const mockResultSuccess = [
          {
            saleId: 1,
            quantity: 5,
            product_id: 1,
            date: new Date('2022-01-27T15:56:02.000Z')
          },
          {
            saleId: 1,
            quantity: 10,
            product_id: 2,
            date: new Date('2022-01-27T15:56:02.000Z')
          },
          {
            saleId: 2,
            quantity: 30,
            product_id: 3,
            date: new Date('2022-01-27T15:56:02.000Z')
          }
        ];
        
        const serviceResultSuccess = {
          httpStatusCode: 200,
          result: mockResultSuccess,
        };
  
        before(() => {
          stub(saleProductServices, 'getSalesProducts').resolves(serviceResultSuccess);
        });
  
        after(() => {
          saleProductServices.getSalesProducts.restore();
        });

        it('return "200" as http status code', async () => {
          await getSalesProducts(request, response, next);

          expect(response.status.calledWith(201)).to.be.true;
        });
        
        it('return the array of sales_products', async () => {
          await getSalesProducts(request, response, next);

          expect(response.json.calledWith(serviceResultSuccess.result)).to.be.true;
        });

      });

      describe('when was a fail', () => {
        
        const serviceResultFail = {
          code: 'error',
          message: 'Has a error message',
          httpStatusCode: 400,
        };

        const responseReturn = {
          message: serviceResultFail.message,
          code: serviceResultFail.code,
        }

        before(() => {
          stub(saleProductServices, 'getSalesProducts').resolves(serviceResultFail);
        });
  
        after(() => {
          saleProductServices.getSalesProducts.restore();
        });
        
        it('return a correct http status code', async () => {
          await getSalesProducts(request, response, next);

          expect(response.status.calledWith(serviceResultFail.httpStatusCode)).to.be.true;
        });

        it('return an error message and a code error', async () => {
          await getSalesProducts(request, response, next);

          expect(response.json.calledWith(responseReturn)).to.be.true;
        });

      });
      

    });

    describe('getSalesProductsById that', () => {

      const { getSalesProductsById } = saleProductControllers;

      request.params = { id: 2 };
      
      describe('when was a success', () => {

        const mockResultSuccess = [
          {
            'quantity': 10,
            'product_id': 2,
            'date': new Date('2022-01-28T16:25:38.000Z')
          }
        ];
        
        const serviceResultSuccess = {
          httpStatusCode: 200,
          result: mockResultSuccess,
        };
  
        before(() => {
          stub(saleProductServices, 'getSalesProductsById').resolves(serviceResultSuccess);
        });
  
        after(() => {
          saleProductServices.getSalesProductsById.restore();
        });

        it('return "200" as http status code', async () => {
          await getSalesProductsById(request, response, next);

          expect(response.status.calledWith(201)).to.be.true;
        });
        
        it('return the sales_products object', async () => {
          await getSalesProductsById(request, response, next);

          expect(response.json.calledWith(serviceResultSuccess.result)).to.be.true;
        });

      });

      describe('when was a fail', () => {
        
        const serviceResultFail = {
          code: 'error',
          message: 'Has a error message',
          httpStatusCode: 400,
        };

        const responseReturn = {
          message: serviceResultFail.message,
          code: serviceResultFail.code,
        }

        before(() => {
          stub(saleProductServices, 'getSalesProductsById').resolves(serviceResultFail);
        });
  
        after(() => {
          saleProductServices.getSalesProductsById.restore();
        });
        
        it('return a correct http status code', async () => {
          await getSalesProductsById(request, response, next);

          expect(response.status.calledWith(serviceResultFail.httpStatusCode)).to.be.true;
        });

        it('return an error message and a code error', async () => {
          await getSalesProductsById(request, response, next);

          expect(response.json.calledWith(responseReturn)).to.be.true;
        });

      });
      

    });

    describe('editSalesProductsById that', () => {

      const { editSalesProductsById } = saleProductControllers;

      request.params = { id: 2 };
      
      describe('when was a success', () => {

        request.body = [
          {
            product_id: 1,
            quantity: 10
          }
        ];

        const mockResultSuccess = {
          saleId: 1,
          itemUpdated: request.body,
        };
        
        const serviceResultSuccess = {
          httpStatusCode: 200,
          result: mockResultSuccess,
        };
  
        before(() => {
          stub(saleProductServices, 'editSalesProductsById').resolves(serviceResultSuccess);
        });
  
        after(() => {
          saleProductServices.editSalesProductsById.restore();
        });

        it('return "200" as http status code', async () => {
          await editSalesProductsById(request, response, next);

          expect(response.status.calledWith(201)).to.be.true;
        });
        
        it('return the sales_products object', async () => {
          await editSalesProductsById(request, response, next);

          expect(response.json.calledWith(serviceResultSuccess.result)).to.be.true;
        });

      });

      describe('when was a fail', () => {
        
        const serviceResultFail = {
          code: 'error',
          message: 'Has a error message',
          httpStatusCode: 400,
        };

        const responseReturn = {
          message: serviceResultFail.message,
          code: serviceResultFail.code,
        }

        before(() => {
          stub(saleProductServices, 'editSalesProductsById').resolves(serviceResultFail);
        });
  
        after(() => {
          saleProductServices.editSalesProductsById.restore();
        });
        
        it('return a correct http status code', async () => {
          await editSalesProductsById(request, response, next);

          expect(response.status.calledWith(serviceResultFail.httpStatusCode)).to.be.true;
        });

        it('return an error message and a code error', async () => {
          await editSalesProductsById(request, response, next);

          expect(response.json.calledWith(responseReturn)).to.be.true;
        });

      });
      

    });

  });
  
  

});
