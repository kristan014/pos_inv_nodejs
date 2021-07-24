var router = require("express").Router();

const supplierProductController = require("../controllers/supplier-product.controller");
const multer = require('multer');
const path = require('path');
const helpers = require('../helpers/imageHelpers'); 


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null, 
      path.join(__dirname, '../../public/uploads/supplier-products')
    );
  },
  filename: function (req, file, cb) {
    cb(
      null, 
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadImage = (req, res, next) => { 
  let upload = multer({
    storage: storage,
    fileFilter: helpers.imageFilter,
  }).single("product_pic");

  upload(req, res, function (err) {
    if (req.fileValidationError) {
      return res.status(500).send({
        success: false,
        data: [],
        message: [req.fileValidationError],
      });
    /*} else if (!req.file) {
      return res.status(500).send({
        success: false,
        data: [],
        message: ["Please select an image to upload"],
      });*/
    } else if(err instanceof multer.MulterError) {
      return res.status(500).send({
        success: false,
        data: [],
        message: [err],
      });
    } else if (err) {
      return res.status(500).send({
        success: false,
        data: [],
        message: [err],
      });
    }
    next();
  });
};  

router.get("/datatable/:id", supplierProductController.findDatatable);
//router.post("/", supplierProductController.create);
router.post("/", uploadImage, supplierProductController.create);
router.put("/:id", uploadImage, supplierProductController.update);
router.delete("/:id", supplierProductController.delete);
router.get("/:id", supplierProductController.findOne);
router.get("/", supplierProductController.findAll);
router.get("/findProductsBySupplier/:supplier", supplierProductController.findProductsBySupplier);

module.exports = router;









