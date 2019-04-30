require('dotenv').config();
const Sequelize = require('sequelize');
const csv = require('csv-parser');
const fs = require('fs');
const shortid = require('shortid');
const ora = require('ora');

const spinner = ora('Data insertion process');

function sequelizeInit({
   dbname = process.env.DATABASE_NAME,
   user = process.env.DATABASE_USERNAME,
   pass = process.env.DATABASE_PASSWORD,
   host = process.env.DATABASE_HOST,
}) {
   const sequelize = new Sequelize(dbname, user, pass, {
      host,
      dialect: 'mysql',
      maxConcurrentQueries: 100,
      logging: false,
      pool: {
         max: 100,
         min: 20,
         idle: 20000,
         acquire: 20000,
      },
   });
   return sequelize;
}

function inserData(data, model) {
   try {
      return model.bulkCreate(data);
   } catch (error) {
      spinner.fail('data insertion failed');
      console.error(error);
      process.exit();
      return false;
   }
}

function operations(filePath, seqModel) {
   return new Promise((resolve, reject) => {
      const items = [];
      let counter = 0;
      fs.createReadStream(filePath)
         .pipe(csv())
         .on('data', async obj => {
            if (counter < 1000) {
               items.push(obj);
               counter += 1;
            } else {
               inserData(items, seqModel);
               counter = 0;
               items.length = 0;
            }
         })
         .on('end', async () => {
            await inserData(items, seqModel);
            resolve('finished');
         });
   });
}

class BigDataInsert {
   constructor({ models = [], connection = {} }, callBack) {
      this.sequelize = sequelizeInit(connection);
      this.sequelizeModels = {};
      this.dataModels = models.map(a => ({ ...a, key: a.name || shortid.generate() }));

      this.dataModels.forEach(({ model, key }) => {
         this.sequelizeModels[key] = model(this.sequelize, Sequelize);
      });

      callBack && callBack(this.sequelizeModels);
   }

   start() {
      spinner.start();
      this.sequelize.sync({ force: true }).then(() => {
         const { dataModels, sequelizeModels } = this;
         async function exceution() {
            const { file, key } = dataModels.shift();
            const fileName = file.split('/').pop();
            const model = sequelizeModels[key];

            spinner.text = `Insertion started for ${fileName} file`;
            await operations(file, model);

            if (dataModels.length !== 0) {
               exceution();
            } else {
               spinner.succeed('Data insertion successfull.');
               process.exit();
            }
         }
         exceution();
      });
   }
}

module.exports = BigDataInsert;
