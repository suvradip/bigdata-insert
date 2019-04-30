# Bigdata insert [![npm](https://img.shields.io/npm/v/bigdata-insert.svg)](https://www.npmjs.com/package/bigdata-insertl) [![license](https://img.shields.io/github/license/suvradip/bigdata-insert.svg)](https://github.com/suvradip/bigdata-insert/blob/master/LICENSE)

> A small utility tool to help insert rows to mysql database from a csv file.

## Why should I care?

Say you have a big csv file (comma separated) which containe millions of rows and you want to insert those data into mysql database. How do you do that? Great news is that this package help you to that easily with minimum code if you are using [sequlize](http://docs.sequelizejs.com/).

## Installation

```
$ npm install bigdata-insert
```

## Usage

```js
const path = require('path');
const BigDataInsert = require('bigdata-insert');

/**
 *  Please note here, we are using sequilize as a dependency and
 *  these [models](http://docs.sequelizejs.com/manual/models-definition.html#import) are constructed using sequilize data structure
 */
const stocks = require('./data/models/stocks');
const prices = require('./data/models/prices');

const bdi = new BigDataInsert({
   models: [
      {
         file: path.resolve('data/csv/stocks.csv'),
         model: stocks,
      },
      {
         file: path.resolve('data/csv/prices.csv'),
         model: prices,
      },
   ],
   connection: {
      dbname: 'stock-data',
      user: 'root',
   },
});

bdi.start();
```

## API(s)

### constructor

Constructor has two parameter options and callback

```js
constructor({
	models: <Array of objects>,
	connection: <Object>
	}, callback)
```

`model` parameter description

```js
models: [{
	file:  <required : absolute path to csv file>
	model: <required : sequelize model structure>
	name:  <optional : for model reference key>
}]
```

`connection` parameter description

```js
connection: {
	dbname: <name of a database>
	user: <database username>
	pass: <database password>
	host: <database host>
}
```

> **You can also define the connection settings in `.env` file like this**

```
DATABASE_NAME = stock-data
DATABASE_USERNAME = root
DATABASE_PASSWORD =
DATABASE_HOST =
```

`callback` parameter description

callback has a paramer which is a sequilze model defination. This callback helps to do association as per sequilize document. You need to define a `name` in each model while passing to the constructor.

Example

```js
const bdi = new BigDataInsert(
   {
      models: [
         {
            file: path.resolve('data/csv/stocks.csv'),
            model: stocks,
            name: 'stocks',
         },
         {
            file: path.resolve('data/csv/prices.csv'),
            model: prices,
            name: 'prices',
         },
      ],
   },
   model => {
      model.stocks.hasMany(model.prices, {
         foreignKey: 'refer',
         targetKey: 'symbol',
         constraints: false,
      });
   }
);
```

### start()

To start the data insertion process

Example

```js
bdi.start();
```
