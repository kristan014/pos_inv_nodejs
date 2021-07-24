const db = require("../models");
const LoyaltyCardSetup = db.LoyaltyCardSetup;
const LoyaltyCard = db.LoyaltyCard;
const datatable = require("sequelize-datatables");

exports.findDatatable = async (req, res) => {
    // just a demo
    req.body = {
        draw: "1",
        columns: [
          {
            data: "title",
            name: "title",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },
          {
            data: "description",
            name: "description",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },
          {
            data: "qty",
            name: "qty",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },
          {
            data: "pts_per_qty",
            name: "pts_per_qty",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },
          {
            data: "amount",
            name: "amount",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },
          {
            data: "pts_per_amount",
            name: "pts_per_amount",
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
        LoyaltyCardSetup,
        req.body
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
    req.body.created_by = req.user.id;
  
    await LoyaltyCardSetup.create( // U
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
    await LoyaltyCardSetup.findAll({  // U
        where: { status: 'Active'},
        attributes: ["id", "title"],  
        include: [{  
            model: LoyaltyCard,
            as: 'loyalty_card',
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

    await LoyaltyCardSetup.findByPk( // U
        id,
        { include: ["loyalty_card"] }
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

    req.body.updated_by = req.user.id;
    
    // BEGIN: LoyaltyCardSetup.update
    await LoyaltyCardSetup.update(
        req.body, 
        { where: { id: id } }
    ).then((result) => {

        // BEGIN: if updated
        if (result[0]) {

            // BEGIN: LoyaltyCard.update
            LoyaltyCard.update(
                {
                    status: (req.body.status === "Active" ? "Active" : "Inactive"),
                    updated_by: req.user.id
                }, 
                { where: { lc_setup: id } }
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
            }); // END: LoyaltyCard.update
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
    }); // END: LoyaltyCardSetup.update
};

exports.delete = async (req, res) => {
    const id = req.params.id;

    // BEGIN: LoyaltyCardSetup.update
    await LoyaltyCardSetup.update(
        {
            status: "Inactive",
            updated_by: req.user.id
        }, 
        { where: { id: id } }
    ).then((result) => {

        // BEGIN: if updated
        if (result[0]) {

            // BEGIN: LoyaltyCard.update
            LoyaltyCard.update(
                {
                    status: "Inactive",
                    updated_by: req.user.id
                }, 
                { where: { lc_setup: id } }
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
            }); // END: LoyaltyCard.update
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
    }); // END: LoyaltyCardSetup.update
};
