const express = require("express");
const router = express.Router();
const helper = require("../helper");
const data = require("../data");
const userData = data.users;
const sendEmail = require('../email')
const groupData = data.groups;
const xss = require('xss');

router.route("/validate").post(async (req, res) => {
  try {
    let email = xss(req.body.useremail);
    let password = xss(req.body.password);

    helper.checkEmail(email);
    helper.checkPassword(password);

    let response = await userData.checkUser(email, password);
    if (response.authenticatedUser) {
      return res.status(200).send({ userId: response.authenticatedUser });
    }
    return res.status(403).send({ userId: null });
  } catch (e) {
    return res.status(400).send({ Error: e });
  }
});

router.route("/register/oauth").post(async(req,res)=>{
  try{
    let firstName = xss(req.body.firstName.split(" ")[0])
    let lastName = xss(req.body.firstName.split(" ")[1])
    lastName = lastName?lastName:"Patel"
    let dateOfBirth = req.body.dateOfBirth ? req.body.dateOfBirth: "07/05/1998"
    let email = xss(req.body.email);
    let password = "oauthPassword";
    let budget = "100"; 

    let response = await userData.createUserFirebase(
      firstName,
      lastName,
      dateOfBirth,
      email,
      password,
      budget
    )
    if(response){
      return res.status(200).send({userId: response._id.toString()});
    }else{
      throw "User cannot be added!!"
    }
    
  }catch(e){
    return res.status(400).send({ Error: e });
  }
})

router.route("/register").post(async (req, res) => {
  try {
    let firstName = xss(req.body.firstName);
    let lastName = xss(req.body.lastName);
    let dateOfBirth = xss(req.body.dateOfBirth);
    let email = xss(req.body.email);
    let password = xss(req.body.password);
    let budget = xss(req.body.budget);

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
    );
    return res.status(200).send({ registered: true });
  } catch (e) {
    return res.status(400).send({ Error: e });
  }
});

router.route("/getUserByEmail").post(async(req,res)=>{
  try{
    let email = xss(req.body.email)
    let u = await userData.getUserbyEmail(email)
    return res.send({users : u})

  }catch(e){
    return res.send({users : null})
  }
})

router.route("/getAllUsers").get(async (req, res) => {
  try {
    let allUsers = await userData.getAllUsers();
    return res.status(200).send({ userData: allUsers });
  } catch (e) {
    return res.status(400).send({ Error: e });
  }
});

router.route("/:userId/friends/:friendId").delete(async (req, res) => {
  try {
    let userId = req.params.userId.trim();
    let friendId = req.params.friendId.trim();

    helper.checkObjectId(userId);
    helper.checkObjectId(friendId);

    let user = await userData.getUserDetails(userId);
    let friend = await userData.getUserDetails(friendId);

    if (!user.friends.includes(friendId) || !friend.friends.includes(userId)) {
      throw "Friend not present in User";
    }

    let response = await userData.removeFriendFromUser(userId, friendId);
    return res.status(200).send({ friendAdded: true });
  } catch (e) {
    return res.status(400).send({ Error: e.toString() });
  }
});

router
  .route("/:userId/friends")
  .get(async (req, res) => {
    try {
      let userId = req.params.userId;
      helper.checkObjectId(userId);
      let friends = await userData.getAllFriends(userId);
      return res.status(200).send({ friends: friends });
    } catch (e) {
      return res.status(400).send({ Error: e });
    }
  })
  .post(async (req, res) => {
    try {
      let userId = req.params.userId.trim();
      let friendId = xss(req.body.friendId);

      helper.checkObjectId(userId);
      helper.checkObjectId(friendId);

      let user = await userData.getUserDetails(userId);
      let friend = await userData.getUserDetails(friendId);

      if (user.friends.includes(friendId) || friend.friends.includes(userId)) {
        throw "Friend allready exists!";
      }

      let response = await userData.addFriendToUser(userId, friendId);
      return res.status(200).send({ friendAdded: true });
    } catch (e) {
      return res.status(400).send({ Error: e.toString() });
    }
  });

router.route("/:userId/transactionByMonth").get(async (req, res) => {
  try {
    let userId = req.params.userId;
    let month = xss(req.body.month);
    helper.checkObjectId(userId);
    let userObj = await userData.getUserTransactionsByCategory(userId, month);
    return res.status(200).send({ TransactionsByMonth: userObj });
  } catch (e) {
    return res.status(400).send({ Error: e.toString() });
  }
});
router.route("/:userId/transactionByCategory").get(async (req, res) => {
  try {
    let userId = req.params.userId;
    let category = xss(req.body.category);
    helper.checkObjectId(userId);
    let userObj = await userData.getUserTransactionsByCategory(
      userId,
      category
    );
    return res.status(200).send({ TransactionsByCategory: userObj });
  } catch (e) {
    return res.status(400).send({ Error: e.toString() });
  }
});
router.route("/searchname").post(async (req, res) => {
  try {
    let name = xss(req.body.name);
    helper.checkString(name);
    let userObj = await userData.findUserByName(name);
    return res.status(200).send({ findUserByName: userObj });
  } catch (e) {
    return res.status(400).send({ Error: e.toString() });
  }
});

router
  .route("/:userId")
  .get(async (req, res) => {
    try {
      let userId = req.params.userId;
      helper.checkObjectId(userId);
      let userObj = await userData.getUserDetails(userId);
      return res.status(200).send({ userObj: userObj });
    } catch (e) {
      return res.status(400).send({ Error: e });
    }
  })
  .put(async (req, res) => {
    try {
      let userId = req.params.userId.trim();
      let firstName = xss(req.body.firstName.trim());
      let lastName = xss(req.body.lastName.trim());
      let dateOfBirth = xss(req.body.dateOfBirth.trim());
      let budget = xss(req.body.budget.trim());

      helper.checkObjectId(userId);
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
      );
      return res.status(200).send({ updated: true });
    } catch (e) {
      return res.status(400).send({ Error: e.toString() });
    }
  });

module.exports = router;
