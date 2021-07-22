const db = require("../models");
const SaleReceipt = db.SaleReceipt;
const SrItem = db.SrItem;
const bcrypt = require("bcrypt");
const datatable = require("sequelize-datatables");

exports.findDatatable = async (req, res) => {
    // just a demo
    req.body = {
        draw: "1",
        columns: [
            {
                data: "id",
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
        SaleReceipt,
        req.body, 
        {
            include: ["created","sr_item"]
        }
    ).then((result) => {
        res.json(result);
    }).catch((err) => {
        res.status(500).send({
            error: true,
            data: [],
            message: err.errors.map((e) => e.message) || [process.env.SERVER_ERROR],
        });
    });
};

const randomNumbers = async function() {
    var digits = "", i = 0;
    for(; i < 10; i++) {
        digits +=  String(Math.floor(Math.random() * 10));
    }
    return digits;
};

exports.create = async (req, res) => {
    var isRandom = false;
    while(!isRandom) {
        req.body.transaction_no = await randomNumbers();

        await SaleReceipt.findByPk(req.body.transaction_no)
            .then((result) => {
                if(!result) { isRandom = true; }
            }).catch((err) => {
                isRandom = true;
                res.send({
                    error: true,
                    data: [],
                    mesage: err.errors.map((e) => e.message) || [process.env.SERVER_ERROR],
                });
            }); 
    }

    req.body.created_by = req.user.id;

    req.body.sr_item.forEach(item => {
        item.created_by = req.user.id;
    });

    await SaleReceipt.create(
        req.body, 
        { include: ['sr_item'] }
    ).then((data) => {
        SaleReceipt.findByPk(
            data.id,
            { include: ["created", 'sr_item'] }
        ).then((result) => {
            res.send({
                error: false,
                data: result,
                message: [process.env.SUCCESS_CREATE],
            });
        }).catch((err) => {
            res.send({
                error: true,
                data: [],
                mesage: err.errors.map((e) => e.message) || [process.env.SERVER_ERROR],
            });
        }); 
    }).catch((err) => {
        res.status(500).send({
            error: true,
            data: [],
            message: err.errors.map((e) => e.message) || [process.env.GENERAL_ERROR_MSG],
        });
    });
 };

exports.findAll = async (req, res) => {
    await SaleReceipt.findAll(
        { include: ["created", 'sr_item'] }
    ).then((data) => {
        res.send({
            error: false,
            data: data,
            message: [process.env.SUCCESS_RETRIEVE],
        });
    }).catch((err) => {
        res.status(500).send({
            error: true,
            data: [],
            message: err.errors.map((e) => e.message) || [process.env.GENERAL_ERROR_MSG],
        });
    });
 };

exports.findOne = async (req, res) => {
    const id = req.params.id;
    await SaleReceipt.findByPk(
        id,
        { include: ["created", 'sr_item'] }
    ).then((data) => {
        res.send({
            error: false,
            data: data,
            message: [process.env.SUCCESS_RETRIEVE],
        });
    }).catch((err) => {
        res.status(500).send({
            error: true,
            data: [],
            mesage: err.errors.map((e) => e.message) || [process.env.GENERAL_ERROR_MSG],  
        });
    }); 
    // User.findOne({ where: { id: id} }). 
 };
 
exports.update = async (req, res) => {
    const id = req.params.id;

    req.body.updated_by = req.user.id;

    req.body.sr_item.forEach(item => {
        item.updated_by = req.user.id;
    });

    await SaleReceipt.update(
        req.body, 
        {
            where: {
                id: id,
            },
        }
    ).then((result) => {
        if(result[0]) {
            SrItem.update(
                req.body.sr_item[0], 
                {
                    where: {
                        sale_receipt: id,
                    },
                }
            ).then((result) => {
                if (result[0]) {
                    SaleReceipt.findByPk(
                        id,
                        { include: ["updated", 'sr_item'] }
                    ).then((data) => {
                        res.send({
                            error: false,
                            data: data,
                            message: [process.env.SUCCESS_UPDATE],
                        });
                    }).catch((err) => {
                        res.status(500).send({
                            error: true,
                            data: [],
                            mesage: err.errors.map((e) => e.message) || [process.env.SERVER_ERROR],  
                        });
                    });
                }else{
                    res.status(500).send({
                        error: true,
                        data: [],
                        mesage: [process.env.UPDATE_ERROR],  
                    });
                }
            }).catch((err) => {
                res.status(500).send({
                    error: true,
                    data: [],
                    mesage: err.errors.map((e) => e.message) || [process.env.SERVER_ERROR],  
                });
            });
        }else{
            res.status(500).send({
                error: true,
                data: [],
                mesage: [process.env.UPDATE_ERROR],  
            });
        }
    }).catch((err) => {
        res.status(500).send({
            error: true,
            data: [],
            mesage: err.errors.map((e) => e.message) || [process.env.SERVER_ERROR],  
        });
    });
};

exports.delete = async (req, res) => {
    const id = req.params.id;

    req.body.updated_by = req.user.id;

    req.body.sr_item.forEach(item => {
        item.updated_by = req.user.id;
    });
    
    /*const body = { 
        "status": "inactive",
        "po_item":
    };*/

    await SaleReceipt.update(
        req.body, 
        {
            where: {
                id: id,
            },
        }
    ).then((result) => {
        if(result[0]) {
            SrItem.update(
                req.body.sr_item[0], 
                {
                    where: {
                        sale_receipt: id,
                    },
                }
            ).then((result) => {
                if (result[0]) {
                    SaleReceipt.findByPk(
                        id,
                        { include: ["updated", 'sr_item'] }
                    ).then((data) => {
                        res.send({
                            error: false,
                            data: data,
                            message: [process.env.SUCCESS_DELETE],
                        });
                    }).catch((err) => {
                        res.status(500).send({
                            error: true,
                            data: [],
                            mesage: err.errors.map((e) => e.message) || [process.env.SERVER_ERROR],  
                        });
                    });
                }else{
                    res.status(500).send({
                        error: true,
                        data: [],
                        mesage: [process.env.DELETE_ERROR],  
                    });
                }
            }).catch((err) => {
                res.status(500).send({
                    error: true,
                    data: [],
                    mesage: err.errors.map((e) => e.message) || [process.env.SERVER_ERROR],  
                });
            });
        }else{
            res.status(500).send({
                error: true,
                data: [],
                mesage: [process.env.DELETE_ERROR],  
            });
        }
    }).catch((err) => {
        res.status(500).send({
            error: true,
            data: [],
            mesage: err.errors.map((e) => e.message) || [process.env.SERVER_ERROR],  
        });
    });
};
