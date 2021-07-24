var router = require("express").Router();

const subAccessController = require("../controllers/sub-access.controller");

router.get("/datatable/:id", subAccessController.findDatatable);
router.post("/", subAccessController.create);
router.put("/:id", subAccessController.update);
router.delete("/:id", subAccessController.delete);
router.get("/:id", subAccessController.findOne);
//router.get("/", subAccessController.findAll);

module.exports = router;









