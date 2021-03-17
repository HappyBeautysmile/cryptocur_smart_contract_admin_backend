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

router.post("/add",WalletController.add);
router.post("/edit",WalletController.edit);
router.post("/selectwallet",WalletController.selectwallet);
router.post("/delete",WalletController.delete);
router.post("/getwalletlist",WalletController.allWalletList);
router.post("/getownerwalletlist",WalletController.ownerWalletList);
router.post("/changestatusaction",WalletController.statusActionFunc);

// router.post("/newfiat", authMiddleware.isLoggedIn,FiatControllers.newFiat);
// router.post("/fiatlist", authMiddleware.isLoggedIn,FiatControllers.getFiatList);

// router.post("/userfiatlist", authMiddleware.isLoggedIn,FiatControllers.getUserFiatList);
// router.post("/getfiat", authMiddleware.isLoggedIn,FiatControllers.getFiat);
// router.post("/delete", authMiddleware.isLoggedIn,FiatControllers.deleteFiat);
// router.post("/edit", authMiddleware.isLoggedIn, FiatControllers.editFiat);
module.exports = router;
