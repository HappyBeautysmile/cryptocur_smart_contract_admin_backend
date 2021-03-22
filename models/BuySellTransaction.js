const mongoose = require("mongoose"); //WD: withdraw , deposit 
const BuySellRole = require("../config/GlobalVariable/BuySellRole")
const TransactionRole = require("../config/GlobalVariable/TransactionRole")
const Schema = mongoose.Schema;
const BuySellTransactionModel = () => {
    var  BuySellSchema = new Schema({
        owner: {
            type: String,
            unique: false,
        },
        fiatInformation:{
            fiatName: {
                type : String,
                required : true,
                },
            selectedCurrency:{
                name: {
                    type : String,
                    required : true,
                },
                exchange_rate :{
                    type: Number,
                    required: true
                },
                quantity: {
                    type : Number,
                    required : true,
                },    
            }
        },
        walletInformation : {
            walletName: {
                type : String,
                required : true,
            }, 
            selectedCoin:{
                coinName : {
                    type : String,
                    required : true,
                },
                coinFullName : {
                    type : String,
                    required : true,
                },
                quantity:{
                    type : Number,
                    required : true 
                }
            },
        },    
      
        actiontype:{
            type:String,
            default:BuySellRole.Buy
        },
        process: {
            type : Number,
            default:TransactionRole.Pendding,
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
    });
        return mongoose.model("BuySellTransaction", BuySellSchema)
}

module.exports = {
    BuySellTransaction: BuySellTransactionModel(),
};