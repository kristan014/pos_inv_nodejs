const db = require("../models");
const TransferredStocks = db.TransferredStocks;
const TsItem = db.TsItem;
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
        TransferredStocks,
        req.body, 
        {
            include: ["created","ts_item"]
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

exports.create = async (req, res) => {
    req.body.created_by = req.user.id;

    req.body.ts_item.forEach(item => {
        item.created_by = req.user.id;
    });
    
    await TransferredStocks.create(
        req.body, 
        { include: ['ts_item'] }
    ).then((data) => {
        TransferredStocks.findByPk(
            data.id,
            { include: ["created", 'ts_item'] }
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
    await TransferredStocks.findAll(
        { include: ["created", 'ts_item'] }
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
    await TransferredStocks.findByPk(
        id,
        { include: ["created", 'ts_item'] }
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

    req.body.ts_item.forEach(item => {
        item.updated_by = req.user.id;
    });

    await TransferredStocks.update(
        req.body, 
        {
            where: {
                id: id,
            },
        }
    ).then((result) => {
        if(result[0]) {
            TsItem.update(
                req.body.ts_item[0], 
                {
                    where: {
                        transferred_stocks: id,
                    },
                }
            ).then((result) => {
                if (result[0]) {
                    TransferredStocks.findByPk(
                        id,
                        { include: ["updated", 'ts_item'] }
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

    req.body.ts_item.forEach(item => {
        item.updated_by = req.user.id;
    });
    
    /*const body = { 
        "status": "inactive",
        "po_item":
    };*/

    await TransferredStocks.update(
        req.body, 
        {
            where: {
                id: id,
            },
        }
    ).then((result) => {
        if(result[0]) {
            TsItem.update(
                req.body.ts_item[0], 
                {
                    where: {
                        transferred_stocks: id,
                    },
                }
            ).then((result) => {
                if (result[0]) {
                    TransferredStocks.findByPk(
                        id,
                        { include: ["updated", 'ts_item'] }
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
