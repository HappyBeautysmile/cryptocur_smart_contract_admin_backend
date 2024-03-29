const router = require("express").Router();
const authMiddleware = require("../../config/middleware/authMiddleware");
// const UserControllers =require("../../controller/userController");
// const CurrencyControllers =require("../../controller/currencyController");
// const multer = require('multer');
// const config = require('../../db');
// const Basecontroll = require("../../controller/indexcontroller")
// /api/users/login
// route to login the user
const settingController =require("../../controller/settingController");
// authMiddleware.isLoggedIn,
router.post("/edit", authMiddleware.isLoggedIn,settingController.bankAccountChange);
router.post("/get", settingController.getBankAccount);
router.post("/getsiteinformation",settingController.getsiteInformation);
router.post("/editFeePercent",settingController.editFeePercent);

// router.post("/newfiat", authMiddleware.isLoggedIn,FiatControllers.newFiat);
// router.post("/edit", authMiddleware.isLoggedIn, FiatControllers.editFiat);
module.exports = router;
