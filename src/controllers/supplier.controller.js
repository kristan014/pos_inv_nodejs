const db = require("../models");
const Supplier = db.Supplier;
const SupplierProduct = db.SupplierProduct;
const datatable = require("sequelize-datatables");

exports.findDatatable = async (req, res) => {
    // just a demo
    req.body = {
        draw: "1",
        columns: [
          {
            data: "company_name",
            name: "company_name",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },
          {
            data: "contact_name",
            name: "contact_name",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },
          {
            data: "contact_no",
            name: "contact_no",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },
          {
            data: "email",
            name: "email",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },
          {
            data: "discount_rate",
            name: "discount_rate",
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
        Supplier,
        req.body,
        { include: ["supplier_product"] }
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
    req.body.contact_name = ""; 

    req.body.created_by = req.user.id;
  
    await Supplier.create( // U
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
    await Supplier.findAll({  // U
        where: { status: 'Active'},
        attributes: ["id", "company_name"],  
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

    await Supplier.findByPk( // U
        id,
        { include: ["supplier_product"] }
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

    req.body.contact_name = ""; 
    
    req.body.updated_by = req.user.id;
    
    // BEGIN: Supplier.update
    await Supplier.update(
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
                { where: { supplier: id } }
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
    }); // END: Supplier.update
};

exports.delete = async (req, res) => {
    const id = req.params.id;

    // BEGIN: Supplier.update
    await Supplier.update(
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
                { where: { supplier: id } }
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
    }); // END: Supplier.update
};
