const db = require("../models");
const { Op } = require('sequelize');
const SupplierProduct = db.SupplierProduct;
const PoItem = db.PoItem; // U
const Product = db.Product;
const Supplier = db.Supplier;
const datatable = require("sequelize-datatables");

exports.findDatatable = async (req, res) => {
    const id = req.params.id;
    
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
            data: "Product.product_name",
            name: "Product.product_name",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },
        /*
          {
            data: "price",
            name: "price",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },U*/
          {
            data: "unit",
            name: "unit",
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
        SupplierProduct,
        req.body,
        {   where: { supplier: id }, 
            include: [
                { 
                    model: Product,
                    attributes: ["id", "product_name", "status"],
                }
            ]  
        },
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
    
    req.body.with_tax = Boolean(req.body.with_tax);
    req.body.is_halal = Boolean(req.body.is_halal);
    req.body.is_packaged = Boolean(req.body.is_packaged);

    req.body.created_by = req.user.id;

    await SupplierProduct.create( // U
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
 };

exports.findAll = async (req, res) => {
    await SupplierProduct.findAll({ 
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

    await SupplierProduct.findByPk(
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
       
    req.body.with_tax = Boolean(req.body.with_tax);
    req.body.is_halal = Boolean(req.body.is_halal);
    req.body.is_packaged = Boolean(req.body.is_packaged);
    
    req.body.updated_by = req.user.id;
    
    // BEGIN: SupplierProduct.update
    await SupplierProduct.update(
        req.body, 
        { where: { id: id } }
    ).then((result) => {

        // BEGIN: if updated
        if (result[0]) {

           
                res.send({
                    success: true,
                    message: [process.env.SUCCESS_UPDATE],
                });
           
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
    }); // END: SupplierProduct.update
};

exports.delete = async (req, res) => {
    const id = req.params.id;

   // BEGIN: SupplierProduct.update
    await SupplierProduct.update(
        {
            status: "Inactive",
            updated_by: req.user.id
        }, 
        { where: { id: id } }
    ).then((result) => {

        // BEGIN: if updated
        if (result[0]) {

            
                res.send({
                    success: true,
                    message: [process.env.SUCCESS_DEACTIVATION],
                });
           
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
    }); // END: SupplierProduct.update
};

exports.findProductsBySupplier = async (req, res) => {
    const supplier = req.params.supplier;
    
    await SupplierProduct.findAll({ 
        where: { 
            status: 'Active',
            supplier: supplier
        },
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
