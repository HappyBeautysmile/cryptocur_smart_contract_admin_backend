const router = require("express").Router();
const userRoutes = require("./api/userRoutes");
const currencyRoutes = require("./api/currencyRoutes");
const fiatRoutes = require("./api/fiatRoutes");
const wdtransactionRoutes = require("./api/wdtransactionRoutes");


router.use("/users", userRoutes);
router.use("/currencies", currencyRoutes);
router.use("/fiats", fiatRoutes);
router.use("/wdtransactions", wdtransactionRoutes);
module.exports = router;
