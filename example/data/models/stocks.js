module.exports = (sequelize, DataTypes) =>
   sequelize.define(
      'stocks',
      {
         symbol: {
            type: DataTypes.STRING(36),
            primaryKey: true,
         },
         name: {
            type: DataTypes.STRING(200),
         },
         marketCap: {
            type: DataTypes.BIGINT,
         },
         sector: {
            type: DataTypes.STRING(150),
         },
         industry: {
            type: DataTypes.STRING(100),
         },
      },
      {
         tableName: 'stocks',
      }
   );
