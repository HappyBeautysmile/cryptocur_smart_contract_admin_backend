const {Wallet} = require("../models/Wallet")
const {Currency} = require("../models/Currency")
const IndexControll = require("./indexcontroller")


exports.changeCurrentUse = async (wallet) =>{
    if(wallet.use === true)
    {
        var enableWallet = await Wallet.find({owner : wallet.owner , status:true , use:false})
        if(enableWallet.length)
        {
            // change use;
            console.log("enableWallet.length");
            await IndexControll.BfindOneAndUpdate(Wallet, {owner:enableWallet[0].owner , walletName : enableWallet[0].walletName},{use:true}) ;
        }
    }
}
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
    var walletlist = await Wallet.find({owner:req.body.owner ,use:true});
    if(walletlist.length === 0)
    {
        newWallet.use = true;
    }
    newWallet.coinList = [{coinName:"ZTC" , coinFullName:"Zedcoin",quantity :0}];
/// connect stellar.net............start
    newWallet.keyInformation.publicKey = req.body.owner + req.body.walletName,
    newWallet.keyInformation.publicKey = newWallet.generateHash(newWallet.keyInformation.publicKey);

    newWallet.keyInformation.secretKey = newWallet.owner+newWallet.walletName + Date.now() ;
    newWallet.keyInformation.secretKey = newWallet.generateHash(newWallet.keyInformation.secretKey);

/// connect stellar.net............end
    console.log("newWallet");
    console.log(newWallet);
    console.log("newWallet");
    var save = await newWallet.save();
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

exports.statusActionFunc = async (req, res , next) =>{
    var filter ={owner:req.body.owner , walletName:req.body.walletName}
    var wallet = await Wallet.findOne(filter);
    if(wallet)
    {
        const updateWalletInform = {
            walletName : req.body.walletName,
            use: false,
            status : !wallet.status 
        }
        this.changeCurrentUse(wallet);
        wallet = await IndexControll.BfindOneAndUpdate(Wallet , filter , updateWalletInform);
        return res.send({status : true , data : wallet});
    }
    return res.send({status : false , error : "That Wallet name  doesn't exist."});
}

exports.selectwallet = async (req, res , next) =>{
    var filter ={owner:req.body.owner , walletName : req.body.walletName}
    var wallet = await Wallet.findOne(filter);
    // console.log(wallet);
    if(wallet)
    {
        var oldWallet = await Wallet.findOne({owner:req.body.owner ,use:true});
        if(oldWallet)
        {
            await IndexControll.BfindOneAndUpdate(Wallet , {owner:req.body.owner ,use:true} , {use:false});
        }
        wallet = await IndexControll.BfindOneAndUpdate(Wallet ,filter , {use:true});
        return res.send({status : true , data : wallet});
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
    var wallet = await Wallet.findOne(filter);
    if(wallet)
    {
        await this.changeCurrentUse(wallet);
        // connect stellar.net to delete wallet. ******* start *******
        
        // connect stellar.net to delete wallet. ******* end *******
        wallet_delete = await Wallet.deleteOne(filter);
        return res.send({status: true , data : wallet_delete});
    }
    return res.send({status: false , error :"That wallet doesn't exist."})
}
