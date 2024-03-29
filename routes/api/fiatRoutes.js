const router = require("express").Router();
const authMiddleware = require("../../config/middleware/authMiddleware");
// const UserControllers =require("../../controller/userController");
// const CurrencyControllers =require("../../controller/currencyController");
// const multer = require('multer');
// const config = require('../../db');
// const Basecontroll = require("../../controller/indexcontroller")
// /api/users/login
// route to login the user
const FiatControllers =require("../../controller/fiatController");

router.post("/add", authMiddleware.isLoggedIn,FiatControllers.add);
router.post("/newfiat", authMiddleware.isLoggedIn,FiatControllers.newFiat);
router.post("/fiatlist", authMiddleware.isLoggedIn,FiatControllers.getFiatList);

router.post("/userfiatlist", authMiddleware.isLoggedIn,FiatControllers.getUserFiatList);
router.post("/getfiat", authMiddleware.isLoggedIn,FiatControllers.getFiat);
router.post("/delete", authMiddleware.isLoggedIn,FiatControllers.deleteFiat);
router.post("/edit", authMiddleware.isLoggedIn, FiatControllers.editFiat);
router.post("/selectfiat", authMiddleware.isLoggedIn, FiatControllers.selectfiat);

module.exports = router;
