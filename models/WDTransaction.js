const mongoose = require("mongoose"); //WD: withdraw , deposit 
const WDRole = require("../config/GlobalVariable/WDRole")
const TransactionRole = require("../config/GlobalVariable/TransactionRole")
const Schema = mongoose.Schema;
const WDTransactionModel = () => {
  var  WDSchema = new Schema({
    owner: {
        type: String,
        unique: false,
    },
    fiatName: {
      type : String,
      required : true,
    },
    quantity: {
        type : Number,
        required : true,
    },    
    currency: {
        type : String,
        required : true,
    },
    actiontype:{
        type:String,
        default:WDRole.Deposit
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
return mongoose.model("WDTransaction", WDSchema)
}
module.exports = {
    WDTransaction: WDTransactionModel(),
};