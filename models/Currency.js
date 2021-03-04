const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const currencymodel = () => {
  var  CurrencySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required : true,
    },
    exchange_rate: {
     type : Number,
     required : true,
   },
   avatar :{
     type :String ,
     default : "default.jpg"
   }
});
return mongoose.model("Currency", CurrencySchema)
}
module.exports = {
  Currency: currencymodel(),
};