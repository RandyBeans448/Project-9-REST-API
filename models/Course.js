'use strict'

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Sequelize.Model {}
    Course.init({
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
                msg: 'Please provide a "title"'
              }
             }
          },
          description: {
            type: Sequelize.STRING,
            allowNull: false, // disallow null
            validate: {
              notEmpty: {
                msg: 'Please provide a "description"'
              }
             }
          },
          estimatedTime: {
            type: Sequelize.STRING,
            allowNull: true, // allow null
          },
          materialsNeeded: {
            type: Sequelize.STRING,
            allowNull: true, // allow null
          }

       }, { sequelize });

       Course.associate = (models) => {
        Course.belongsTo(models.User, {
          as: 'userId', // alias
          foreignKey: {
            fieldName: 'id',
            allowNull: 'false'
          },
        });
      };

    return Course
}


