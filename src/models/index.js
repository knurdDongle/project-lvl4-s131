// @flow

import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import dbConfig from '../../config/config';

const basename = path.basename(__filename);
const db = {};
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const sequelize = new Sequelize(dbConfig[process.env.NODE_ENV]);

fs.readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    console.log(model, 'model');
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  console.log(db[modelName], 'db');
  if (db[modelName].associate) {
    console.log(modelName, 'ASOS');
    db[modelName].associate(db);
  }
});


const sync = async () => {
  console.log(await Promise.all(Object.keys(db).map(key => db[key].sync())));
};

sync();
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
