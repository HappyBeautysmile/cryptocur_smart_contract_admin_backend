const router = require("express").Router();
const userRoutes = require("./api/userRoutes");
const currencyRoutes = require("./api/currencyRoutes");
const fiatRoutes = require("./api/fiatRoutes");
const wdtransactionRoutes = require("./api/wdtransactionRoutes");
const settingRoutes = require("./api/settingRoutes");
const walletRoutes = require("./api/walletRoutes");


router.use("/users", userRoutes);
router.use("/currencies", currencyRoutes);
router.use("/fiats", fiatRoutes);
router.use("/wdtransactions", wdtransactionRoutes);
router.use("/settings", settingRoutes);
router.use("/wallets", walletRoutes);
module.exports = router;
