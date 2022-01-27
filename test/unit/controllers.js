const { expect } = require('chai');

const { stub } = require('sinon');

describe('The router', () => {
  
  describe('"product" has the controller', () => {

    const productControllers = require('../../controllers/product');
    const productServices = require('../../services/product');

    // const response = {};
    // const request = {};
    // let next = () => {};

    describe('postProduct that', () => {
      // const { postProduct } = productControllers;
      
      const mockResultSuccess = {
        id: 2,
        name: 'Traje do homem de ferro',
        quantity: 4,
      };

      // before(() => {
      //   response.status = stub().returns(response);
      //   response.json = stub().returns(mockResultSuccess);
      //   next = stub().returns();
      // });

      const serviceResultSuccess = {
        httpStatusCode: 201,
        result: mockResultSuccess,
      };

      
      describe('when was a success', () => {

        const { postProduct } = productControllers;

        const response = {};
        const request = {};
        let next = () => {};

        before(() => {
          response.status = stub().returns(response);
          response.json = stub().returns(mockResultSuccess);
          next = stub().returns();

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

          console.log(response);

          expect(response.json.calledWith(serviceResultSuccess.result)).to.be.true;
        });

      });

    });

    // describe('getProducts that', () => {
    //   const { getProducts } = productControllers;

    //   const mockResultSuccess = [
    //     {
    //       id: 1,
    //       name: 'Martelo de Thor',
    //       quantity: 10
    //     },
    //     {
    //       id: 2,
    //       name: 'Traje de encolhimento',
    //       quantity: 20
    //     },
    //     {
    //       id: 3,
    //       name: 'Escudo do Capitão América',
    //       quantity: 30
    //     }
    //   ];

    //   const serviceResultSuccess = {
    //     httpStatusCode: 200,
    //     result: mockResultSuccess,
    //   };

    //   const serviceResultFail = {
    //     code: 'error',
    //     message: 'Product not found',
    //     httpStatusCode: 400,
    //   };
      
    //   describe('when was a success', () => {
        
    //     before(() => {
    //       stub(productServices, 'getProducts').resolves(serviceResultSuccess);
    //     });
  
    //     after(() => {
    //       productServices.getProducts.restore();
    //     });

    //     it('return "200" as http status code', async () => {
    //       await getProducts(request, response, next);

    //       expect(response.status.calledWith(200)).to.be.true;
    //     });
        
    //     it('return the product object', async () => {
    //       await getProducts(request, response, next);

    //       expect(response.json.calledWith(serviceResultSuccess.result)).to.be.true;
    //     });

    //   });

    //   describe('when was a fail', () => {

    //     const responseReturn = {
    //       message: serviceResultFail.message,
    //       code: serviceResultFail.code,
    //     }

    //     before(() => {
    //       stub(productServices, 'getProducts').resolves(serviceResultFail);
    //     });
  
    //     after(() => {
    //       productServices.getProducts.restore();
    //     });
        
    //     it('return an error message and a code error', async () => {
    //       await getProducts(request, response, next);

    //       expect(response.json.calledWith(responseReturn)).to.be.true;
    //     });

    //   });

    // });

  });
  

});
