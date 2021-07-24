var router = require("express").Router();

const loginController = require("../controllers/login.controller");

router.post("/", loginController.login);
router.post("/send-code", loginController.sendCode);

module.exports = router;