var router = require("express").Router();

const branchController = require("../controllers/branch.controller");

router.get("/datatable", branchController.findDatatable);
router.post("/", branchController.create);
router.put("/:id", branchController.update);
router.delete("/:id", branchController.delete);
router.get("/:id", branchController.findOne);
router.get("/", branchController.findAll);

module.exports = router;









