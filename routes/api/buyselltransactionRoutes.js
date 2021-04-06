const router = require("express").Router();
const authMiddleware = require("../../config/middleware/authMiddleware");
// const UserControllers =require("../../controller/userController");
const buyselltransactionController =require("../../controller/buyselltransactionController");
// const multer = require('multer');
// const config = require('../../db');
// const Basecontroll = require("../../controller/indexcontroller")
// /api/users/login
// route to login the user
// router.post("/add",authMiddleware.isLoggedIn,CurrencyControllers.add);
router.post("/add", buyselltransactionController.add);
router.post("/allbuyselltransactions", buyselltransactionController.getAllbuysellTransactions);
router.post("/onwerbuyselltransactions", buyselltransactionController.getOwnerbuysellTransactions);
router.post("/allbuysellrequesttransactions", buyselltransactionController.getAllbuySellRequestTransactions);

router.post("/delete" , buyselltransactionController.deletebuysellTransaction);
router.post("/edit" , buyselltransactionController.editbuysellTransaction);
router.post("/reject" , buyselltransactionController.rejectbuysellTransaction);

 

module.exports = router;
 