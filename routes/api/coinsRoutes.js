const router = require("express").Router();
const authMiddleware = require("../../config/middleware/authMiddleware");
const CoinControllers =require("../../controller/coinController");
const multer = require('multer');
const config = require('../../db');
const Basecontroll = require("../../controller/indexcontroller")
// /api/users/login
// route to login the user
// router.post("/adminsignin",UserControllers.adminsignin);


router.post("/add",CoinControllers.Add);
router.post("/delete",CoinControllers.Delete);
router.post("/coinlist" ,CoinControllers.getAllCoins );
router.post("/getCoin" ,CoinControllers.getCoin );
// router.post("/signup",UserControllers.signup);

// router.post("/get_userinfor",authMiddleware.isLoggedIn,UserControllers.getuser);
// router.post("/logout",authMiddleware.logoutUser);
// router.post("/userlist",authMiddleware.isLoggedIn,UserControllers.getAllUsers)
// router.post("/delete_user" ,authMiddleware.isLoggedIn ,UserControllers.deleteUser);
// router.post("/edit_user" ,authMiddleware.isLoggedIn,multer({dest:config.BASEURL}).any() ,Basecontroll.imageupload,UserControllers.editUser);
// router.post("/get_user" ,authMiddleware.isLoggedIn , UserControllers.getUser);
// router.post("/personal_update" ,authMiddleware.isLoggedIn , UserControllers.personalUdate);

module.exports = router;
