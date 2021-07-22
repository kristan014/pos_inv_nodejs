var router = require("express").Router();

const returnedProductsController = require("../controllers/returned-products.controller");

router.get("/datatable", returnedProductsController.findDatatable);
router.post("/", returnedProductsController.create);
router.put("/:id", returnedProductsController.update);
router.delete("/:id", returnedProductsController.delete);
router.get("/:id", returnedProductsController.findOne);
router.get("/", returnedProductsController.findAll);

module.exports = router;









