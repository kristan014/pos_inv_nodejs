var router = require("express").Router();

const productController = require("../controllers/product.controller");
const multer = require('multer');
const path = require('path');
const helpers = require('../helpers/imageHelpers'); 


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null, 
      path.join(__dirname, '../../public/uploads/products')
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

router.get("/datatable", productController.findDatatable);
//router.get("/findLastEntry", productController.findLastEntry);
router.post("/", uploadImage, productController.create);
//router.post("/", productController.create);
router.put("/:id", uploadImage, productController.update);
router.delete("/:id", productController.delete);
router.get("/:id", productController.findOne);
router.get("/", productController.findAll);

module.exports = router;











