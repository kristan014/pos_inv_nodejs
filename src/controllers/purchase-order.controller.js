const db = require("../models");
const { Op } = require('sequelize');
const PurchaseOrder = db.PurchaseOrder;
const PoItem = db.PoItem;
const Branch = db.Branch;
const Supplier = db.Supplier;
const Stock = db.Stock;
const Batch = db.Batch;
const datatable = require("sequelize-datatables");

exports.findDatatable = async (req, res) => {
    // just a demo
    req.body = {
        draw: "1",
        columns: [
          {
            data: "Branch.branch_name",
            name: "Branch.branch_name",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },
          {
            data: "Supplier.company_name",
            name: "Supplier.company_name",
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

    await datatable(
        PurchaseOrder,
        req.body, 
        { 
            include: [
                { 
                    model: PoItem, 
                    as: 'po_item', 
                    //include: ['batch'] 
                },
                {
                    model: Branch, 
                    attributes: ["id", "branch_name"],
                },
                {
                    model: Supplier, 
                    attributes: ["id", "company_name"],
                }
            ] 
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
    if (req.body.date_ordered == "") req.body.date_ordered = null;
    if (req.body.date_expected == "") req.body.date_expected = null;
    
    req.body.created_by = req.user.id;

    await PurchaseOrder.create( // U
        req.body,
        { include: ['po_item'] },
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
    await PurchaseOrder.findAll(
        { 
            include: [{ 
                model:PoItem, 
                as: 'po_item' 
                //include: ['batch'] 
            }] 
        }
    ).then((result) => {
        res.send({
            error: false,
            result: result,
            mesage: [process.env.SUCCESS_RETRIEVE],  
        });
    }).catch((err) => {
        res.status(500).send({
            error: true,
            result: [],
            mesage: err.errors || [process.env.GENERAL_ERROR_MSG],  
        });
    });
 };

exports.findOne = async (req, res) => {
    const id = req.params.id;
    
    await PurchaseOrder.findByPk(
        id, // C
        { 
            include: [{ 
                model:PoItem, 
                as: 'po_item',
                exclude: ['status'],
                include: [{
                    model:Batch, 
                    as: 'batch',
                    attributes: ['id','stock','barcode','sell_by_date','best_before_date']
                }] 
            }]
        }
    ).then((data) => {
        if (data) { console.log(data);
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

    if (req.body.date_ordered == "") req.body.date_ordered = null;
    if (req.body.date_expected == "") req.body.date_expected = null;
    if (req.body.date_shipped == "") req.body.date_shipped = null;
    if (req.body.date_received == "") req.body.date_received = null;
    
    req.body.updated_by = req.user.id;
    
    const oldPoItems = req.body.oldPoItems;
    if (oldPoItems != undefined) {
        delete req.body.oldPoItems;
        deleteOldPoItems(oldPoItems, id, res);
    }

    const stock = req.body.stock;
    if (stock != undefined) {
        delete req.body.stock;
        addToStock(stock, req.user.id, res);
    }

    const newPoItems = req.body.po_item;
    delete req.body.po_item;

    // BEGIN: PurchaseOrder.update
    await PurchaseOrder.update(
        req.body, 
        { where: { id: id } }
    ).then((result) => {
        
        // BEGIN: if updated
        if (result[0]) {
                  
            // BEGIN: newPoItems 
            if (newPoItems != undefined) {

                // BEGIN: newPoItems.forEach
                const len = newPoItems.length;
                newPoItems.forEach(function(item, i) {
                    
                    // BEGIN: PoItem.findOrCreate
                    item.purchase_order = id;
                    PoItem.findOrCreate({
                        where: { 
                            branch: item.branch,
                            product: item.product
                        },
                        defaults: item
                    }).then((result) => {

                        // BEGIN: PoItem.update
                        PoItem.update(
                            item, 
                            { where: { id: item.id } }
                        ).then((result) => {
                            if (result && (len == i + 1)) {
                                res.send({
                                    success: true,
                                    message: [process.env.SUCCESS_UPDATE],
                                });
                            }else if(!result){
                                res.status(500).send({
                                    success: false,
                                    message: [process.env.UPDATE_ERROR],  
                                });
                            }
                        }).catch((err) => {
                            res.status(500).send({
                                success: false,
                                message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG], 
                            });
                        }); // END: PoItem.update

                        
                    }).catch((err) => {
                        res.status(500).send({
                            success: false,
                            message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG], 
                        });
                    }); // END: PoItem.findOrCreate
                }); // END: newPoItems.forEach
            }else{
                res.send({
                    success: true,
                    message: [process.env.SUCCESS_UPDATE],
                });
            } // END: newPoItems
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
    }); // END: PurchaseOrder.update
};

const deleteOldPoItems =  (oldPoItems, id, res) => {
     oldPoItems.forEach(function(item) {
        PoItem.destroy({
            where: { 
                purchase_order: id,
                product: item 
            }
        }).then((result) => { 
            if(!result){
                res.status(500).send({
                    success: false,
                    message: [process.env.UPDATE_ERROR],  
                });
            }
        }).catch((err) => { 
            res.status(500).send({
                success: false,
                message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG], 
            });
        }); 
    });
};

const addToStock =  (stock, user, res) => {
     stock.forEach(function(item) {
        
        // BEGIN: Stock.findOrCreate 
        item.created_by = user;
        Stock.findOrCreate({
            where: { 
                branch: item.branch,
                product: item.product
            },
            defaults: item
        }).then((result) => {
            
            // BEGIN: if found
            if(!result[1]) { 
                const prevQty = result[0].dataValues.qty; 

                // BEGIN: if updatable
                console.log(typeof item.qty)
                if (item.qty != prevQty) {
                    item.qty = prevQty + item.qty;
                   
                    // BEGIN: Stock.update
                    delete item.created_by;
                    item.updated_by = user;
                    Stock.update(
                        item, 
                        { where: { id: item.id } }
                    ).then((result) => {
                        if(!result){
                            res.status(500).send({
                                success: false,
                                message: [process.env.UPDATE_ERROR],  
                            });
                        }
                    }).catch((err) => {
                        res.status(500).send({
                            success: false,
                            message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG], 
                        });
                    }); // END: Stock.update
                } // END: if updatable
            }// END: if found
        }).catch((err) => {
            res.status(500).send({
                success: false,
                message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG], 
            });
        }); // END: Stock.findOrCreate  
    });
};

exports.delete = async (req, res) => {
    let id = req.params.id;

    const status = id.slice(id.lastIndexOf('-') + 1);
  
    id = id.replace('-'+status, '');
    
    // BEGIN: PurchaseOrder.update
    await PurchaseOrder.update(
        {
            status: status,
            updated_by: req.user.id
        },
        { where: { id: id } }
    ).then((result) => {

        // BEGIN: if updated
        if (result[0]) {

            // BEGIN: PoItem.update
            PoItem.update(
                { status: "Inactive" }, 
                { where: { purchase_order: id } }
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
            }); // END: PoItem.update
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
    }); // END: PurchaseOrder.update
};

exports.findLastEntry = async (req, res) => {
    await PurchaseOrder.findOne({
        where: { created_at: { [Op.not]: null } },
        order: [['created_at', 'DESC']],
        attributes: ["purchase_order_no"] 
    }).then((data) => {
        if (data) {
            res.send({
                success: true,
                data: (data.purchase_order_no + 1),
                message: [process.env.SUCCESS_RETRIEVE],
            });
        }else{
            res.send({
                success: true,
                data: 1,
                message: [process.env.SUCCESS_RETRIEVE],
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

