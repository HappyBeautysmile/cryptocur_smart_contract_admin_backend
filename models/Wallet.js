const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const walletmodel = () => {
  var  walletSchema = new Schema({
        owner :{
            type : String,
            required: true
        },
        walletName: {
            type: String,
            required:true
        },
        parentId: {
            type: String,
            // required : true
        },
        publicKey: {
            type: String,
            required : true
        },
        //encrypt primary key
        keystore: {
            type: String,   
            // required : true 
        },
        type: {
            type: String,
        },
        //stauts (active or disable)
        status: {
            type: Boolean, 
            default: true
        },
        //use (currently wallet or not if you have several wallets)
        use: {
            type: Boolean,
            default: false 
        },
        newMessage:{
            type: Number,
            default:0
        },
        failedTransfers:{
            type:Number,
            default:0
        },
        successfulTransfers:{
            type:Number,
            default:0
        },
        transactions:{
            type:Number,
            default:0
        },
        coin:{
            coinName:{
                type:String,
                default:"zedcoin"
            },
            quantity:{
                type:Number,
                default:0
            }
        },
    });
    walletSchema.methods.generateHash = function (params) {
        return bcrypt.hashSync(params, bcrypt.genSaltSync(10));
    }
    return mongoose.model("wallet", walletSchema);
}

module.exports = {
  Wallet: walletmodel(),
};