var router = require("express").Router();

const accessController = require("../controllers/access.controller");

router.get("/datatable", accessController.findDatatable);
router.post("/", accessController.create);
router.put("/:id", accessController.update);
router.delete("/:id", accessController.delete);
router.get("/:id", accessController.findOne);
router.get("/", accessController.findAll);

module.exports = router;









