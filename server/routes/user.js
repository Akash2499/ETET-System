const express = require('express');
const router = express.Router();
const helper = require('../helper');
const data = require('../data');
const userData = data.users;    


router
  .route('/validate')
  .post(async (req, res) => {

    try {

      let email = req.body.email
      let password = req.body.password 

      helper.checkEmail(email)
      helper.checkPassword(password)

      let response = await userData.checkUser(email, password)
      if(response.authenticatedUser) {
        return res.status(200).send({ authenticatedUser : true })
      }
      return res.status(403).send({ authenticatedUser : false })
    } catch (e) {
      return res.status(400).send({ Error: e });
    }
  })

router
  .route('/register')
  .post(async (req, res) => {
    try {
      let firstName = req.body.firstName
      let lastName = req.body.lastName 
      let dateOfBirth = req.body.dateOfBirth
      let email = req.body.email
      let password = req.body.password
      let budget = req.body.budget

      helper.checkFnameLname(firstName);
      helper.checkFnameLname(lastName);
      helper.checkDOB(dateOfBirth);
      helper.checkEmail(email);
      helper.checkPassword(password);
      helper.checkBudget(budget);

      let response = await userData.createUser(
        firstName,
        lastName,
        dateOfBirth,
        email,
        password,
        budget
      )
      return res.status(200).send({ registered : true })
    } catch (e) {
      return res.status(400).send({ Error: e });
    }
  })
  
router
  .route('/:userId')
  .get(async (req, res) => {
    try {
      let userId = req.params.userId;
      helper.checkObjectId(userId)
      console.log(userData);
      let userObj = await userData.getUserDetails(userId)
      return res.status(200).send({ userObj : userObj })
    } catch (e) {
      return res.status(400).send({ Error: e });
    }
  })
  .put(async (req, res) => {
    try{
    let userId = req.params.userId;
    let firstName = req.body.firstName
    let lastName = req.body.lastName 
    let dateOfBirth = req.body.dateOfBirth
    let budget = req.body.budget

    helper.checkObjectId(userId)
    helper.checkFnameLname(firstName);
    helper.checkFnameLname(lastName);
    helper.checkDOB(dateOfBirth);
    helper.checkBudget(budget);

    let response = await userData.updateUser(
      userId,
      firstName,
      lastName,
      dateOfBirth,
      budget
    )
    return res.status(200).send({ updated : true })
  }
  catch (e) {
    return res.status(400).send({ Error: e.toString() });
  }
  })


module.exports = router;