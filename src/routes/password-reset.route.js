var router = require("express").Router();

const passwordResetController = require("../controllers/password-reset.controller");

router.post("/", passwordResetController.passwordReset);

module.exports = router;