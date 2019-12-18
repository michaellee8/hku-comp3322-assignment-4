var express = require('express');
var router = express.Router();
const {asyncForEach} = require("../util");
const uuidv1 = require('uuid/v1');
const fs = require("fs");
let mongoose = require('mongoose');
const async = require("async");
var cors = require("cors");
let ObjectId = mongoose.Schema.Types.ObjectId;

const Photo = require("../schemas/photo");
const User = require("../schemas/user");

router.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

router.options('*', cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

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

router.get("/getalbum/:userID", async function (req, res, next) {
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
    let photos = await async.map(await Photo.find({userID}),
        async ({id, url, likedBy}) => {
          const likedByUsers = await async.map(
              likedBy,
              async (likedUserID) => {
                let likedUser = await User.findById(likedUserID);
                return {username: likedUser.username, userID: likedUser.id};
              }
          );
          return ({id, url, likedBy: likedByUsers});
        });
    console.log(photos);
    res.status(200).json({photos});
    return;
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
    return;
  }
});

router.post("/uploadphoto", async function (req, res, next) {
  try {
    let userID;

    if (!req.session || !req.session.userID) {
      res.sendStatus(401);
      return;
    } else {
      userID = req.session.userID;
    }

    if (!req.files || !req.files.photo) {
      res.sendStatus(400);
      return;
    }

    let fileName = uuidv1();

    await req.files.photo.mv(
        `./public/uploads/${fileName}.${req.files.photo.name.split(
            '.').pop()}`);

    let photo = new Photo({
      url: `http://localhost:3002/uploads/${fileName}.${
          req.files.photo.name.split('.').pop()}`,
      userID,
      likedBy: [],
    });
    await photo.save();

    res.status(200).json({url: photo.url, id: photo.id});

    return;
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
    return;
  }
});

router.delete("/deletephoto/:photoID", async function (req, res, next) {

  try {
    if (!req.session || !req.session.userID) {
      res.sendStatus(401);
      return;
    }
    let userID = req.session.userID;

    let photoID = req.params.photoID;
    if (!photoID) {
      res.sendStatus(400)
      return;
    }

    let photo = await Photo.findById(photoID);
    if (!photo) {
      res.sendStatus(404);
      return;
    }
    if (photo.userID !== userID) {
      res.sendStatus(403);
      return;
    }

    const fileName = photo.url.split('/').pop();
    fs.unlinkSync(`public/uploads/${fileName}`);

    await Photo.findByIdAndDelete(photoID);

    res.status(200).json("");

  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

});

router.put("/updatelike/:photoID", async function (req, res, next) {

  try {

    if (!req.session || !req.session.userID) {
      res.sendStatus(401);
      return;
    }
    let userID = req.session.userID;

    let photoID = req.params.photoID;
    if (!photoID) {
      res.sendStatus(400);
      return;
    }

    let photo = await Photo.findById(photoID);
    if (!photo) {
      res.sendStatus(404);
      return;
    }

    let id = photo.likedBy.find(id => id === userID);

    if (id) {
      photo.likedBy = photo.likedBy.filter(id => id !== userID);
    } else {
      photo.likedBy.push(userID);
    }

    await photo.save();

    res.status(200).json({likedBy: photo.likedBy});
    return;

  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

});

router.post("/register", async function (req, res, next) {
  try {
    const {username, password} = req.body;
    if (!username || !password) {
      res.sendStatus(400);
      return
    }
    let user = new User({username, password, friends: []});
    await user.save();
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get("/users", async function (req, res, next) {
  try {
    let docs = await User.find();
    let users = docs.map(({username, id}) => ({username, userID: id}));
    res.status(200).json({users});
    return;
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.put("/togglefriend/:friendID", async function (req, res, next) {
  try {
    if (!req.session || !req.session.userID) {
      res.sendStatus(401);
      return;
    }
    let userID = req.session.userID;

    let friendID = req.params.friendID;
    if (!friendID) {
      res.sendStatus(400);
      return;
    }

    if (!await User.findById(friendID)) {
      res.sendStatus(404);
      return;
    }

    let user = await User.findById(userID);
    if (!user) {
      res.sendStatus(404);
      return;
    }

    let id = user.friends.find(id => id === friendID);

    if (id) {
      user.friends = user.friends.filter(id => id !== friendID);
    } else {
      user.friends.push(friendID);
    }

    await user.save();

    res.status(200).json({friends: user.friends});

    return;

  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get("/friends", async function (req, res, next) {
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

    res.status(200).json({friends});
    return
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
    return;
  }
});

module.exports = router;
