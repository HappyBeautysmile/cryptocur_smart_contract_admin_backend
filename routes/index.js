const router = require("express").Router();
const userRoutes = require("./api/userRoutes");
const currencyRoutes = require("./api/currencyRoutes");
const fiatRoutes = require("./api/fiatRoutes");


router.use("/users", userRoutes);
router.use("/currencies", currencyRoutes);
router.use("/fiats", fiatRoutes);
module.exports = router;
