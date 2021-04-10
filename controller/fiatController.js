const {Fiat} = require("../models/Fiat")
const {User} = require("../models/Users")
const {Currency} = require("../models/Currency")
const {Wallet} = require("../models/Wallet")
const CurrencyControll = require("./currencyController")
const IndexControll = require("./indexcontroller")

// add fiat in admin panel
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
    });
    var  new_current_status = [] ;
    var  currencies = await Currency.find();
    for(var i = 0 ; i < currencies.length ; i++)
    {
      new_current_status[i] = {name:currencies[i].name ,quantity :0};
    }
    newFiat.current_status = new_current_status;
    var fiat= await Fiat.findOne({owner:req.body.email ,use:true});
    console.log("fiatlist")
    console.log(fiat)
    console.log("fiatlist")
    if(!fiat)
    {
      newFiat.use = true;
    }
    console.log(newFiat) ;
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
    var fiats = await Fiat.find();
    // console.log(users);
    // are you there???
    return res.send({status : "get_success" , data : fiats});
}
// await Wallet.remove({}) 
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
      if(fiats[i].current_status[t]==null)
      {
        // fiats[i].current_status[currencieslist[t].name]=;
        fiats[i].current_status[t] ={name : currencieslist[t].name,exchange_rate : currencieslist[t].exchange_rate ,quantity:0};
        // fiats[i].current_status[currencieslist[t].name].exchangeQuantity =  0;
      }
      else{
        fiats[i].current_status[t].exchange_rate = currencieslist[t].exchange_rate;
        // fiats[i].current_status[t].exchangeQuantity = 0;
        // fiats[i].current_status[currencieslist[t].name].exchangeQuantity =  0
      // console.log( fiats[i].current_status[t].name + " : " + fiats[i].current_status[t].quantity);
      // console.log(Are ?);
      }
    }
  }
  /*
  [{
    exchange_rate: 1.2
    name: "EUR"
    quantity: 15000
    totalQuantity: 15000
  }]
  */
  selectedFiat = await Fiat.findOne({owner:req.body.email , use: true});
  currencies = await Currency.find();
  if(selectedFiat && selectedFiat.current_status )
  {
    for(var i = 0 ; i < selectedFiat.current_status.length ; i++)
    {
      for(var t = 0 ; t <  currencies.length; t++)
      {
        if(selectedFiat.current_status[i].name === currencies[t].name)
        {
          selectedFiat.current_status[i].exchange_rate = currencies[t].exchange_rate ;
          selectedFiat.current_status[i].totalQuantity = selectedFiat.current_status[i].quantity  ;
        }
      }
    }
  }
  return res.send({status : "get_success" , data : fiats ,selectedFiat : selectedFiat});
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

exports.selectfiat = async (req, res , next) =>{
    var filter ={owner:req.body.owner , name : req.body.name}
    var fiat = await Fiat.findOne(filter);
    // console.lo("")
    if(fiat)
    {
      var oldFiat = await Fiat.findOne({owner:req.body.owner ,use:true});
      if(oldFiat)
      {
          await IndexControll.BfindOneAndUpdate(Fiat , {owner:req.body.owner ,use:true} , {use:false});
      }
      fiat = await IndexControll.BfindOneAndUpdate(Fiat ,filter , {use:true});
    
      return res.send({status : true , data : fiat});
    }
    return res.send({status : false , error : "That Wallet name  doesn't exist."}); 
}

