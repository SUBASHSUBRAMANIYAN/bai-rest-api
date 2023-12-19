const validator = require("validator");
const { check, oneOf, body } = require("express-validator");
const userModel = require("../models/users.model");
const passport = require("passport");

//To get all users
exports.getUsers = (req, res, next) => {
  console.log("User controller reached: getUsers()");
  userModel
    .find({})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(404).json({
        message: "Record not found",
        error: err,
      });
    });
};

//To get user by ID
exports.getUserByID = (req, res, next) => {
  console.log("User controller reached: getUserByID()");
  userModel
    .findOne({ _id: req.params.id })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "Record not found",
        error: err,
      });
    });
};

//To save/create user //User create along with signup
exports.createUserWithSignup = (req, res, next) => {
  console.log("User controller reached: createUser()");

  const userDao = new userModel(req.body); //To create draft data to save/update
  userDao.encryptPassword(req.body.password);

  userDao
    .save()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(422).json({
        message: "Error occured while creating user.",
        error: err,
      });
    });
};

//User Login
exports.userLogin = (req, res) => {
  passport.authenticate("local", (err, usersModel, info) => {
    if (err) {
      res.json(err);
    }

    // if account is found
    if (usersModel) {
      // generate Json Web Token (JWT) and send it in res
      const authToken = usersModel.generateJwt();

      res.json({
        status: "Logged In Successfully!",
        token: authToken,
      });
    } else {
      // send the info as response
      res.json({
        status: info,
      });
    }
  })(req, res); // you need to pass the entire req and res object -- not just req.body
};

//To Update user by ID
exports.updateUserById = (req, res, next) => {
  console.log("User controller reached: updateUserById()");

  userModel
    .findByIdAndUpdate({ _id: req.params.id }, req.body)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json({
        message: "Error occured while updating user.",
        error: err,
      });
    });
};

//To Reset password
exports.resetPassword = (req, res, next) => {
  console.log("User controller reached: resetPassword()");

  const formData = {
    id: req.body.id || req.params.id,
  };

  const userDao = new userModel(formData); //To create draft data to save/update
  userDao.encryptPassword(req.body.password);

  let resetKeyData = userDao.toJSON();
  resetKeyData = {
    _id: req.params.id,
    salt: resetKeyData.salt,
    hash: resetKeyData.hash,
    password: req.body.password,
  };

  userModel
    .findByIdAndUpdate({ _id: req.params.id }, resetKeyData)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json({
        message: "Error occured while updating user password.",
        error: err,
      });
    });
};

//To Delete user by ID
exports.deleteUserById = (req, res, next) => {
  console.log("User controller reached: deleteUserById()");

  userModel
    .deleteOne({ _id: req.params.id })
    .then((data) => {
      res.status(201).json({
        message: "Record deleted successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        message: "Error occured while updating user.",
        error: err,
      });
    });
};

///###################################################################################
//User Login
/*
exports.userLogin = (req, res, next) => {
  console.log("User controller reached: userLogin()");

  const userID = req.body.userID;

  let userLoginData = {};

  //if(req.body.userIDisEmail)

  userModel //Help1 Why below ternary operator is not performing?
    .findOne(req.body.userIDisEmail ? { email: userID } : { mobile: userID })
    .then((data) => {
      userLoginData = data.toJSON();

      if (userLoginData.password == req.body.password) {
        // Apply decrypt logic
        //console.log("Valid user...");
        res.status(200).json(userLoginData);
      } else
        res.status(200).json({
          message: "Invalid credentials",
        });
    })
    .catch((err) => {
      res.status(422).json({
        message: "Error occured while fetching while user login.",
        error: err,
      });
    });
};
*/
