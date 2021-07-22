var router = require("express").Router();

const userController = require("../controllers/user.controller");

const multer = require('multer');
const path = require('path');
const helpers = require('../helpers/imageHelpers'); 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null, 
      path.join(__dirname, '../../public/uploads/')
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
  }).single("profile_pic");

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

router.get("/datatable", userController.findDatatable);
router.post("/", uploadImage, userController.create);
//router.post("/", userController.create);
router.put("/:id", uploadImage, userController.update);
router.delete("/:id", userController.delete);
router.get("/:id", userController.findOne);
router.get("/", userController.findAll);

module.exports = router;









