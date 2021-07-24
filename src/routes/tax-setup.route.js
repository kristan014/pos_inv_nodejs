var router = require("express").Router();

const taxSetupController = require("../controllers/tax-setup.controller");

router.get("/datatable", taxSetupController.findDatatable);
router.post("/", taxSetupController.create);
router.put("/:id", taxSetupController.update);
router.delete("/:id", taxSetupController.delete);
router.get("/:id", taxSetupController.findOne);
router.get("/", taxSetupController.findAll);

module.exports = router;









