const db = require("../models");
const { Op } = require('sequelize');
const Product = db.Product;
const Category = db.Category;
const SupplierProduct = db.SupplierProduct;
const datatable = require("sequelize-datatables");

exports.findDatatable = async (req, res) => {
    // just a demo
    req.body = {
        draw: "1",
        columns: [
          {
            data: "product_name",
            name: "product_name",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },
          {
            data: "Category.title",
            name: "Category.title",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },
          {
            data: "critical_level",
            name: "critical_level",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },
        ],
        order: [
          {
            column: "0",
            dir: "asc",
          },
        ],
        start: "0",
        search: {
          value: "",
          regex: "false",
        },
        _: "1478912938246",
    }; 

    await datatable( // U
        Product,
        req.body,
        {   
            include: [{
                model: Category,
                attributes: ["title", "status"]
            }]  
        }
    ).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.status(500).send({
            success: false,
            data: [],
            message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],
        });
    });
};

exports.create = async (req, res) => {
    req.body.product_pic = req.file != undefined ? req.file.filename : "";

    req.body.created_by = req.user.id;
    
    await Product.findOne({
        where: { created_at: { [Op.not]: null } },
        order: [['created_at', 'DESC']],
        attributes: ["product_code"] 
    }).then((data) => {
        req.body.product_code = (data ? (data.product_code + 1) : 1);

        Product.create( // U
            req.body
        ).then((ignored) => {   
            res.send({
                success: true,
                message: [process.env.SUCCESS_CREATE],
            });
        }).catch((err) => {
            res.status(500).send({
                success: false,
                message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],
            });
        });
    }).catch((err) => { 
        res.status(500).send({
            success: false,
            data: [],
            message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],
        });
    });
 };

exports.findAll = async (req, res) => {
    await Product.findAll({ 
        where: { status: 'Active'},
        attributes: ["id", "product_name"] // U
    }).then((data) => {
        res.send({
            success: true,
            data: data,
            message: [process.env.SUCCESS_RETRIEVE],
        });
    }).catch((err) => {
        res.status(500).send({
            success: false,
            data: [],
            message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],
        });
    });
 };

exports.findOne = async (req, res) => {
    const id = req.params.id;

    await Product.findByPk(
        id // C
    ).then((data) => {
        if (data) {
            res.send({
                success: true,
                data: data,
                message: [process.env.SUCCESS_RETRIEVE],
            });
        }else{
            res.status(500).send({
                success: false,
                data: [],
                message: [process.env.RETRIEVE_ERROR],
            });
        }     
    }).catch((err) => {
        res.status(500).send({
            success: false,
            data: [],
            message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],  
        });
    }); 
 };
 
exports.update = async (req, res) => {
    const id = req.params.id;

    if (req.file != undefined) {
        req.body.product_pic = req.file.filename;
    }
    
    req.body.updated_by = req.user.id;
    
    // BEGIN: Product.update
    await Product.update(
        req.body, 
        { where: { id: id } }
    ).then((result) => {

        // BEGIN: if updated
        if (result[0]) {

            // BEGIN: SupplierProduct.update
            SupplierProduct.update(
                {
                    status: (req.body.status === "Active" ? "Active" : "Inactive"),
                    updated_by: req.user.id
                }, 
                { where: { product_type: id } }
            ).then((ignored) => {
                res.send({
                    success: true,
                    message: [process.env.SUCCESS_UPDATE],
                });
            }).catch((err) => {
                res.status(500).send({
                    success: false,
                    message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],  
                });
            }); // END: SupplierProduct.update
        }else{
            res.status(500).send({
                success: false,
                message: [process.env.UPDATE_ERROR],  
            });
        } // END: if updated
    }).catch((err) => {
        res.status(500).send({
            success: false,
            message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],  
        });
    }); // END: Product.update
};

exports.delete = async (req, res) => {
    const id = req.params.id;

   // BEGIN: Product.update
    await Product.update(
        {
            status: "Inactive",
            updated_by: req.user.id
        }, 
        { where: { id: id } }
    ).then((result) => {

        // BEGIN: if updated
        if (result[0]) {

            // BEGIN: SupplierProduct.update
            SupplierProduct.update(
                {
                    status: "Inactive",
                    updated_by: req.user.id
                }, 
                { where: { product_type: id } }
            ).then((ignored) => {   
                res.send({
                    success: true,
                    message: [process.env.SUCCESS_DEACTIVATION],
                });
            }).catch((err) => {
                res.status(500).send({
                    success: false,
                    message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],  
                });
            }); // END: SupplierProduct.update
        }else{
            res.status(500).send({
                success: false,
                message: [process.env.DEACTIVATION_ERROR],  
            });
        } // END: if updated
    }).catch((err) => {
        res.status(500).send({
            success: false,
            message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],  
        });
    }); // END: Product.update
};



