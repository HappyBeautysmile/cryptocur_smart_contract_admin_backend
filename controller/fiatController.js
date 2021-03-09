const {Fiat} = require("../models/Fiat")
const {User} = require("../models/Users")
const {Currency} = require("../models/Currency")
const CurrencyControll = require("./currencyController")
const IndexControll = require("./indexcontroller")


exports.add = async (req,res,next) =>{
    var fiat = await Fiat.findOne({name : req.body.name ,owner: req.headers.email});
    if(fiat){
      return res.send({ status :false, error : "fiat already exists"});
    }
    let newFiat = new Fiat({
        owner:req.headers.email,
        name: req.body.name,
        current_status: req.body.current_status
    });
    var save = await newFiat.save();
    if(!save){
      return res.send( { status :false,error : "server error"});
    }else{
         console.log("A new fiat was added!");
         var fiat = await Fiat.findOne({name : req.body.name ,owner: req.headers.email});
         return res.send({status : true,data : currency});
    }
}

exports.newFiat = async (req,res,next) =>{
  var user = await User.findOne({email: req.body.email});
  if(user)
  {
    var fiat = await Fiat.findOne({name : req.body.name ,owner: req.body.email});
    if(fiat){
      return res.send({ status :false, error : "fiat already exists"});
    }
    let newFiat = new Fiat({
        owner:req.body.email,
        name: req.body.name,
        current_status: req.body.current_status
    });
    var save = await newFiat.save();
    if(!save){
      return res.send( { status :false,error : "server error"});
    }else{
         console.log("A new fiat was added!");
         var fiat = await Fiat.findOne({name : req.body.name ,owner: req.headers.email});
         return res.send({status : true, data : fiat});
    }
  }
  else{
    return res.send( { status :false,error : "The user doesn't exist"});
  }
}

exports.getFiatList = async (req,res,next) =>{
    // console.log( req.user,"--------------")
    var fiats = await Fiat.find()
    // console.log(users);
    return res.send({status : "get_success" , data : fiats});
}
exports.getUserFiatList = async (req,res,next) =>{
  // console.log( "--------------")
  var fiats = await Fiat.find({owner : req.body.email});
  var currencieslist = await Currency.find();
  
  for(var i = 0 ; i < fiats.length ; i++)
  {
    if(fiats[i].current_status==null)
    {
      fiats[i].current_status = [];
    }
    for(var t = 0 ; t < currencieslist.length ; t++)
    {
      if(fiats[i].current_status[currencieslist[t].name]==null)
      {
        // fiats[i].current_status[currencieslist[t].name]=;
        fiats[i].current_status[t] ={name : currencieslist[t].name,exchange_rate : currencieslist[t].exchange_rate ,quantity:0};
        // fiats[i].current_status[currencieslist[t].name].exchangeQuantity =  0;
      }
      else{
        fiats[i].current_status[t].exchange_rate = currencieslist[t].exchange_rate;
        // fiats[i].current_status[t].exchangeQuantity = 0;
        // fiats[i].current_status[currencieslist[t].name].exchangeQuantity =  0;
      }
    }
  }
  // console.log(fiats);
  // [
  //   {
  //     createdAt: 2021-03-06T11:54:36.648Z,
  //     _id: 60436e52164d7159d08c5cf5,
  //     owner: 'admin@gmail.com',
  //     name: 'Love',
  //     __v: 0,
  //     current_status: {
            // {
            //   USD: { exchange_rate: 1, quantity: 0 ,exchangeQuantity:0},
            //   EUR: { exchange_rate: 1.2, quantity: 0 ,exchangeQuantity:0}
            // }
  //     }
  //   },
  // ]
  // console.log(fiats[0].current_status) ;
  // console.log(fiats) ;
  return res.send({status : "get_success" , data : fiats});
}

exports.getFiat = async (req, res, next)=>{
    const filter ={name : req.body.name ,owner: req.headers.email};
    var fiat = await Fiat.findOne(filter);
    if(fiat)
    {
        return res.send({status : true,data : fiat});
    }
    else{
        return res.send({ status :false, error : "The fiat doesn't exists"});
    }
}
exports.deleteFiat =  async (req, res , next) =>{
    const filter ={name : req.body.name ,owner: req.body.email};
    var fiat = await Fiat.findOne(filter);
    if(fiat)
    {
        var fiat = await Fiat.deleteOne(filter);
        return res.send({status : true, data : fiat});
    }
    else{
        return res.send({status : false ,error : "That fiat's name doesn't exist"});
    }
}

exports.editFiat = async (req, res , next) =>{
    const filter ={name : req.body.oldName ,owner: req.body.oldEmail};
    console.log(req.body);
    var fiat = await Fiat.findOne(filter);
    if(fiat)
    {
      const updateFiat = {
        name : req.body.name,
        owner : req.body.email,
        current_status : req.body.current_status,
      }
      var user = await User.findOne({email: req.body.email});
      if(user)
      {
        var fiat = await IndexControll.BfindOneAndUpdate(Fiat,filter , updateFiat);
        return res.send({status : true , data : fiat});
      }
      return res.send( { status :false,error : "The user doesn't exist"});
    }
      return res.send({status : false , error : "That fiat's name or that owner doesn't exist"});
  }
