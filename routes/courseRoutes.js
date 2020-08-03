const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const Sequelize = require('sequelize');
const User = require('../models/User');
const Course = require('../models').Course;
const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
let usersArray = [];

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
    //Parsing Authorization Header from the request
    const credentials = auth(req);
    //If the credentials are exsist then they are compare to an email matching the first name.  
      if (credentials) {
        const user = usersArray.find(user => user.emailAddress === credentials.name);
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

router.get('/courses', asyncHandler(async (req, res, next) => {
    const courses = await Course.findAll({
      attributes: { exclude: ['createdAt','updatedAt'] } 
    });
      console.log(courses);
        res.json({ courses }).sendStatus(200);
}));

router.get('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  let course = await Course.findByPk(req.params.id, {
      attributes: {
          include: [{ model: User, as: 'userID' }],
            exclude: ['createdAt','updatedAt'] 
  }});
    if (course) {
        usersArray.push(course);
          console.log(course);
            res.json({ course }).sendStatus(200).end();
     } else {
        console.log('Course not found');
          res.sendStatus(404);
     }
  }));
  
// router.post('/courses', asyncHandler(async (req, res, next) => {
//      let course;
//      try {
//       course = await Course.create({
//         title: req.body.title,
//         description: req.body.description,
//         estimatedTime: req.body.estimatedTime,
//         materialsNeeded: req.body.materialsNeeded })
//         res.sendStatus(201).setHeader("Location", '/');
//      } catch(error){
//       if(error.name === 'SequelizeValidationError') {
//         course = await Course.build(req.build);
//       } else {
//         throw error;
//       }
//      }
//   }));

// router.put('/courses/:id', asyncHandler(async (req, res, next) => {
//     let course = await Course.findByPk(req.params.id);
//       if(course) {
//           await course.update(req.body);
//           res.sendStatus(204).redirect('/'); 
//         } else {
//           res.sendStatus(404);
//         }
// }));

// router.delete('/courses/:id', asyncHandler(async (req ,res) => {
//     let course = await Course.findByPk(req.params.id)
//       await course.destroy();
//         res.sendStatus(204);
//   }));

module.exports = router;

