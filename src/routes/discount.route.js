var router = require("express").Router();

const discountController = require("../controllers/discount.controller");

router.get("/datatable", discountController.findDatatable);
router.post("/", discountController.create);
router.put("/:id", discountController.update);
router.delete("/:id", discountController.delete);
router.get("/:id", discountController.findOne);
router.get("/", discountController.findAll);

module.exports = router;









