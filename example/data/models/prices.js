module.exports = (sequelize, DataTypes) =>
   sequelize.define(
      'prices',
      {
         rowId: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
         },
         date: {
            type: DataTypes.DATE,
         },
         refer: {
            type: DataTypes.STRING(30),
         },
         open: {
            type: DataTypes.FLOAT,
         },
         close: {
            type: DataTypes.FLOAT,
         },
         low: {
            type: DataTypes.FLOAT,
         },
         high: {
            type: DataTypes.FLOAT,
         },
         volum: {
            type: DataTypes.INTEGER(11),
         },
      },
      {
         tableName: 'prices',
      }
   );
