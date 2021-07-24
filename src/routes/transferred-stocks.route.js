var router = require("express").Router();

const transferredStocksController = require("../controllers/transferred-stocks.controller");

router.get("/datatable", transferredStocksController.findDatatable);
router.post("/", transferredStocksController.create);
router.put("/:id", transferredStocksController.update);
router.delete("/:id", transferredStocksController.delete);
router.get("/:id", transferredStocksController.findOne);
router.get("/", transferredStocksController.findAll);

module.exports = router;









