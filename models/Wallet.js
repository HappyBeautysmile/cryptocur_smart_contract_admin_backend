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
        //encrypt primary key
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
        coinList:{
            type : Object,
        },
        keyInformation:{
            publicKey :{
                type : String,
                default: "GDYPXQUIBIRPIG5XWNZVKAW6BXG6ESNDPDLDFICEE63HAG7C2VIWNUG6"
            },
            secretKey :{
                type : String ,
                default : "SBKYCK2HFHZX22MW7JX4YHU2NVDXWFRDM62XQK7LOU4DBKAYT7WWABTZ"
            }
        }
    });
    walletSchema.methods.generateHash = function (params) {
        return bcrypt.hashSync(params, bcrypt.genSaltSync(10));
    }
    return mongoose.model("wallet", walletSchema);
}

module.exports = {
  Wallet: walletmodel(),
};