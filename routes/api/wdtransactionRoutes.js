const router = require("express").Router();
const authMiddleware = require("../../config/middleware/authMiddleware");
// const UserControllers =require("../../controller/userController");
const WDTransactionController =require("../../controller/wdtransactionController");
// const multer = require('multer');
// const config = require('../../db');
// const Basecontroll = require("../../controller/indexcontroller")
// /api/users/login
// route to login the user
// router.post("/add",authMiddleware.isLoggedIn,CurrencyControllers.add);
router.post("/add",authMiddleware.isLoggedIn, WDTransactionController.add);
router.post("/allwdtransactions", authMiddleware.isLoggedIn,WDTransactionController.getAllwdTransactions);
router.post("/allwdrequesttransactions", authMiddleware.isLoggedIn,WDTransactionController.getAllwdRequestTransactions);
router.post("/delete",authMiddleware.isLoggedIn, WDTransactionController.deletewdTransaction);
router.post("/edit",authMiddleware.isLoggedIn, WDTransactionController.editwdTransaction);

// router.post("/currencylist",authMiddleware.isLoggedIn,CurrencyControllers.getAllCurrencies);
// router.post("/delete",authMiddleware.isLoggedIn,CurrencyControllers.deleteCurrency);
// router.post("/edit",authMiddleware.isLoggedIn,CurrencyControllers.editCurrency);
// router.post("/get",authMiddleware.isLoggedIn,CurrencyControllers.getCurency);

module.exports = router;
 