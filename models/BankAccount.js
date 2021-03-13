const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bankaccountmodel = () => {
  var  BankAccountSchema = new Schema({
    address: {
        type: String,
        unique: true,
        required : true,
    }
});
return mongoose.model("BankAccount", BankAccountSchema)
}
module.exports = {
  BankAccount: bankaccountmodel(),
};
