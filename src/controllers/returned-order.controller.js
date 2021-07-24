const db = require("../models");
const ReturnedOrder = db.ReturnedOrder;
const RoItem = db.RoItem;
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
        ReturnedOrder,
        req.body, 
        {
            include: ["created","ro_item"]
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

    req.body.ro_item.forEach(item => {
        item.created_by = req.user.id;
    });

    req.body.full_name = ""; 
    
    await ReturnedOrder.create(
        req.body, 
        { include: ['ro_item'] }
    ).then((data) => {
        ReturnedOrder.findByPk(
            data.id,
            { include: ["created", 'ro_item'] }
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
    await ReturnedOrder.findAll(
        { include: ["created", 'ro_item'] }
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
    await ReturnedOrder.findByPk(
        id,
        { include: ["created", 'ro_item'] }
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

    req.body.ro_item.forEach(item => {
        item.updated_by = req.user.id;
    });

    //req.body.full_name = ""; 
    
    await ReturnedOrder.update(
        req.body, 
        {
            where: {
                id: id,
            },
        }
    ).then((result) => {
        if(result[0]) {
            RoItem.update(
                req.body.ro_item[0], 
                {
                    where: {
                        returned_order: id,
                    },
                }
            ).then((result) => {
                if (result[0]) {
                    ReturnedOrder.findByPk(
                        id,
                        { include: ["updated", 'ro_item'] }
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

    req.body.ro_item.forEach(item => {
        item.updated_by = req.user.id;
    });
    
    /*const body = { 
        "status": "inactive",
        "po_item":
    };*/

    await ReturnedOrder.update(
        req.body, 
        {
            where: {
                id: id,
            },
        }
    ).then((result) => {
        if(result[0]) {
            RoItem.update(
                req.body.ro_item[0], 
                {
                    where: {
                        returned_order: id,
                    },
                }
            ).then((result) => {
                if (result[0]) {
                    ReturnedOrder.findByPk(
                        id,
                        { include: ["updated", 'ro_item'] }
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
