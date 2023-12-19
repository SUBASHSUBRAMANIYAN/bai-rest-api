var express = require("express");
var router = express.Router();

const {
  getUsers,
  getUserByID,
  createUserWithSignup,
  userLogin,
  updateUserById,
  resetPassword,
  deleteUserById,
} = require("../controllers/user.controller");


//======== GET
router.get("/", getUsers);

router.get("/:id", getUserByID);


//======== POST
router.post("/", createUserWithSignup); //User create along with signup

router.post("/login", userLogin); 


//======== PUT
router.put("/:id", updateUserById);

router.put("/resetPassword/:id", resetPassword);

//======== delete
router.delete("/:id", deleteUserById);

module.exports = router;