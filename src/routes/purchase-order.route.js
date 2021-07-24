var router = require("express").Router();

const purchaseOrderController = require("../controllers/purchase-order.controller");

router.get("/datatable", purchaseOrderController.findDatatable);
router.get("/findLastEntry", purchaseOrderController.findLastEntry);
router.post("/", purchaseOrderController.create);
router.put("/:id", purchaseOrderController.update);
router.delete("/:id", purchaseOrderController.delete);
router.get("/:id", purchaseOrderController.findOne);
router.get("/", purchaseOrderController.findAll);

//router.put("/save/:id", purchaseOrderController.save);
//router.put("/submit/:id", purchaseOrderController.submit);
//router.put("/cancel/:id", purchaseOrderController.cancel);

module.exports = router;









