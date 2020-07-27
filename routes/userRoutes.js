const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const Sequelize = require('sequelize');
const User = require('../models').User;
const bcrypt = require('bcryptjs');

function asyncHandler(callback){
    return async(req, res, next) => {
      try {
        await callback(req, res, next)
      } catch(error){
        res.status(500).render('error');
      }
    }
  }

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash("B4c0/\/", salt, function(err, hash) {
        // Store hash in your password DB.
    });
  });

router.get('/api/users', asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id);
    res.sendStatus(200);
  }));
  
  router.post('/api/users', asyncHandler(async (req, res, next) => {
    let user;
    try {
      user = await User.create({
        firstName: req.body.title,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password })
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