const db = require("../models");
const { Op } = require('sequelize');
const LoyaltyCard = db.LoyaltyCard;
const LoyaltyCardLog = db.LoyaltyCardLog;
//const bcrypt = require("bcrypt");
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
            data: "full_name",
            name: "full_name",
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
          {
            data: "unit_or_floor_no",
            name: "unit_or_floor_no",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },
          {
            data: "house_or_bldg_name",
            name: "house_or_bldg_name",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },
          {
            data: "street_no",
            name: "street_no",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },
          {
            data: "street_name",
            name: "street_name",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },
          {
            data: "barangay",
            name: "barangay",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },
          {
            data: "city",
            name: "city",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },
          {
            data: "zip_code",
            name: "zip_code",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },
          {
            data: "region",
            name: "region",
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
        length: "10",
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
    req.body.full_name = ""; 

    req.body.created_by = req.user.id;
  
    await Supplier.create( // U
        req.body
    ).then((ignored) => {   
        res.send({
            success: true,
            data: [],
            message: [process.env.SUCCESS_CREATE],
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
    await Supplier.findAll({  // U
        where: { status: 'Active'},
        attributes: ["id", "company_name"],  
        include: [{  
            model: SupplierProduct,
            as: 'supplier_product',
            //attributes: ["id", "access", "role", "status"],
        }]  
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

    req.body.full_name = ""; 
    
    req.body.updated_by = req.user.id;
    
    const supplierProductStatus = req.body.status === "Active" ? "Active" : "Inactive";
    
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
                    status: supplierProductStatus,
                    updated_by: req.user.id
                }, 
                { where: { supplier: id } }
            ).then((ignored) => {
                res.send({
                    success: true,
                    data: [],
                    message: [process.env.SUCCESS_UPDATE],
                });
            }).catch((err) => {
                res.status(500).send({
                    success: false,
                    data: [],
                    message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],  
                });
            }); // END: SupplierProduct.update
        }else{
            res.status(500).send({
                success: false,
                data: [],
                message: [process.env.UPDATE_ERROR],  
            });
        } // END: if updated
    }).catch((err) => {
        res.status(500).send({
            success: false,
            data: [],
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
                    data: [],
                    message: [process.env.SUCCESS_DEACTIVATION],
                });
            }).catch((err) => {
                res.status(500).send({
                    success: false,
                    data: [],
                    message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],  
                });
            }); // END: SupplierProduct.update
        }else{
            res.status(500).send({
                success: false,
                data: [],
                message: [process.env.DEACTIVATION_ERROR],  
            });
        } // END: if updated
    }).catch((err) => {
        res.status(500).send({
            success: false,
            data: [],
            message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],  
        });
    }); // END: Supplier.update
};



exports.findDatatable = async (req, res) => {
    // just a demo
    req.body = {
        draw: "1",
        columns: [
            {
                data: "loyalty_card_no",
                name: "",
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
        length: "1",
        search: {
            value: "",
            regex: "false",
        },
        _: "1478912938246",
    }; // end

    await datatable(
        LoyaltyCard,
        req.body, 
        { include: ["loyalty_card_setup"] } 
    ).then((result) => {
        res.json(result);
    }).catch((err) => {
        res.status(500).send({
            error: true,
            result: [],
            message: err.errors || [process.env.GENERAL_ERROR_MSG],
        });
    });
};

const randomNumbers = async function() {
    var i = 0, digits = "";
    for(; i < 8; i++) {
        digits +=  String(Math.floor(Math.random() * 10));
    }
    return digits;
};

exports.create = async (req, res) => {
    req.body.created_by = req.user.id;
    
    var i = 0, isRandom = false, currentDate = new Date();

    const occurence = req.body.occurence;
    delete req.body.occurence;
    
    while (i < occurence) {
        while(!isRandom) {
            req.body.loyalty_card_no = await randomNumbers();

            // BEGIN: LoyaltyCard.findOrCreate
            await LoyaltyCard.findOrCreate({
                where: { loyalty_card_no: req.body.loyalty_card_no },
                defaults: req.body
            }).then((result) => {

                // BEGIN: if created
                if(result[1] && (i+1 == occurence)) { 
                    isRandom = true;
                    
                    // BEGIN: LoyaltyCard.findAll
                    LoyaltyCard.findAll({ 
                        where: { created_at: { [Op.eq]: new Date() } },
                        include: ['loyalty_card_setup'] 
                    }).then((result) => {
                         res.send({
                             error: false,
                             result: result,
                             message: [process.env.SUCCESS_CREATE],
                         });
                     }).catch((err) => {
                         res.status(500).send({
                             error: true,
                             result: [],
                             message: err.errors || [process.env.GENERAL_ERROR_MSG],
                         });
                     });// END: LoyaltyCard.findAll
                }else if (result[1]) { isRandom = true; } // END: if created
            }).catch((err) => {
                isRandom = true;
                i = occurence;
                res.status(500).send({
                    error: true,
                    result: [],
                    mesage: err.errors || [process.env.GENERAL_ERROR_MSG],
                });
            }); // END: LoyaltyCard.findOrCreate
        }
        isRandom = false;
        i++;
    }
};

exports.findAll = async (req, res) => {
    await LoyaltyCard.findAll(
       { include: ['loyalty_card_setup'] }
    ).then((result) => {
        res.send({
            error: false,
            result: result,
            message: [process.env.SUCCESS_RETRIEVE],
        });
    }).catch((err) => {
        res.status(500).send({
            error: true,
            result: [],
            message: err.errors || [process.env.GENERAL_ERROR_MSG],
        });
    });
 };

exports.findOne = async (req, res) => {
    const id = req.params.id;
    
    await LoyaltyCard.findByPk(
        id,
        { include: ['loyalty_card_setup'] }
    ).then((result) => {
        if (result) {
            res.send({
                error: false,
                result: result,
                message: [process.env.SUCCESS_RETRIEVE],
            });
        }else{
            res.status(500).send({
                error: true,
                result: [],
                message: [process.env.RETRIEVE_ERROR],
            });
        }     
    }).catch((err) => {
        res.status(500).send({
            error: true,
            result: [],
            mesage: err.errors || [process.env.GENERAL_ERROR_MSG],  
        });
    }); 
 };
 
exports.update = async (req, res) => {
    const id = req.params.id;

    req.body.updated_by = req.user.id;

    req.body.loyalty_card_log.forEach(log => {
        log.updated_by = req.user.id;
    });
    
    // BEGIN: LoyaltyCard.update
    await LoyaltyCard.update(
        req.body, 
        { where: { id: id } }
    ).then((result) => {

        // BEGIN: if updated
        if (result[0]) {

            // BEGIN: LoyaltyCardLog.update
            LoyaltyCardLog.update(
                req.body.loyalty_card_log[0], 
                { where: { loyalty_card: id } }
            ).then((ignored) => {

                // BEGIN: LoyaltyCard.findByPk
                LoyaltyCard.findByPk(
                    id,
                    { include: ["loyalty_card_setup","updated"] }
                ).then((result) => {
                    res.send({
                        error: false,
                        result: result,
                        message: [process.env.SUCCESS_UPDATE],
                    });
                }).catch((err) => {
                    res.status(500).send({
                        error: true,
                        result: [],
                        mesage: err.errors || [process.env.GENERAL_ERROR_MSG],  
                    });
                }); // END: LoyaltyCard.findByPk
            }).catch((err) => {
                res.status(500).send({
                    error: true,
                    result: [],
                    mesage: err.errors || [process.env.GENERAL_ERROR_MSG],  
                });
            }); // END: LoyaltyCardLog.update
        }else{
            res.status(500).send({
                error: true,
                result: [],
                mesage: [process.env.UPDATE_ERROR],  
            });
        } // END: if updated
    }).catch((err) => {
        res.status(500).send({
            error: true,
            result: [],
            mesage: err.errors || [process.env.GENERAL_ERROR_MSG],  
        });
    }); // END: LoyaltyCard.update
};

exports.delete = async (req, res) => {
    const id = req.params.id;

    await LoyaltyCard.destroy({
        where: { id: id }
    }).then((result) => { 
        if (result) {
            res.send({
                error: false,
                result: result,
                mesage: [process.env.SUCCESS_DELETE],  
            });
        }else{
            res.status(500).send({
                error: true,
                result: [],
                mesage: [process.env.DELETE_ERROR],  
            });
        }
    }).catch((err) => { 
        res.status(500).send({
            error: true,
            result: [],
            mesage: err.errors || [process.env.GENERAL_ERROR_MSG],  
        });
    }); 
};
