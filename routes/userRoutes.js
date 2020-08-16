const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const Sequelize = require('sequelize');
const User = require('../models').User;
const Course = require('../models').Course;
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const { check, validationResult } = require('express-validator');
const users = [];

//aysncHandler
function asyncHandler(callback){
    return async(req, res, next) => {
      try {
        await callback(req, res, next)
      } catch(error){
        res.status(500);
      }
    }
  }

  const authenticateUser = async (req, res, next) => {
    let message = null;
    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);
    // If the user's credentials are available...
    if (credentials) {
      // Attempt to retrieve the user from the data store
      // by their username (i.e. the user's "key"
      // from the Authorization header).
          const users = await User.findAll();
          const user = users.find(user => user.emailAddress === credentials.name);
      // If a user was successfully retrieved from the data store...
      if (user) {
        // Use the bcryptjs npm package to compare the user's password
        // (from the Authorization header) to the user's password
        // that was retrieved from the data store.
        const authenticated = bcryptjs
          .compareSync(credentials.pass, user.password);
        // If the passwords match...
        if (authenticated) {
          console.log(`Authentication successful for : ${user.firstName} ${user.lastName}`);
          // Then store the retrieved user object on the request object
          // so any middleware functions that follow this middleware function
          // will have access to the user's information.
          req.currentUser = user;
        } else {
          message = `Authentication failure for username: ${user.firstName} ${user.lastName}`;
        }
      } else {
        message = `User not found for username: ${credentials.name}`;
      }
    } else {
      message = 'Auth header not found';
    }
  
    // If user authentication failed...
    if (message) {
      console.warn(message);
  
      // Return a response with a 401 Unauthorized HTTP status code.
      res.status(401).json({ message: 'Access Denied' });
    } else {
      // Or if user authentication succeeded...
      // Call the next() method.
      next();
    }
  };

//Get individual user
router.get('/users', authenticateUser, asyncHandler(async (req, res, next) => {
  console.log('Starting');
    let authedUser = req.currentUser;
    if(authedUser) {
      res.json({
        id: authedUser.id,
        firstName: authedUser.firstName,
        lastName: authedUser.lastName,
        emailAddress: authedUser.emailAddress
      });
    } else {
      res.sendStatus(404);
    }
}));
  

//Create user
//Email validation not working
router.post('/users', [
    check('firstName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "firstName"'),
  check('lastName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "username"'),
  check('emailAddress')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "emailAddress"'),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "password"'),
], asyncHandler(async (req, res, next) => {
    // Attempt to get the validation result from the Request object.
    const errors = validationResult(req);
  
    // If there are validation errors...
    if (!errors.isEmpty()) {
      // Use the Array `map()` method to get a list of error messages.
      const errorMessages = errors.array().map(error => error.msg);
  
      // Return the validation errors to the client.
      return res.status(400).json({ errors: errorMessages });
    }
  
    // Get the user from the request body.
    const user = req.body;

     // Hash the new user's password.
    user.password = bcryptjs.hashSync(user.password);
    console.log('Hashed');
    const currentUsers = await User.findAll();
    const findUserEmail = currentUsers.find(u => u.emailAddress === u.emailAddress);
    let userEmail = findUserEmail;
    if (user.emailAddress === userEmail.emailAddress) {
      console.log('User with this email already exists')
      return res.status(500).end();
      }
     else {
    // Add the user to the `users` array.
    users.push(user);
    console.log(user);
    console.log(user.emailAddress);
    // Set the status to 201 Created and end the response.
    return res.status(201).end();
    }  
}));

module.exports = router;


