const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coinmodel = () => {
  var  coinSchema = new Schema({
    coinFullName:{
      type:String,
      require:true
    },
    coinName: {
      type: String,
      required : true,
    },
    coinPrice: {
      type: Number,
      required : true,
    },
    currency:{
      name:{
        type:String,
        default:"USD"
      },
      exchange_rate:{
        type:Number,
        default:1
      }
    },
    trending:{
        type:Boolean,
        default:true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    avatar :{
     type :String ,
     default : "default.jpeg"
   }
});

  return mongoose.model("Coin", coinSchema)
}

module.exports = {
  Coin: coinmodel(),
};