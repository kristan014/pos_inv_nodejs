var router = require("express").Router();

const loyaltyCardSetupController = require("../controllers/loyalty-card-setup.controller");

router.get("/datatable", loyaltyCardSetupController.findDatatable);
router.post("/", loyaltyCardSetupController.create);
router.put("/:id", loyaltyCardSetupController.update);
router.delete("/:id", loyaltyCardSetupController.delete);
router.get("/:id", loyaltyCardSetupController.findOne);
router.get("/", loyaltyCardSetupController.findAll);

module.exports = router;









