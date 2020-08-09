const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const Sequelize = require('sequelize');
const User = require('../models').User;
const Course = require('../models').Course;
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
    try {
      console.log('finding')
      const users = await User.findAll();
      console.log('found')
      //Parsing Authorization Header from the request
      console.log('parsing');
      const credentials = auth(req);
      console.log('parsed');
      //If the credentials are exsist then they are compare to an email matching the first name.  
        if (credentials) {
          console.log('finding users');
          const user = users.find(user => user.emailAddress === credentials.name);
          console.log('found user');
          //When true the user has its password comfirmed  
            if (user) {
              console.log('Starting bcrypt');
              const authenticated = bcrypt
                .compareSync(credentials.pass, user.password);
                //Then is the user is set the current User in the request object
                console.log('finshed bcrypt');
                if (authenticated) {
                  console.log('Authenticate user');
                  req.currentUser = user;
                  console.log('Access granted: Log in details vaild');               
                } else {
                  console.log(`Authentication failed for username: ${user.firstName}`);
                }
            } else {
              console.log(`User not found with the name of ${credentials.firstName}`)
            }
        } else {
          console.log("Autho not found");
        }
    } catch(error) {
      next();
    }
    console.log('All done');
  };

//Works with no autho
router.get('/users', authenticateUser, asyncHandler(async (req, res, next) => {
  console.log('Starting');
    let authedUser = await User.find(req.currentUser);
      if (authedUser) {
        console.log('Authed users');
        console.log(authedUser);
        res.json({ authedUser });    
      } else {
        console.log('Course not found');
        res.sendStatus(404);
      } 
        console.log('finshed'); 
}));
  

//Create user
//Not working 
  router.post('/users', asyncHandler(async (req, res, next) => {
    console.log('Starting');
       let user;
            try {
                  console.log('try');
                  user = await User.create(req.body);
              if (user) {
                    console.log('user created')
                    res.sendStatus(201).location(`${users/user.id}`);
                    console.log('Finshed');
                  }
              } catch(error){
                if(error.name === 'SequelizeValidationError') {
                  user = await User.build(req.build);
                } else {
                  throw error;
                }
              }     
    }));

  module.exports = router;
