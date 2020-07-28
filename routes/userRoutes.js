const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const Sequelize = require('sequelize');
const User = require('../models').User;
const bcrypt = require('bcryptjs');
const auth = require('basic-auth');




function asyncHandler(callback){
    return async(req, res, next) => {
      try {
        await callback(req, res, next)
      } catch(error){
        res.status(500);
      }
    }
  }

  const authenticateUser = (req, res, next) => {
    let message = null;
    const credentials = auth(req);
        if (credentials) {
          const user = User.findOne({ where: { email: req.body.email } })
            .compareSync(credentials.password, user.password);
              if (user) {
                console.log(`Authentication successful for ${user.firstName}`);
                req.currentUser = user;
              } else {
                message = `Authentication failure for ${user.firstName}`;
              }
          } 
            if (message) {
              console.warn(message);
              res.status(401).json({ message: 'Access Denied' });
            } else {
              next();
            }
      }; 




router.get('/users', asyncHandler, authenticateUser(async (req, res) => {
    const user = await User.findByPk(req.params.id);
    bcrypt.compare(req.body.password, hash, function(err, result) {
  });
    res.sendStatus(200);
  }));
  
  router.post('/users', asyncHandler(async (req, res, next) => {
    let user;
    try {
      user = await User.create({
        firstName: req.body.title,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(req.body.password, salt, function(err, hash) {
          });
        })
       })
        
        res.sendStatus(201).setHeader("Location", '/');
    } catch(error) {
      if(error.name === 'SequelizeValidationError') {
        user = await User.build(req.build);
      } else {
        throw error;
      }
    }
 }));

  module.exports = router;
