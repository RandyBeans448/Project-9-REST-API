const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const Sequelize = require('sequelize');
const User = require('../models/User').User;
const Course = require('../models').Course;
const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');


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
              const authenticated = bcryptjs
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
  };


//Find all courses
//Working 
router.get('/courses', asyncHandler(async (req, res, next) => {
    const courses = await Course.findAll({
      attributes: { exclude: ['createdAt','updatedAt'] } 
    });
      console.log(courses);
        res.json({ courses }).sendStatus(200);
}));


//Find specfic course
//Working except excludes
router.get('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  console.log('Starting')
  let course = await Course.findOne(req.currentUser, {
    include: {
       model: User,
        as: 'userID',
      attributes: { exclude: ['createdAt','updatedAt'] },
    }
  });
    
    if (course) {
      console.log('Course found')
          console.log(course);
            res.json({ course }).sendStatus(200).end();
     } else {
        console.log('Course not found');
          res.sendStatus(404);
     }
     console.log('finshed');
  }));
  

//Create course
//Working 
router.post('/courses',  asyncHandler(async (req, res, next) => {
  console.log('Starting');
     let course;
          try {
                console.log('try');
                course = await Course.create(req.body);
            if (course) {
                  console.log('course')
                  res.sendStatus(201).location(`${courses/course.id}`);
                  console.log('Finshed');
                }
            } catch(error){
              if(error.name === 'SequelizeValidationError') {
                course = await Course.build(req.build);
              } else {
                throw error;
              }
            }
     
  }));


//Update course 
//Working
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res, next) => {
  console.log('Starting');
    let course; 
      try {
        course = await Course.findOne(req.currentUser);
        console.log(course);
            if(course) {
              await course.update(req.body);
              console.log('updated');
              res.sendStatus(204);
              console.log('Status: 204'); 
            } else {
              throw error
            }
      } catch (error) {
        console.log('Untrue');
        res.sendStatus(404);
        console.log('Status: 404');
      }
}));


//Delete a entry
//Working
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req ,res) => {
    let courseToGo = await Course.findOne(req.body);
      courseToGo.destroy();
      res.sendStatus(204);
  }));

module.exports = router;

