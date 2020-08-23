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
          validate: {
             notEmpty: {
                  msg: 'Please provide a value for "title".'
              }
          }
      },
      description: {
          type: Sequelize.TEXT,
          allowNull: false, // disallow null
          validate: {
              notEmpty: {
                  msg: 'Please provide a value for "description".'
              }
          }
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
          as: 'holder', // alias
          foreignKey: {
            fieldName: 'userId',
            allowNull: 'false'
          },
        });
      };

    return Course


