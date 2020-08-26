'use strict'

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Sequelize.Model {}
    Course.init ({
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
      },
      title: {
          type: Sequelize.STRING,
          allowNull: false, // disallow null
      },
      description: {
          type: Sequelize.TEXT,
          allowNull: false, // disallow null
      },
      estimatedTime: {
          type: Sequelize.STRING,
          allownull: true,
      },
      materialsNeeded: {
          type: Sequelize.STRING,
          allownull: true,
      }
  }, { sequelize });

       Course.associate = (models) => {
        Course.belongsTo(models.User, {
          as: 'user', // alias
          foreignKey: {
            fieldName: 'userId',
            allowNull: 'false'
          },
        });
      };

    return Course
}
