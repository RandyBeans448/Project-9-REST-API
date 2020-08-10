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
          validate: {
              notEmpty: {
                  msg: "Please provide value for 'emailAddress'"
              },
              is: {
                  args: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                  msg: "Please provide a VALID 'emailAddress'"
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
      User.belongsTo(models.Course, {
        as: 'userID', // alias
        foreignKey: {
          fieldName: 'UserID',
          allowNull: 'false'
        },
      })
    }
  return User;
}

