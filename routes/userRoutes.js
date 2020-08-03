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

async function authenticateUser (req, res, next) {
  const users = await User.findAll();
    //Parsing Authorization Header from the request
    const credentials = auth(req);
    //If the credentials are exsist then they are compare to an email matching the first name.  
      if (credentials) {
        const user = users.find(user => user.emailAddress === credentials.name);
        //When true the user has its password comfirmed  
          if (user) {
            const authenticated = bcrypt
              .compareSync(credentials.pass, user.password);
              //Then is the user is set the current User in the request object
              if (authenticated) {
                req.currentUser = user;               
              } else {
                console.log(`Authentication failed for username: ${user.firstName}`);
              }
          } else {
            console.log(`User not found with the name of ${credentials.firstName}`)
          }
      } else {
        console.log("Autho not found");
      }
    next();
  };

router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
    bcrypt.compare(req.body.password, hash, function(err, result) {});
      usersArray.push(user);
        console.log(user);
          res.json({ user }).sendStatus(200);
  }));
  
//   router.post('/users', asyncHandler(async (req, res, next) => {
//     let user;
//     try {
//       user = await User.create({
//         firstName: req.body.title,
//         lastName: req.body.lastName,
//         email: req.body.email,
//         password: bcrypt.genSalt(10, function(err, salt) {
//           bcrypt.hash(req.body.password, salt, function(err, hash) {
//           });
//         })        
//        })
//        users.push(user);
//         res.sendStatus(201).setHeader("Location", '/');
//     } catch(error) {
//       if(error.name === 'SequelizeValidationError') {
//         user = await User.build(req.build);
//       } else {
//         throw error;
//       }
//     }
//  }));

  module.exports = router;
