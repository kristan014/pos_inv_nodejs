var router = require("express").Router();

const supplierController = require("../controllers/supplier.controller");

router.get("/datatable", supplierController.findDatatable);
router.post("/", supplierController.create);
router.put("/:id", supplierController.update);
router.delete("/:id", supplierController.delete);
router.get("/:id", supplierController.findOne);
router.get("/", supplierController.findAll);

module.exports = router;









