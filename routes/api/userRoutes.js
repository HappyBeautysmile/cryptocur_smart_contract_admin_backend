const router = require("express").Router();
const authMiddleware = require("../../config/middleware/authMiddleware");
const UserControllers =require("../../controller/userController")
// /api/users/login
// route to login the user
router.post("/signin",UserControllers.signin);
router.post("/signup",UserControllers.signup);

router.post("/get_userinfor",authMiddleware.isLoggedIn,UserControllers.getuser);
router.post("/logout",authMiddleware.logoutUser);
router.post("/userlist",authMiddleware.isLoggedIn,UserControllers.getAllUsers)
router.post("/delete_user" ,authMiddleware.isLoggedIn ,UserControllers.deleteUser);
router.post("/edit_user" ,authMiddleware.isLoggedIn ,UserControllers.editUser);
router.post("/get_user" ,authMiddleware.isLoggedIn , UserControllers.getUser);

// /api/users/signup
// route to logout the user

// /api/users/unauthorized
// route that gets hit if user is not logged in
// send error message back to front end
// router.get("/unauthorized", function(req, res, next) {

//   let message = req.flash("error")[0]
  
//   setTimeout(function() {
//     res.json({
//       message: message,
//       loggedIn: false
//     });
//   }, 100);
// });

// // /api/users/profile
// // if the user is logged in, this route sends the user information to the front end
// router.get("/profile", authMiddleware.isLoggedIn, function(req, res, next) {
//   res.json({
//     user: req.user,
//     loggedIn: true
//   });
// });

// // /api/users/logout
// // logs out the user
// router.get("/logout", authMiddleware.logoutUser, function(req, res, next) {
//   res.json("User logged out successfully");
// });

// // /api/users/admin
// // route to check if the logged in user is flagged as an administer
// router.get("/admin", authMiddleware.isAdmin, function(req, res, next) {
//   res.json({
//     user: req.user,
//     loggedIn: true
//   });
// });

// router.get("/user", authMiddleware.isLoggedIn, function(req, res, next) {
//   db.User.findByIdAndUpdate(req.user._id).populate('todos').then((user) => {
//     res.json(user);
//   }).catch((err) => {
//     res.json(err);
//   });
// });

module.exports = router;
