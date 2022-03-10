"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("movies", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      genre: {
        type: Sequelize.INTEGER,
        references: {
          model: "genres",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      price: {
        type: Sequelize.INTEGER,
      },
      desc: {
        type: Sequelize.TEXT,
      },
      poster: {
        type: Sequelize.STRING,
      },
      background: {
        type: Sequelize.STRING,
      },
      video: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("movies");
  },
};
