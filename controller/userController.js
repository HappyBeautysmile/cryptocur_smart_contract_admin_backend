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
  return res.send({status : true, data : auth});
}

exports.getuser = async (req,res,next) =>{
  let user = {
    status : true,
    data : req.user
  }
  res.send(user);
  return next();
}

exports.getAllUsers = async (req,res,next) =>{
  var users = await User.find()
  console.log(users);
  return res.send({status : "get_success" , data : users});
}

exports.deleteUser =  async (req, res , next) =>{
  var user = await User.findOne({email : req.body.user_email});
  if(user)
  {
    var user = await User.deleteOne({email : req.body.user_email});
    return res.send({status : true,data : user});
  }
  else{
    return res.send({status : false ,error : "user doesn't exist"});
  }
}

exports.editUser = async (req, res , next) =>{
  var user = await User.findOne({email : req.body.user_email});
  if(user)
  {
    const filter = {email : req.body.user_email};
    const updateDoc = {
      $set: {
        firstName:req.body.user_firstName,
        lastName: req.body.user_lastName,
        password: req.body.user_password
      },
    };
    const options = { upsert: true };
    var user = await User.updateOne(filter ,updateDoc, options);
    return res.send({status : true,data : user});
  }
  else{
    return res.send({status : false ,error : "user doesn't exist"});
  }
}

exports.getUser = async (req, res, next)=>{
  const filter = {email : req.body.user_email};
  var user = await User.findOne(filter);
  if(user)
  {
    return res.send({status : true,data : user});
  }
  else{
    return res.send({status : false ,error : "user doesn't exist"});
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
      //  console.log("success regist");
       var auth = await User.findOne({email : req.body.email});
       return res.send({status : true,data : auth});
  }
}