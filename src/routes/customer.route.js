var router = require("express").Router();

const customerController = require("../controllers/customer.controller");

router.get("/datatable", customerController.findDatatable);
router.post("/", customerController.create);
router.put("/:id", customerController.update);
router.get("/:id", customerController.findOne);
router.get("/", customerController.findAll);
module.exports = router;









