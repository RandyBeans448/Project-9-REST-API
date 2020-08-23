'use strict'

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        firstName: {
          type: Sequelize.STRING,
          allowNull: false, // disallow null
          validate: {
              notEmpty: {
                msg: 'Please provide a "first name"'
              }
           }
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: false, // disallow null
          validate: {
              notEmpty: {
                msg: 'Please provide a "last name"'
              }
           }
        },
        emailAddress: {
          type: Sequelize.STRING,
          allowNull: false, // disallow null
          validate: {
            isEmail: {
              msg: 'Please provide a vaild email address'
            }
          }
      },
        password: {
          type: Sequelize.STRING,
          allowNull: false, // disallow null
          validate: {
              notEmpty: {
                msg: 'Please provide a "password"'
              }
           }
        }
     }, { sequelize });

     User.associate = (models) => {
      User.hasMany(models.Course, {
        as: 'holder', // alias
        foreignKey: {
          fieldName: 'userId',
          allowNull: 'false'
        },
      })
    }
  return User;
}
