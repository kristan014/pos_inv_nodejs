var router = require("express").Router();

const loyaltyCardController = require("../controllers/loyalty-card.controller");

router.get("/datatable", loyaltyCardController.findDatatable);
router.post("/", loyaltyCardController.create);
router.put("/:id", loyaltyCardController.update);
router.delete("/:id", loyaltyCardController.delete);
router.get("/:id", loyaltyCardController.findOne);
router.get("/", loyaltyCardController.findAll);

module.exports = router;









