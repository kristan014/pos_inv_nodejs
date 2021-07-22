var router = require("express").Router();

const roleController = require("../controllers/user-type.controller");

router.get("/:id", roleController.findOne);
router.get("/", roleController.findAll);

module.exports = router;
