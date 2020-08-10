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
                  args: ^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$,
                  msg: "Please provide a valid 'emailAddress'"
              },
          },
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

