const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const siteinformationmodel = () => {
  var  siteInformationSchema = new Schema({
    asset_account:{
        public_key:{
            type:String,
            default:"GDYPXQUIBIRPIG5XWNZVKAW6BXG6ESNDPDLDFICEE63HAG7C2VIWNUG6"
        },
        secret_Key:{
            type:String,
            default:"SBKYCK2HFHZX22MW7JX4YHU2NVDXWFRDM62XQK7LOU4DBKAYT7WWABTZ"
        },
    },
    destination_account:{
        public_key:{
            type:String,
            default:"GAGPIN5HEPBXR2C2TDEXCZQJDFCUYPYMRALJFVTN6HODO6AZUJHASGOJ"
        },
        secret_Key:{
            type:String,
            default:"SC5AOCHK24WUIHAN4Q3GRFBAL6E2VJ442HDWZGPQA4MBULXCSM3YRGEE"
        },
    }
});

  return mongoose.model("SiteInformation", siteInformationSchema)
}

module.exports = {
    SiteInformation : siteinformationmodel(),
};