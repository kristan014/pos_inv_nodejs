const db = require("../models");
const { Op } = require('sequelize');
const Discount = db.Discount;
//const bcrypt = require("bcrypt");
const datatable = require("sequelize-datatables");

exports.findDatatable = async (req, res) => {
    // just a demo
    req.body = {
        draw: "1",
        columns: [
            {
                data: "discount_code",
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
        Discount,
        req.body, 
        { include: ["setup"] }
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
            req.body.discount_code = await randomNumbers();

            // BEGIN: Discount.findOrCreate
            await Discount.findOrCreate({
                where: { discount_code: req.body.discount_code },
                defaults: req.body
            }).then((result) => {

                // BEGIN: if created
                if(result[1] && (i+1 == occurence)) { 
                    isRandom = true;
                    
                    // BEGIN: Discount.findAll
                    Discount.findAll({ 
                        where: { created_at: { [Op.eq]: new Date() } },
                        include: ['setup'] 
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
                     });// END: Discount.findAll
                }else if (result[1]) { isRandom = true; } // END: if created
            }).catch((err) => {
                isRandom = true;
                i = occurence;
                res.status(500).send({
                    error: true,
                    result: [],
                    mesage: err.errors || [process.env.GENERAL_ERROR_MSG],
                });
            }); // END: Discount.findOrCreate
        }
        isRandom = false;
        i++;
    }
 };

exports.findAll = async (req, res) => {
    await Discount.findAll(
        { include: ['setup'] }
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
    
    await Discount.findByPk(
        id,
        { include: ['setup'] }
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
    
    // BEGIN: Discount.update
    await Discount.update(
        req.body, 
        { where: { id: id } }
    ).then((result) => {

        // BEGIN: if updated
        if (result[0]) {

            // BEGIN: Discount.findByPk
            Discount.findByPk(
                id,
                { include: ["setup","updated"] }
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
            }); // END: Discount.findByPk
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
    }); // END: Discount.update
};

exports.delete = async (req, res) => {
    const id = req.params.id;

    await Discount.destroy({
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
