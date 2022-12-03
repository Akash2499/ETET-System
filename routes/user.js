const express = require('express');
const router = express.Router();
const helper = require('../helper');
const data = require('../data');
const userData = data.users;    


router
  .route('/')
  .get(async (req, res) => {
    if(req.session.user){
      return res.redirect('/dashboard')
    }
    else{
      return res.render('login',{}) 
    }
  })


router
  .route('/login')
  .post(async (req,res) => {
    try{
        helper.checkUsername(req.body.email);
        helper.checkPassword(req.body.password);
        req.session.user = {email: 'abc@gmail.com'}

        // Code to check if username and pasword match (if not throw error)

        return res.redirect('/dashboard')
    }
    catch(e){
        return res.status(400).render('login',{error : e.toString()})
    }
  }) 

router
  .route('/register')
  .get(async (req,res) => {
    if(req.session.user){
        return res.redirect('/dashboard')
    }
    else{
        return res.render('register')
    }
  })
  .post(async (req,res) => {
    try{
        helper.checkUsername(req.body.email);
        helper.checkPassword(req.body.password);
        req.session.user = {email: 'abc@gmail.com'}

        // Code to insert user into the system

        return res.redirect('/dashboard')
    }
    catch(e){
        return res.status(400).render('login',{error : e.toString()})
    }
  })


router
  .route('/dashboard')
  .get(async (req,res) => {
    if(req.session.user){
        return res.render('dashboard',{userData: req.session.user, login: true})
    }
    else{
        return res.redirect('/')
    }
  })



router
  .route('/logout')
  .get(async (req,res) => {
    req.session.destroy();
    return res.render('logout')
  })

router
  .route('/group/:groupId')
  .get(async (req,res) => {
    if(!req.session.user){
      return res.redirect('/')
    }
    let groupId = req.params.groupId;
    try{
      //check if groupid is valid 
      //also check if the user is present in that group
      //if valid store group details onto groupDetails variable
      let groupDetails = {};
      return res.render('group',{groupId : groupId, groupDetails : groupDetails})
    }
    catch(e){
      return res.render('404error',{message: '404: Group not Found'})
    }
  })

module.exports = router;