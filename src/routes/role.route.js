var router = require("express").Router();

const roleController = require("../controllers/role.controller");

router.get("/datatable", roleController.findDatatable);
router.post("/", roleController.create);
router.put("/:id", roleController.update);
router.delete("/:id", roleController.delete);
router.get("/:id", roleController.findOne);
router.get("/", roleController.findAll);

module.exports = router;









