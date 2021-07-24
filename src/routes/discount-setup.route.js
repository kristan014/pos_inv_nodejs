var router = require("express").Router();

const discountSetupController = require("../controllers/discount-setup.controller");

router.get("/datatable", discountSetupController.findDatatable);
router.post("/", discountSetupController.create);
router.put("/:id", discountSetupController.update);
router.delete("/:id", discountSetupController.delete);
router.get("/:id", discountSetupController.findOne);
router.get("/", discountSetupController.findAll);

module.exports = router;









