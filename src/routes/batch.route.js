var router = require("express").Router();

const batchController = require("../controllers/batch.controller");

//router.get("/datatable", batchController.findDatatable);
//router.post("/", batchController.create);
//router.put("/:id", batchController.update);
//router.delete("/:id", batchController.delete);
router.get("/:candidateBarcode", batchController.findOne);
//router.get("/", batchController.findAll);

module.exports = router;









