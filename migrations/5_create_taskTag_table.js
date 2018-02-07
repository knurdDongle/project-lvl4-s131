'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('TaskTags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      task_id: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      tag_id: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Date.now()
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Date.now()
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('TaskTags');
  }
};