const path = require('path');
const BigDataInsert = require('../src/index');

const stocks = require('./data/models/stocks');
const prices = require('./data/models/prices');

const bdi = new BigDataInsert({
   models: [
      {
         file: path.resolve('example/data/csv/stocks.csv'),
         model: stocks,
         name: 'stocks',
      },
      {
         file: path.resolve('example/data/csv/prices.csv'),
         model: prices,
         name: 'prices',
      },
   ],
   connection: {
      dbname: 'stock-data',
      user: 'root',
   },
});

bdi.start();
