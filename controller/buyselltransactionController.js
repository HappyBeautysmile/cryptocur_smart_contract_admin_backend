const {BuySellTransaction} = require("../models/BuySellTransaction")
const {Fiat} = require("../models/Fiat")
const {Wallet} = require("../models/Wallet")
const {WDTransaction} = require("../models/WDTransaction")
const {Currency} = require("../models/Currency");
const IndexControll = require("./indexcontroller");
const { Accepted, Pendding, Rejected } = require("../config/GlobalVariable/TransactionRole");


exports.add = async (req,res,next) =>{

    // let nowDate = Date.now;
    let buyselltransaction = new BuySellTransaction(req.body);
    var selectedWallet = await Wallet.findOne({owner :buyselltransaction.owner , use : true });
    var selectedFiat = await Fiat.findOne({owner :buyselltransaction.owner , use : true });
    buyselltransaction.fiatInformation.fiatName =selectedFiat.name
    buyselltransaction.walletInformation.walletName =selectedWallet.walletName
    // console.log(selectedWallet);
    // console.log(selectedFiat);
    // console.log(buyselltransaction);

    let save = await buyselltransaction.save();  
    if(!save){
      return res.send( { status :false,error : "server error"});
    }else{
         console.log("A new WDTransaction was added!");
         let buyselltransaction = await BuySellTransaction.find();
         return res.send({status : true, data : buyselltransaction});
    }
}

exports.getAllbuysellTransactions = async (req,res,next) =>{
  let buySelltransaction = await BuySellTransaction.find().sort({createdAt:-1});
  // console.log(users);
  return res.send({status : "get_success" , data : buySelltransaction});
}

exports.getOwnerbuysellTransactions = async (req,res,next) =>{
  // console.log( req.user,"--------------")
  // {
        // Pendding : 0
        // Rejected : 1
        // Accepted : 2
  // }
  let buySelltransaction = await BuySellTransaction.find({owner:req.body.owner}).sort({createdAt:-1});
  let selectedWallet  = await Wallet.findOne({owner:req.body.owner , use : true})
  return res.send({status : "get_success" , data : buySelltransaction , usedWallet : selectedWallet});
}

exports.getAllbuySellRequestTransactions = async (req,res,next) =>{
  let buySelltransaction = await BuySellTransaction.find({process:0});
  // console.log(users);
  return res.send({status : "get_success" , data : buySelltransaction});
}


exports.deletebuysellTransaction =  async (req, res , next) =>{
    const filter ={_id :req.body._id};
    var buySelltransaction = await BuySellTransaction.findOne(filter);
    if(buySelltransaction)
    {
        var buySelltransaction = await BuySellTransaction.deleteOne(filter);
        return res.send({status : true,data : buySelltransaction});
    }
    else{
        return res.send({status : false ,error : "That Buy/Sell transaction doesn't exist"});
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
          var currencyList = await Currency.find();
          var currencylen = currencyList.length ;
          var tempCurrent_status =[]; // initial setting
          for(var i = 0 ; i < currencylen ; i++)
          {
            tempCurrent_status[i] ={quantity:0 ,name:currencyList[i].name};
          }

          if(choosedFiat.current_status)
          {
            var len = choosedFiat.current_status.length ;
            for(var i = 0 ; i < currencylen ; i++)
            {
              for(var t = 0 ; t < len ; t++)
              {
                // console.log(tempCurrent_status[i].name + " : " + requestedInform.currency);
                if(tempCurrent_status[i].name === choosedFiat.current_status[i].name)
                {
                  tempCurrent_status[i].quantity =choosedFiat.current_status[i].quantity;
                }
              }                          
            }                     
          }
          for(var i = 0 ; i < currencylen ; i++)
          {
            if(tempCurrent_status[i].name === requestedInform.currency)
            {
              tempCurrent_status[i].quantity +=requestedInform.quantity;
              break;
            }
          }
          console.log("tempCurrent_status");
          console.log(tempCurrent_status);
          choosedFiat.current_status = tempCurrent_status;
          console.log("tempCurrent_status");
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

        const updateFiatCurrent_status = {
          current_status : choosedFiat.current_status,
       }
      // console.log(successString);
      console.log("choosedFiat");
      console.log(choosedFiat);
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