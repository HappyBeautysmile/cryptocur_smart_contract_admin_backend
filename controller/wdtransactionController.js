const {WDTransaction} = require("../models/WDTransaction")
const {Fiat} = require("../models/Fiat")
const IndexControll = require("./indexcontroller");
const { Accepted, Pendding, Rejected } = require("../config/GlobalVariable/TransactionRole");


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

exports.getAllwdRequestTransactions = async (req,res,next) =>{
  // console.log( req.user,"--------------")
  // {
        // Pendding : 0
        // Rejected : 1
        // Accepted : 2
  // }
  let wdtransaction = await WDTransaction.find({process:0});
  // console.log(users);
  return res.send({status : "get_success" , data : wdtransaction});
}

exports.getAllwdTransactions = async (req,res,next) =>{
  // console.log( req.user,"--------------")
  // {
        // Pendding : 0
        // Rejected : 1
        // Accepted : 2
  // }
  let wdtransaction = await WDTransaction.find().sort({createdAt:-1});
  // console.log(users);
  return res.send({status : "get_success" , data : wdtransaction});
}
exports.getOwnerwdTransactions = async (req,res,next) =>{
  // console.log( req.user,"--------------")
  // {
        // Pendding : 0
        // Rejected : 1
        // Accepted : 2
  // }
  // let wdtransaction = await WDTransaction.find({owner:req.body.owner}).sort({createdAt:-1});
  let wdtransaction = await WDTransaction.find({owner:req.body.owner}).sort({createdAt:-1});
  console.log(wdtransaction);
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
    let requestedInform = {
      _id :req.body._id,
      fiatName : req.body.fiatName,
      owner: req.body.owner,
      actiontype: req.body.actiontype,
      quantity: req.body.quantity,
      process:req.body.process,
      currency :req.body.currency
    }
    var filter = {_id :requestedInform._id};
    var wdtransaction = await WDTransaction.findOne(filter);
    var successString="success";
    // console.log(wdtransaction);
    if(wdtransaction)
    {
      const updateWDtransaction = {
        process : requestedInform.process,
      }
      if(requestedInform.process === 2 ) // accept action
      {
        //   update fiat account .. withdraw and deoposit
        // console.log("wdtransaction");
        var fiatFilter = {name:requestedInform.fiatName ,owner:requestedInform.owner}
        // console.log("requestedInform.fiatName : " +requestedInform.fiatName + "   owner : " +requestedInform.owner);
        var choosedFiat = await Fiat.findOne(fiatFilter);
        if(!choosedFiat) return res.send({status : false ,error : "That Fiat account doesn't exist"});
        // console.log("Deposit : " +choosedFiat.actiontype);

        if(requestedInform.actiontype ==="Deposit")
        {
          // console.log("Deposit : " + "");
          if(choosedFiat.current_status)
          {
            var len = choosedFiat.current_status.length ;
            for(var i = 0 ; i < len ; i++)
            {
              if(choosedFiat.current_status[i].name === requestedInform.currency)
              {
                choosedFiat.current_status[i].quantity +=requestedInform.quantity;
                break;
              }
            }
            if(i === len)
            {
              // console.log("add new currency");
              choosedFiat.current_status[i] ={name: requestedInform.currency ,quantity:requestedInform.quantity};
            }
          }
          else{
            // When it doesn't exist
            // console.log("when it doesn't exit choosedFiatsss");
            choosedFiat={current_status:[]};
            choosedFiat.current_status[0] ={name: requestedInform.currency ,quantity:requestedInform.quantity};
          }
          successString =requestedInform.quantity + " was successfully " + requestedInform.actiontype + " to " + requestedInform.fiatName +".";
        }
        else
        {
          if(!choosedFiat.current_status)
          {
            return res.send({status : false ,error : "Money doesn't exist"});
          }
          else
          {
            var len = choosedFiat.current_status.length
            for(var i = 0 ; i < len ; i++)
            {
              if(choosedFiat.current_status[i].name === requestedInform.currency)
              {
                if(choosedFiat.current_status[i].quantity < requestedInform.quantity)
                {
                  return res.send({status : false ,error : "Insufficient transfer amount."});
                }
                else{
                  choosedFiat.current_status[i].quantity -=requestedInform.quantity;
                  successString =requestedInform.quantity + " was successfully " + requestedInform.actiontype + " From " + requestedInform.fiatName +".";
                  break;
                }
              }
            }
            if(i === len)
            {
              return res.send({status : false ,error : requestedInform.currency + " doesn't exist."});
            }
          }
        }
        // console.log(choosedFiat);
        // console.log("choosedFiat");
        const updateFiatCurrent_status = {
          current_status : choosedFiat.current_status,
       }
      // console.log(successString);

        await IndexControll.BfindOneAndUpdate(Fiat, fiatFilter , updateFiatCurrent_status);
      }
      var wdtransaction = await IndexControll.BfindOneAndUpdate(WDTransaction, filter , updateWDtransaction);
      return res.send({status : true,data : wdtransaction , success:successString});
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