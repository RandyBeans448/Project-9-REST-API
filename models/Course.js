const Sequelize = require('sequelize');

'use strict';
module.exports = (sequelize) => {
    class Course extends Sequelize.Model {}
    Course.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          userId: {
            type: Sequelize.INTEGER,
            allowNull: false, // disallow null
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
        Course.hasMany(models.User, {
          as: 'userID', // alias
          foreignKey: {
            fieldName: 'UserID',
            allowNull: 'false'
          },
        });
      };

    return Course
}

