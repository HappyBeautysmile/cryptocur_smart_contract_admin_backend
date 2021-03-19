const {Coin} = require("../models/Coin")
const {Currency} = require("../models/Currency")
const IndexControll = require("./indexcontroller")
const config = require('../db');
const fs = require('fs')
const CurrencyControll = require("./currencyController")

// coinFullName , coinName, coinPrice , currencyType, trending , createdAt , avatar
exports.Add = async (req, res , next) =>{
  var coindata = req.body;
  var coin = await Coin.findOne({coinFullName : coindata.coinFullName, coinName : coindata.coinName});
  console.log(coindata);
  if(!coin)
  {
    let newCoin = new Coin(coindata);    
    var createdCoin = await newCoin.save();
    return res.send({status : true,data : createdCoin});
  }
  else{
    return res.send({status : false ,error : "That coin already exists"});
  }
}

exports.Delete =  async (req, res , next) =>{
  var coindata = req.body;
  var filter = {coinFullName : coindata.coinFullName , coinName : coindata.coinName};
  var coin = await Coin.findOne(filter);
  if(coin)
  {
    var coin_status = await Coin.deleteOne(filter);
    return res.send({status : true,data : coin_status});
  }
  return res.send({status : false ,error : "That Coin doesn't exist"});
}

exports.getAllCoins = async (req,res,next) =>{
  var coins = await Coin.find();
  var currencies = await Currency.find()
  for(var i = 0 ; i < coins.length ; i++)
  {
    for(var t = 0 ; t < currencies.length ; t++)
    {
      if(currencies[t].name === coins[i].currency.name)
      {
        coins[i].currency.exchange_rate =  currencies[t].exchange_rate;
      }
    }
  }
  return res.send({status : "get_success" , data : coins});
}
exports.getCoin = async (req, res , next) =>{
  var coindata = req.body;
  var filter = {coinFullName : coindata.coinFullName , coinName : coindata.coinName};
  var coin = await Coin.find(filter)
  if(coin)
  {
    return res.send({status : "get_success" , data : coin});
  }
  return res.send({status : false ,error : "That Coin doesn't exist"});
}
// exports.signin  = async (req,res,next) =>{
//   // console.log(req.body)
//   var user = await User.findOne({email : req.body.email});
//   if(!user){
//     return res.send({status:false,error : "user not found"});
//   }
//   if(!user.validPassword(req.body.password,user.password)){
//     return res.send({status:false,error : "invaild password"});  
//   }

//   var hashstr = {
//     _id : user._id,
//     email : user.email
//   }
//   var auth =  IndexControll.encrypt(JSON.stringify(hashstr));
//   return res.send({status : true, data : auth});
// }


// exports.adminsignin  = async (req,res,next) =>{
//   // console.log(req.body)
//   var user = await User.findOne({email : req.body.email});
//   if(!user){
//     return res.send({status:false,error : "The email address or password doesn't match any account."});
//   }
//   if(!user.validPassword(req.body.password,user.password)){
//     return res.send({status:false,error : "invaild password"});  
//   }
//   if(user.role !=0)
//   {
//     return res.send({status:false,error : "The email address access denied"});  
//   }
//   var hashstr = {
//     _id : user._id,
//     email : user.email
//   }
//   var auth =  IndexControll.encrypt(JSON.stringify(hashstr));
//   return res.send({status : true, data : auth});
// }

// exports.getuser = async (req,res,next) =>{
//   let user = {
//     status : true,
//     data : req.user
//   }
//   res.send(user);
//   return next();
// }

// exports.getAllUsers = async (req,res,next) =>{
//   // console.log( req.user,"--------------")
//   var users = await User.find()
//   // console.log(users);
//   return res.send({status : "get_success" , data : users});
// }



// exports.personalUdate = async (req, res, next) => {
//   var userdata = req.body;
//   var filter = {email:userdata.email};
//   var user = await User.findOne();
//   const updatePerson = {
//     lastName : userdata.lastName,
//     firstName : userdata.firstName,
//   }
//   var user = await IndexControll.BfindOneAndUpdate(User,filter , updatePerson);
//   return res.send({status : true,data : user});
// }



// exports.getUser = async (req, res, next)=>{
//   const filter = {email : req.body.user_email};
//   var user = await User.findOne(filter);
//   if(user)
//   {
//     return res.send({status : true,data : user});
//   }
//   else{
//     return res.send({status : false ,error : "user doesn't exist"});
//   }
// }

// exports.signup = async (req,res,next) =>{
//   var user = await User.findOne({email : req.body.email});
//   if(user){
//     return res.send({ status :false, error : "user already exists"});
//   }
//   let newUser = new User({
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     email: req.body.email,
//     password: req.body.password,
//     role: req.body.role,
//   });

//   newUser.password = newUser.generateHash(req.body.password);
//   var save = await newUser.save();
//   if(!save){
//     return res.send( { status :false,error : "server error"});
//   }else{
//       //  console.log("success regist");
//        var auth = await User.findOne({email : req.body.email});
//        return res.send({status : true,data : auth});
//   }
// }