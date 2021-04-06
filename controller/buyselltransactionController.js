const {BuySellTransaction} = require("../models/BuySellTransaction")
const {Fiat} = require("../models/Fiat")
const {Wallet} = require("../models/Wallet")
const {Coin} = require("../models/Coin")
const {WDTransaction} = require("../models/WDTransaction")
const {Currency} = require("../models/Currency");
const IndexControll = require("./indexcontroller");
const { Accepted, Pendding, Rejected } = require("../config/GlobalVariable/TransactionRole");
const  BuySellRole = require("../config/GlobalVariable/BuySellRole");
const { COINURL } = require("../db");

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
        selectedWallet.transactions++;
        await IndexControll.BfindOneAndUpdate(Wallet , {_id : selectedWallet._id }, selectedWallet);
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


exports.editbuysellTransaction= async (req, res , next) =>{
    // {
    //     "owner":"test@gmail.com",
    //     "fiatInformation" :{
    //         "fiatName" : "hot",
    //         "selectedCurrency" : {
    //             "name" :"USD",
    //             "exchange_rate" :"1",
    //             "quantity" :40.5
    //         }
    //     },
    //     "walletInformation" :{
    //         "walletName" : "Bee",
    //         "selectedCoin" :{
    //             "coinName" : "ZDC",
    //             "coinFullName" :"zedcoin",
    //             "quantity" :"0.32425"
    //         }
    //     },
    //     "actiontype" : "Buy" 
    // }

    let requestedInform = req.body;
    let selectedFiat = await Fiat.findOne({owner:requestedInform.owner , name : requestedInform.fiatInformation.fiatName});
    // let selectedCurrency = await Currency.findOne({ name : requestedInform.fiatInformation.selectedCurrency.name });

    let selectedWallet = await Wallet.findOne({owner:requestedInform.owner , walletName : requestedInform.walletInformation.walletName});

    // let selectedCoin = await Coin.findOne({coinName : requestedInform.walletInformation.selectedCoin.coinName ,coinFullName : requestedInform.walletInformation.selectedCoin.coinFullName}) ;
    // let selectedBuySellTransaction = await BuySellTransaction.findOne({_id : req.body._id});
    if(selectedWallet.successfulTransfers === null)
    { 
      selectedWallet.successfulTransfers  = 0;
    }
    if(selectedWallet.failedTransfers === null)
    { 
      selectedWallet.failedTransfers  = 0;
    }
    if(requestedInform.actiontype === BuySellRole.Buy && selectedFiat)
    {
      if(selectedFiat.current_status )
      {
        var currencyListLen = selectedFiat.current_status.length;
        var successFlag = false ;

        // find currency
        for(var i = 0 ; i < currencyListLen ; i++)
        {
          // console.log(selectedFiat.current_status[i].name + " : " + selectedFiat.current_status[i].quantity);
          if(selectedFiat.current_status[i].name === requestedInform.fiatInformation.selectedCurrency.name && selectedFiat.current_status[i].quantity >= requestedInform.fiatInformation.selectedCurrency.quantity)
          {
            successFlag = true ;  
            selectedFiat.current_status[i].quantity -= requestedInform.fiatInformation.selectedCurrency.quantity ;
          }
        }
        if(successFlag === false) 
        {
          selectedWallet.failedTransfers++;
          await IndexControll.BfindOneAndUpdate(Wallet , {owner:requestedInform.owner , walletName : requestedInform.walletInformation.walletName} , selectedWallet);
          await IndexControll.BfindOneAndUpdate(BuySellTransaction, {_id : req.body._id} , {process : 1});
          return res.send({status : false , error : "Your amount of that fiat is not enough"});
        }
        if(selectedWallet)
        {
          var coinListLen =selectedWallet.coinList ? selectedWallet.coinList.length :0 ;
          for( var t = 0 ; t < coinListLen ; t++)
          {
            if( selectedWallet.coinList[t].coinName === requestedInform.walletInformation.selectedCoin.coinName)
            {
              selectedWallet.coinList[t].quantity += requestedInform.walletInformation.selectedCoin.quantity ;
              break ;
            }
          }
          if( t === coinListLen)
          {
            selectedWallet.coinList[t] ={
              coinName : requestedInform.walletInformation.selectedCoin.coinName,
              coinFullName : requestedInform.walletInformation.selectedCoin.coinFullName,
              quantity :requestedInform.walletInformation.selectedCoin.quantity
            }
          }
        }
        selectedWallet.successfulTransfers++;
        await IndexControll.BfindOneAndUpdate(Fiat , {_id : selectedFiat._id} , selectedFiat);
        await IndexControll.BfindOneAndUpdate(BuySellTransaction, {_id : req.body._id} , {process : 2});
        await IndexControll.BfindOneAndUpdate(Wallet , {_id : selectedWallet._id} , selectedWallet);

      }
      else{
        selectedWallet.failedTransfers++;
        await IndexControll.BfindOneAndUpdate(BuySellTransaction, {_id : req.body._id} , {process : 1});
        await IndexControll.BfindOneAndUpdate(Wallet ,{_id : selectedWallet._id}, selectedWallet);
        return res.send({status : false , error : "Please check your Fiat and "})
      }
      return res.send({status : true , data : requestedInform}) ; 
    }
    else if(requestedInform.actiontype === BuySellRole.Sell && selectedWallet )    //BuySellRole.Sell
    {           

    }
    selectedWallet.failedTransfers++;
    await IndexControll.BfindOneAndUpdate(BuySellTransaction, {_id : req.body._id} , {process : 1});
    await IndexControll.BfindOneAndUpdate(Wallet ,{_id : selectedWallet._id}, selectedWallet);
    return res.send({status : false , error : "Please check your Wallet and Fiat account. They are not allowed it."})
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