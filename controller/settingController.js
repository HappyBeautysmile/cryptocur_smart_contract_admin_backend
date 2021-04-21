const IndexControll = require("./indexcontroller")
const config = require('../db');
const fs = require('fs')
const {User} = require("../models/Users")
const {BankAccount} = require("../models/BankAccount")
const {SiteInformation} = require("../models/SiteInformation")

exports.bankAccountChange = async (req, res, next) => {
    var siteInformation = await SiteInformation.findOne();
    if(siteInformation)
    {
    //   var filter = {_id: siteInformation._id};
        const updatePerson = {
            bankAddress : req.body.address,
        }
        var siteInformation = await IndexControll.BfindOneAndUpdate( SiteInformation , {} , updatePerson);
        return res.send({status : true,data : siteInformation});
    }
    else
    {
        let newBank = new SiteInformation({
            bankAddress:req.body.address,
        });
        var save = await newBank.save();
        return res.send({status : true , data : save});
    }
}
exports.getBankAccount = async (req,res,next) =>{
    // console.log( req.user,"--------------")
    var siteInformation = await SiteInformation.findOne()
    if(!siteInformation)
    {
        return res.send({status: false , error:"SiteInformation account doesn't exsit"})
    }
    return res.send({status : "get_success" , data : siteInformation});
}
// stellar asset keys(public key , secret key)
exports.getsiteInformation = async (req , res , next) => {
    var siteInformation = await SiteInformation.findOne();
    if(siteInformation)
    {
        return res.send({status : true , data : siteInformation});
    }
    else{
        var newSiteInformation = new SiteInformation({});
        var save = await newSiteInformation.save();
        return res.send({status : true , data : save});
    }
}

exports.editFeePercent = async (req, res , next) =>{
    var siteInformation = await SiteInformation.findOne();
    if(siteInformation)
    {
        var siteInformation = await IndexControll.BfindOneAndUpdate(SiteInformation ,{} , {feePercent :req.body.feePercent});
        return res.send({status : true , data : siteInformation});
    }
    return res.send({status : false , error : "That siteInformation doesn't exist"});
}

