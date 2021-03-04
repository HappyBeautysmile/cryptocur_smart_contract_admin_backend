const {Currency} = require("../models/Currency")
const IndexControll = require("./indexcontroller")


exports.add = async (req,res,next) =>{
    var currency = await Currency.findOne({name : req.body.name});
    if(currency){
      return res.send({ status :false, error : "currency already exists"});
    }
    let newCurrency = new Currency({
      name: req.body.name,
      exchange_rate: req.body.exchange_rate,
    });
    var save = await newCurrency.save();
    if(!save){
      return res.send( { status :false,error : "server error"});
    }else{
         console.log("A new currency was added!");
         var currency = await Currency.findOne({name : req.body.name});
         return res.send({status : true,data : currency});
    }
  }
exports.getAllCurrencies = async (req,res,next) =>{
    // console.log( req.user,"--------------")
    var currencies = await Currency.find()
    // console.log(users);
    return res.send({status : "get_success" , data : currencies});
  }
exports.deleteCurrency =  async (req, res , next) =>{
    var currency = await Currency.findOne({name : req.body.name});
    if(currency)
    {
        var currency = await Currency.deleteOne({name : req.body.name});
        return res.send({status : true,data : currency});
    }
    else{
        return res.send({status : false ,error : "That currency's name doesn't exist"});
    }
}
exports.editCurrency = async (req, res , next) =>{
    var currency = await Currency.findOne({name : req.body.name});
    if(currency)
    {
      const filter = {name : currency.name};
      const updateCurrency = {
        exchange_rate : req.body.exchange_rate,
      }
      var currency = await IndexControll.BfindOneAndUpdate(Currency,filter , updateCurrency);
      return res.send({status : true,data : currency});
    }
    else{
      return res.send({status : false ,error : "That currency's name doesn't exist"});
    }
  }
  exports.getCurency = async (req, res , next) =>{
    var currency = await Currency.findOne({name : req.body.name});
    if(currency)
    {
      return res.send({status : true,data : currency});
    }
    else{
        return res.send({status : false ,error : "That currency's name doesn't exist"});
    }
  }