const {Fiat} = require("../models/Fiat")
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
exports.getFiatList = async (req,res,next) =>{
    // console.log( req.user,"--------------")
    var fiats = await Fiat.find()
    // console.log(users);
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
    const filter ={name : req.body.name ,owner: req.headers.email};
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
    const filter ={name : req.body.name ,owner: req.headers.email};
    var fiat = await Fiat.findOne(filter);
    if(fiat)
    {
      const updateFiat = {
        name : req.body.name,
        current_status : req.body.current_status,
      }
      var fiat = await IndexControll.BfindOneAndUpdate(Fiat,filter , updateFiat);
      return res.send({status : true , data : fiat});
    }
    else{
      return res.send({status : false , error : "That fiat's name doesn't exist"});
    }
  }
