var express = require('express');
var router = express.Router();
const {asyncForEach} = require("../util");

const Photo = require("../schemas/photo");
const User = require("../schemas/user");

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/init', async function (req, res, next) {
  try {
    if (!req.session.userID) {
      // No userID yet, return empty string
      res.status(401).json("");
      return;
    }
    let userID = req.session.userID;
    let currentUser = await User.findById(userID);
    if (currentUser == null) {
      // User not found
      res.sendStatus(404);
      return;
    }
    const username = currentUser.username;
    userID = currentUser.id;

    let friends = [];

    await asyncForEach(currentUser.friends, async (friendId) => {
      let friendUser = await User.findById(friendId);
      if (friendUser) {
        friends.push({username: friendUser.username, userID: friendUser.id});
      }
    });

    res.status(200).json({userID, username, friends});
    return
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
    return;
  }
});

router.post('/login', async function (req, res, next) {
  try {
    const {username, password} = req.body;
    let currentUser = await User.findOne({username, password});
    if (!currentUser) {
      res.status(401).json({msg: "Login failure"});
      return;
    }
    req.session.userID = currentUser.id;
    let friends = [];

    await asyncForEach(currentUser.friends, async (friendId) => {
      let friendUser = await User.findById(friendId);
      if (friendUser) {
        friends.push({username: friendUser.username, userID: friendUser.id});
      }
    });
    res.status(200).json({friends, userID: currentUser.id});
    return;
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
    return;
  }
});

router.get("/logout", async function (req, res, next) {
  try {
    req.session = null;
    res.status(200).json("");
    return;
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
    return;
  }
});

router.get("/getalbum/:userid", async function (req, res, next) {
  try {
    let {userID} = req.params;
    if (userID === "0") {
      if (!req.session || !req.session.userID) {
        res.sendStatus(401);
        return;
      } else {
        userID = req.session.userID;
      }
    }
    let photos = await Photo.find({userID}).map(
        ({id, url, likedBy}) => ({id, url, likedBy}));
    res.status(200).json({photos});
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
    return;
  }
});

module.exports = router;
