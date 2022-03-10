"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class movies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      movies.belongsTo(models.genres, {
        as: "category",
        foreignKey: {
          name: "genre",
        },
      });

      movies.hasMany(models.transactions, {
        as: "film",
        foreignKey: {
          name: "movieId",
        },
      });
    }
  }
  movies.init(
    {
      name: DataTypes.STRING,
      genre: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      desc: DataTypes.TEXT,
      poster: DataTypes.STRING,
      background: DataTypes.STRING,
      video: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "movies",
    }
  );
  return movies;
};
