const express = require("express");
const router = express.Router();
const helper = require("../helper");
const data = require("../data");
const userData = data.users;
const sendEmail = require('../email')
const groupData = data.groups;

router.route("/validate").post(async (req, res) => {
  try {
    let email = req.body.useremail;
    let password = req.body.password;

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

router.route("/register").post(async (req, res) => {
  try {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let dateOfBirth = req.body.dateOfBirth;
    let email = req.body.email;
    let password = req.body.password;
    let budget = req.body.budget;

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
      let friendId = req.body.friendId;

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
    let month = req.body.month;
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
    let category = req.body.category;
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
    let name = req.body.name;
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
      let firstName = req.body.firstName.trim();
      let lastName = req.body.lastName.trim();
      let dateOfBirth = req.body.dateOfBirth.trim();
      let budget = req.body.budget.trim();

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
