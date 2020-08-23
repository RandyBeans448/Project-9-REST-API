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
            titleValidator() {
              if (req.body.title === null) {
                throw new Error("title cant not be empty");
              }
            }
          }
      },
      description: {
          type: Sequelize.TEXT,
          allowNull: false, // disallow null
          validate: {
            descriptionValidator() {
              if (req.body.description === null) {
                throw new Error("description cant not be empty");
              }
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
}



