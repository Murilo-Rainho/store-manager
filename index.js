require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const PORT = process.env.PORT || 3010;

app.use(bodyParser.json());

const { productRouter, saleProductRouter } = require('./routers');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.use('/products', productRouter);

app.use('/sales', saleProductRouter);

app.listen(process.env.PORT, () => {
  console.log(`Escutando na porta ${PORT}`);
});
