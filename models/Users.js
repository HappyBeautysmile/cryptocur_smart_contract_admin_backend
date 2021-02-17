const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const usermodel = () =>{

  const usersSchema = new Schema({
    firstName: {
      type: String,
      unique: false,
      required: [true, "firstname is required"]
    },
    lastName: {
      type: String,
      unique: false,
      required: [true, "lastname is required"]
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email is required"]
    },
    password: {
      type: String,
      unique: false,
      validate: {
        validator: function (v) {
          return /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(v);
        },
        message: props => `${props.value} is not a valid password`
      },
      required: [true, "password is required"]
    },
    
    createdAt: {
      type: Date,
      default: Date.now()
    },
    
  });
  
  usersSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }
  
  usersSchema.methods.validPassword = function (password, encrypted) {
    return bcrypt.compareSync(password, encrypted);
  }

  return mongoose.model("User", usersSchema);
}



module.exports = {
  User: usermodel(),
};