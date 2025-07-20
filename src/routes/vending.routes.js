const express = require("express");
const router = express.Router();
const vendingController = require("../controllers/vending.controller");
const { depositValidation, buyValidation } = require("../validations/vending.schema");
const authRole = require("../middlewares/authRole.middleware");

router.post(
  "/deposit",
  authRole({ roles: ["BUYER"] }),
  depositValidation,
  vendingController.deposit
);

router.post(
  "/buy",
  authRole({ roles: ["BUYER"] }),
  buyValidation,
  vendingController.buy
);

module.exports = router;
