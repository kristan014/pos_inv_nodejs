const db = require("../models");
const LoyaltyCard = db.LoyaltyCard;
const User = db.User;
const LoyaltyCardLog = db.LoyaltyCardLog; // !
const datatable = require("sequelize-datatables");

exports.findDatatable = async (req, res) => {
    const id = req.params.id;

    // just a demo
    req.body = {
        draw: "1",
        columns: [
          {
            data: "loyalty_card_no",
            name: "loyalty_card_no",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },
          {
            data: "loyalty_points",
            name: "loyalty_points",
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
        LoyaltyCard,
        req.body,
        { 
            where: { lc_setup: id },
            include: [{
                model: User,
                attributes: ["id", "first_name"]
            }]  
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

const randomNumbers = () => {
    var i = 0, digits = "";
    for(; i < 8; i++) digits +=  String( Math.floor( Math.random() * 10 ) );
    return digits;
};

exports.create = async (req, res) => {
    req.body.created_by = req.user.id;
 
    var i = 0, isRandom = false; //currentDate = new Date();

    const counter = req.body.counter;
    delete req.body.counter;
    
    while (i < counter) {
        while(!isRandom) {
            req.body.loyalty_card_no = randomNumbers();

            // BEGIN: LoyaltyCard.findOrCreate
            await LoyaltyCard.findOrCreate({
                where: { loyalty_card_no: req.body.loyalty_card_no },
                defaults: req.body
            }).then((result) => {

                // BEGIN: if created
                if(result[1] && (i+1 == counter)) { 
                    isRandom = true;
                    res.send({
                        success: true,
                        message: [process.env.SUCCESS_CREATE],
                    });
                }else if (result[1]) { isRandom = true; } // END: if created
            }).catch((err) => {
                isRandom = true;
                i = counter;
                res.status(500).send({
                    success: false,
                    message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],
                });
            }); // END: LoyaltyCard.findOrCreate
        }
        isRandom = false;
        i++;
    }
};
 
exports.delete = async (req, res) => {
    let id = req.params.id;
    
    let status = id.slice(id.lastIndexOf('-') + 1);
    
    id = id.replace('-'+status, '');

    status = 
        status == "Active" 
        ? "Inactive" 
        : status == "Reserved" 
            ? "inactive"
            : status == "Inactive" 
                ? "Active"
                : "Reserved";

    // BEGIN: LoyaltyCard.update
    await LoyaltyCard.update(
        { 
            status: status,
            updated_by: req.user.id 
        }, 
        { where: { id: id } }
    ).then((result) => {

         // BEGIN: if updated
        if (result[0]) {
            res.send({
                success: true,
                message: ( (status == "Active" || status == "Reserved") ? [process.env.SUCCESS_ACTIVATION] : [process.env.SUCCESS_DEACTIVATION] ),
            });
        }else{
            res.status(500).send({
                success: false,
                message: ( (status == "Active" || status == "Reserved") ? [process.env.ACTIVATION_ERROR] : [process.env.DEACTIVATION_ERROR] ),
            });
        } // END: if updated
    }).catch((err) => {
        res.status(500).send({
            success: false,
            message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],  
        });
    }); // END: LoyaltyCard.update
};
