const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const currencyQuantity = () =>{
  var CurrencyQuantitySchema = new Schema({
    currencyName:{
      type:String,
      require: true,
    },
    quantity:{
      type:Number ,
      default : 0
    }
  });
  // return mongoose.model("CurrencyQuantity", CurrencyQuantitySchema)
}
const fiatmodel = () => {
  var  fiatSchema = new Schema({
    owner:{
      type:String,
      require:true
    },
    name: {
      type: String,
      unique: true,
      required : true,
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    current_status: {
      type : Object,
    },
});


// invest: {
//   type : Object,
// },
// profit: {
//   type : Object,
// },
// withdraw: {
//   type : Object,
// },
// deposit: {
//   type : Object,
// },

return mongoose.model("fiat", fiatSchema)
}
module.exports = {
  Fiat: fiatmodel(),
};