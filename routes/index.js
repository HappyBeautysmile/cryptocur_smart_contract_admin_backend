const router = require("express").Router();
const userRoutes = require("./api/userRoutes");

router.use("/users", userRoutes);

module.exports = router;
