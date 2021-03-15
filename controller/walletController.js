const {Wallet} = require("../models/Wallet")
const {Currency} = require("../models/Currency")
const CurrencyControll = require("./currencyController")
const IndexControll = require("./indexcontroller")


exports.add = async (req,res,next) =>{
    var filter ={owner:req.body.owner , walletName:req.body.walletName}
    var wallet = await Wallet.findOne(filter);
    if(wallet){
      return res.send({ status :false, error : "Wallet already exists."});
    }
    // parent_id: req.body.parent_id,
    // type: req.body.type,
    // status : req.body.status,

    let newWallet = new Wallet({
        owner : req.body.owner,
        walletName:req.body.walletName,
    });

/// connect stellar.net............start
    newWallet.publicKey = req.body.owner + req.body.walletName,
    newWallet.publicKey = newWallet.generateHash(newWallet.publicKey);

    newWallet.keystore = newWallet.owner+newWallet.walletName + Date.now() ;
    newWallet.keystore = newWallet.generateHash(newWallet.keystore);

    var save = await newWallet.save();

/// connect stellar.net............end

    if(!save){
      return res.send( { status :false,error : "server error"});
    }else{
         console.log("A new wallet was added!");
         var wallet = await Wallet.findOne(filter);
         return res.send({status : true,data : wallet});
    }
}

exports.edit = async (req, res , next) =>{
    var filter ={owner:req.body.owner , walletName:req.body.oldWalletName}
    var wallet = await Wallet.findOne(filter);
    if(wallet)
    {
      const updateWalletInform = {
        walletName : req.body.walletName,
      }
      var newFilter = { owner: req.body.owner , walletName : updateWalletInform.walletName};
      var updateWallet = await Wallet.findOne(newFilter);
      if(!updateWallet)
      {
        wallet = await IndexControll.BfindOneAndUpdate(Wallet , filter , updateWalletInform);
        return res.send({status : true , data : wallet});
      }
      return res.send( { status :false,error : "The wallet already exists."});
    }
    return res.send({status : false , error : "That Wallet name  doesn't exist."});
}

exports.allWalletList = async (req , res , next) => {
    var wallet = await Wallet.find();
    if(wallet)
    {
        return res.send({status : true , data : wallet});
    }
    return res.send({ status : false , error : "Wallets don't exist."})
}

exports.ownerWalletList = async (req , res , next) => {
    var filter = {owner : req.body.owner};
    var wallet = await Wallet.find(filter);
    // console.log("I am here");

    if(wallet)
    {
        return res.send({status : true , data : wallet});
    }
    return res.send({ status : false , error : "Wallets don't exist."})
}

exports.delete = async (req , res , next) => {
    var filter = {owner : req.body.owner , walletName : req.body.walletName}
    var wallet = await Wallet.find(filter);
    if(wallet)
    {
        // connect stellar.net to delete wallet. ******* start *******
        
        // connect stellar.net to delete wallet. ******* end *******
        wallet = await Wallet.deleteOne(filter);
        return res.send({status: true , data : wallet});
    }
    return res.send({status: false , error :"That wallet doesn't exist."})
}
