const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const Sequelize = require('sequelize');
const User = require('../models').User;
const Course = require('../models').Course;
const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const { check, validationResult } = require('express-validator');
let coursesArray = [];

function asyncHandler(callback){
    return async(req, res, next) => {
      try {
        await callback(req, res, next)
      } catch(error){
        next(error);
        console.log(error);
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

//Find all courses
//Working 
router.get('/courses', asyncHandler(async (req, res, next) => {
  const courses = await Course.findAll();
    console.log(courses);
      res.json({courses});
}));

//Find specfic course
router.get('/courses/:id', asyncHandler(async (req, res, next) => {
  console.log('Starting');
    let course = await Course.findByPk(req.params.id);
    console.log(course);
      res.json({course});
  }));
  
//Create course
//Working 
router.post('/courses', [
  check('title')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please provide a value for "title"'),
check('description')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please provide a value for "description"')
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

  // Get the course from the request body.
  // const course = req.body;

  const course = await Course.create(req.body);

  // Add the user to the `users` array.
  coursesArray.push(course);
  console.log(course);

  // Set the status to 201 Created and end the response.
  return res.status(201).end();
  
  }));


//Update course 
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res, next) => {
  console.log('Starting');
  let user = req.currentUser;
  let course = await Course.findByPk(req.params.id);
  console.log(course);
  if (course.userId === user.id) {
    course.update(req.body);
      console.log('updated');
      res.sendStatus(204);
  } else {
      console.log('Failed');
      res.sendStatus(403);
  }
}));

//Delete a entry
//Working
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req ,res) => {
    let courseToDelete = await Course.findOne(req.body);
      courseToDelete.destroy();
      res.sendStatus(204);
  }));

module.exports = router;
