const {User} = require("../models/Users")
const IndexControll = require("./indexcontroller")

exports.signin  = async (req,res,next) =>{
  console.log(req.body)
  var user = await User.findOne({email : req.body.email});
  if(!user){
    return res.send({status:false,error : "user not found"});
  }
  if(!user.validPassword(req.body.password,user.password)){
    return res.send({status:false,error : "invaild password"});  
  }

  var hashstr = {
    _id : user._id,
    email : user.email
  }
  var auth =  IndexControll.encrypt(JSON.stringify(hashstr));
  return res.send({status : true,data : auth});
}

exports.getuser = async (req,res,next) =>{
  var user = await User.findOne({email : req.body.email});
  if(user){
    return res.send(user);
  }
}

exports.signup = async (req,res,next) =>{
  var user = await User.findOne({email : req.body.email});
  if(user){
    return res.send({ status :false, error : "user already exists"});
  }
  let newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  });
  newUser.password = newUser.generateHash(req.body.password);
  var save = await newUser.save();
  if(!save){
    return res.send( { status :false,error : "server error"});
  }else{
       return res.send({status : true,data : auth});
  }
}