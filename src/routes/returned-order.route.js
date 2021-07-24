var router = require("express").Router();

const returnedOrderController = require("../controllers/returned-order.controller");

router.get("/datatable", returnedOrderController.findDatatable);
router.post("/", returnedOrderController.create);
router.put("/:id", returnedOrderController.update);
router.delete("/:id", returnedOrderController.delete);
router.get("/:id", returnedOrderController.findOne);
router.get("/", returnedOrderController.findAll);

module.exports = router;









