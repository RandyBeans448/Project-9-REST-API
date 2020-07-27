const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
'use strict';
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
                msg: 'Please provide a value for "first name"'
              }
             }
          },
          lastName: {
            type: Sequelize.STRING,
            allowNull: false, // disallow null
            validate: {
              notEmpty: {
                msg: 'Please provide a "lastName"'
              }
             }
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false, // disallow null
            validate: {
              notEmpty: {
                msg: 'Please provide a "email"'
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
              // instanceMethods: {
              //   generateHash: function (password) {
              //     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
              //   },
              //   validPassword: function (password) {
              //     return bcrypt.compareSync(password, this.password)
              //   }
              // }
    }, { sequelize });

       User.associate = (models) => {
        User.hasMany(models.Course, {
          as: 'userID', // alias
          foreignKey: {
            fieldName: 'UserID',
            allowNull: 'false'
          },
        });
      };

    return User
}

