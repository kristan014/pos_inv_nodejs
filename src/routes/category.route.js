var router = require("express").Router();

const categoryController = require("../controllers/category.controller");

router.get("/datatable", categoryController.findDatatable);
router.post("/", categoryController.create);
router.put("/:id", categoryController.update);
router.delete("/:id", categoryController.delete);
router.get("/:id", categoryController.findOne);
router.get("/", categoryController.findAll);

module.exports = router;









