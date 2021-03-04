const router = require("express").Router();
const userRoutes = require("./api/userRoutes");
const currencyRoutes = require("./api/currencyRoutes");

router.use("/users", userRoutes);
router.use("/currencies", currencyRoutes);

module.exports = router;
