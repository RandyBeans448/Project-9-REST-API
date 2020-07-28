const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const Sequelize = require('sequelize');
const Course = require('../models').Course;



function asyncHandler(callback){
    return async(req, res, next) => {
      try {
        await callback(req, res, next)
      } catch(error){
        res.status(500);
      }
    }
  }

router.get('/courses', asyncHandler(async (req, res, next) => {
    const course = await Course.findAll({ order: [['createdAt', 'DESC']]});
    res.sendStatus(200);
  }));

  router.get('/courses', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    res.sendStatus(200);
  }));
  
router.post('/courses/:id', asyncHandler(async (req, res, next) => {
     let course;
     try {
      course = await Course.create({
        title: req.body.title,
        description: req.body.description,
        estimatedTime: req.body.estimatedTime,
        materialsNeeded: req.body.materialsNeeded })
        res.sendStatus(201).setHeader("Location", '/');
     } catch(error){
      if(error.name === 'SequelizeValidationError') {
        course = await Course.build(req.build);
      } else {
        throw error;
      }
     }
  }));

router.put('/courses/:id', asyncHandler(async (req, res, next) => {
    let course = await Course.findByPk(req.params.id);
      if(course) {
          await course.update(req.body);
          res.sendStatus(204).redirect('/'); 
        } else {
          res.sendStatus(404);
        }
}));

router.delete('/courses/:id', asyncHandler(async (req ,res) => {
    let course = await Course.findByPk(req.params.id)
      await course.destroy();
        res.sendStatus(204);
  }));

 

  module.exports = router;
