const {WDTransaction} = require("../models/WDTransaction")
const IndexControll = require("./indexcontroller")


exports.add = async (req,res,next) =>{
    // let nowDate = Date.now;
    let wdtransaction = new WDTransaction({
      owner: req.body.owner,
      fiatName: req.body.fiatName,
      actiontype:req.body.actiontype,
      quantity:req.body.quantity,
      currency:req.body.currency,
      bankAddress:req.body.bankAddress
    });
    console.log(wdtransaction);
    let save = await wdtransaction.save();  
    if(!save){
      return res.send( { status :false,error : "server error"});
    }else{
         console.log("A new WDTransaction was added!");
         let wdtransaction = await WDTransaction.find();
         return res.send({status : true, data : wdtransaction});
    }
  }
exports.getAllwdTransactions = async (req,res,next) =>{
    // console.log( req.user,"--------------")
    let wdtransaction = await WDTransaction.find();
    // console.log(users);
    return res.send({status : "get_success" , data : wdtransaction});
  }
exports.deletewdTransaction =  async (req, res , next) =>{
    const filter ={_id :req.body._id};
    var wdtransaction = await WDTransaction.findOne(filter);
    if(wdtransaction)
    {
        var wdtransaction = await WDTransaction.deleteOne(filter);
        return res.send({status : true,data : wdtransaction});
    }
    else{
        return res.send({status : false ,error : "That Withdraw/Dposite doesn't exist"});
    }
}
exports.editwdTransaction= async (req, res , next) =>{
    var filter = {_id :req.body._id};
    var wdtransaction = await WDTransaction.findOne(filter);
    console.log(wdtransaction);
    if(wdtransaction)
    {
      console.log("wdtransaction");
      const updateWDtransaction = {
        process : req.body.process,
      }
      var wdtransaction = await IndexControll.BfindOneAndUpdate(WDTransaction,filter , updateWDtransaction);
      return res.send({status : true,data : wdtransaction});
    }
    else{
      return res.send({status : false ,error : "That Withdraw/deopsit Transaction doesn't exist"});
    }
  }
//   exports.getCurency = async (req, res , next) =>{
//     var currency = await Currency.findOne({name : req.body.name});
//     if(currency)
//     {
//       return res.send({status : true,data : currency});
//     }
//     else{
//         return res.send({status : false ,error : "That currency's name doesn't exist"});
//     }
//   }