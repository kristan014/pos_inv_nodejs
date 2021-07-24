var router = require("express").Router();

const saleReceiptController = require("../controllers/sale-receipt.controller");

router.get("/datatable", saleReceiptController.findDatatable);
router.post("/", saleReceiptController.create);
router.put("/:id", saleReceiptController.update);
router.delete("/:id", saleReceiptController.delete);
router.get("/:id", saleReceiptController.findOne);
router.get("/", saleReceiptController.findAll);

module.exports = router;









