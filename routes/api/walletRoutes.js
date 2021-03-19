const router = require("express").Router();
const authMiddleware = require("../../config/middleware/authMiddleware");
// const UserControllers =require("../../controller/userController");
// const CurrencyControllers =require("../../controller/currencyController");
// const multer = require('multer');
// const config = require('../../db');
// const Basecontroll = require("../../controller/indexcontroller")
// /api/users/login
// route to login the user
const WalletController =require("../../controller/walletController");

router.post("/add" , authMiddleware.isLoggedIn,WalletController.add);
router.post("/edit" , authMiddleware.isLoggedIn,WalletController.edit);
router.post("/selectwallet" , authMiddleware.isLoggedIn,WalletController.selectwallet);
router.post("/delete" , authMiddleware.isLoggedIn ,WalletController.delete);
router.post("/getwalletlist" , authMiddleware.isLoggedIn ,WalletController.allWalletList);
router.post("/getownerwalletlist" , authMiddleware.isLoggedIn ,WalletController.ownerWalletList);
router.post("/changestatusaction" , authMiddleware.isLoggedIn,WalletController.statusActionFunc);

// router.post("/newfiat", authMiddleware.isLoggedIn,FiatControllers.newFiat);
// router.post("/fiatlist", authMiddleware.isLoggedIn,FiatControllers.getFiatList);

// router.post("/userfiatlist", authMiddleware.isLoggedIn,FiatControllers.getUserFiatList);
// router.post("/getfiat", authMiddleware.isLoggedIn,FiatControllers.getFiat);
// router.post("/delete", authMiddleware.isLoggedIn,FiatControllers.deleteFiat);
// router.post("/edit", authMiddleware.isLoggedIn, FiatControllers.editFiat);
module.exports = router;
