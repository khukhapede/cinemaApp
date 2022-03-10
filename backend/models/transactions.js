"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transactions.belongsTo(models.users, {
        as: "buyer",
        foreignKey: {
          name: "userId",
        },
      });

      transactions.belongsTo(models.movies, {
        as: "film",
        foreignKey: {
          name: "movieId",
        },
      });
    }
  }
  transactions.init(
    {
      userId: DataTypes.INTEGER,
      movieId: DataTypes.INTEGER,
      receipt: DataTypes.STRING,
      status: DataTypes.STRING,
      numAccount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "transactions",
    }
  );
  return transactions;
};
