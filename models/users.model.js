const mongooseDBLayer = require("./mongo.connection");
const userCrypto = require("crypto");
const jwt = require("jsonwebtoken");

const userSchema = new mongooseDBLayer.Schema(
  {
    fullName: String,
    email: {
      type: String,
      require: true,
      unique: true,
    },
    isEmailVerified: Boolean,
    phone: {
      type: String,
      require: true,
      unique: true,
    },
    isPhoneVerified: Boolean,
    isdCode: String,
    createdBy: String,
    createdOn: {
      type: Date,
      default: Date.now,
    },
    updatedBy: String,
    updatedOn: {
      type: Date,
    },
    employeeId: String,
    passwordHint: String,
    salt: String,
    hash: String,
    remarks: String,
  },
  {
    strict: true,
  }
);

//Encrypting password during save user
userSchema.methods.encryptPassword = function (password) {
  this.salt = userCrypto.randomBytes(192).toString("hex");

  this.hash = userCrypto
    .pbkdf2Sync(password, this.salt, 5011994, 156, "sha512")
    .toString("hex");
};

//Verfify login input password with DB password
userSchema.methods.validatePassword = function (password) {
  const newHash = userCrypto
    .pbkdf2Sync(password, this.salt, 5011994, 156, "sha512")
    .toString("hex");

  return this.hash === newHash;
};

userSchema.methods.generateJwt = function () {
  const today = new Date();
  const tokeExpiryDate = new Date(today);
  tokeExpiryDate.setDate(today.getDate() + 3);

  return jwt.sign(
    {
      email: this.email,
      id: this._id,
      exp: parseInt(tokeExpiryDate.getTime() / 1000, 10),
    },
    //"React is good" // Secrect text can be anything ()
    this.salt // Here I am using salt
  );
};

module.exports = mongooseDBLayer.model("User", userSchema);
