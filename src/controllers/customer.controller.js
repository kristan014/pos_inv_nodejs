const db = require("../models");
const User = db.User;
const LoyaltyCard = db.LoyaltyCard; 
const Discount = db.Discount; // !
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const datatable = require("sequelize-datatables");

exports.findDatatable = async (req, res) => {
    // just a demo
    req.body = {
        draw: "1",
        columns: [
          {
            data: "first_name",
            name: "first_name",
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
        User,
        req.body, 
        {   
            include: [
                { // C
                    model: LoyaltyCard,
                    as: "loyalty_card",
                    attributes: ["loyalty_card_no", "loyalty_points", "status"],
                },
            ],
            attributes: ["first_name", "email", "birth_date", "status"],
            where: { contact_no: null },
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

const generateToken = (data) => {
    return jwt.sign(
        data, 
        process.env.TOKEN_SECRET, 
        { expiresIn: "7200s" }
    );
}

exports.create = async (req, res) => {
    req.body.password = await bcrypt.hash(
        req.body.password, 
        parseInt(process.env.SALT_ROUND),
    );
    
    req.body.last_name = req.body.first_name;

    req.body.full_name = ""; 

    const loyalty_card_no = req.body.loyalty_card_no;
    delete req.body.loyalty_card_no;
    
    // BEGIN: LoyaltyCard.findOne
    await LoyaltyCard.findOne({
        where: { 
            loyalty_card_no: loyalty_card_no, 
            status: "Reserved"
        },
    }).then((data) => {
        
         // BEGIN: if found
        if (data) {
            
            // BEGIN: User.create
            User.create(
                req.body,
            ).then((data) => {   
               
                 // BEGIN: LoyaltyCard.update
                LoyaltyCard.update(
                    { 
                        customer: data.id,
                        status: "Active" 
                    }, 
                    { where: { loyalty_card_no: loyalty_card_no } }
                ).then((result) => {
        
                    // BEGIN: if updated
                    if (result[0]) {
                        res.send({
                            success: true,
                            data: data,
                            token: generateToken({
                                id: data.id,
                                first_name: data.first_name,
                                email: data.email,
                            }),
                        });
                    }else{
                        res.status(500).send({
                            success: false,
                            message: ['Loyalty card no. does not exist.'],  
                        });
                    } // END: if updated
                }).catch((err) => {
                    res.status(500).send({
                        success: false,
                        message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],  
                    });
                }); // END: LoyaltyCard.update
            }).catch((err) => {
                res.status(500).send({
                    success: false,
                    message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],
                });
            }); // END: User.create
        }else{
            res.status(500).send({
                success: false,
                data: [],
                message: ['Loyalty card no. does not exist.'],  
            });
        }  // END: if found
    }).catch((err) => {
        res.status(500).send({
            success: false,
            data: [],
            message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],  
        });
    }); // END: LoyaltyCard.findOne
 };


exports.findOne = async (req, res) => {
    const id = req.params.id;
    
    await User.findByPk(
        id, // C
        {   
            include: [
                { // C
                    model: LoyaltyCard,
                    as: "loyalty_card",
                    attributes: ["loyalty_card_no", "status"],
                },
            ],
            attributes: ["first_name", "email", "birth_date"],
        }
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

    req.body.last_name = req.body.first_name;
    
    req.body.full_name = ""; 

    const loyalty_card_no = req.body.loyalty_card_no;
    if (loyalty_card_no != undefined) {
        let oldLoyaltyCardNo = req.body.oldLoyaltyCardNo;
        delete req.body.oldLoyaltyCardNo;
        delete req.body.loyalty_card_no;

        // BEGIN: LoyaltyCard.findOne
        await LoyaltyCard.findOne({
            where: { 
                loyalty_card_no: loyalty_card_no, 
                status: "Reserved"
            },
        }).then((data) => {
            
            // BEGIN: if found
            if (data) {
                
                // BEGIN: LoyaltyCard.update
                LoyaltyCard.update(
                    { 
                        customer: id,
                        status: "Active" 
                    }, 
                    { where: { loyalty_card_no: loyalty_card_no } }
                ).then((result) => {
        
                    // BEGIN: if updated
                    if (result[0]) {
                       
                        // BEGIN: LoyaltyCard.update
                        LoyaltyCard.update(
                            { status: "Inactive" }, 
                            { where: { loyalty_card_no: oldLoyaltyCardNo } }
                        ).then((result) => {
                
                            // BEGIN: if updated
                            if (result[0]) {
                                updateCustomerProfile(req.body, id, res)
                            }else{
                                res.status(500).send({
                                    success: false,
                                    message: [process.env.UPDATE_ERROR],  //['Loyalty card no. does not exist.'],    
                                });
                            } // END: if updated
                        }).catch((err) => {
                            res.status(500).send({
                                success: false,
                                message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],  
                            });
                        }); // END: LoyaltyCard.update
                    }else{
                        res.status(500).send({
                            success: false,
                            message: [process.env.UPDATE_ERROR],  //['Loyalty card no. does not exist.'],  
                        });
                    } // END: if updated
                }).catch((err) => {
                    res.status(500).send({
                        success: false,
                        message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],  
                    });
                }); // END: LoyaltyCard.update
            }else{
                res.status(500).send({
                    success: false,
                    data: [],
                    message: ['Loyalty card no. does not exist.'],  
                });
            }  // END: if found
        }).catch((err) => {
            res.status(500).send({
                success: false,
                data: [],
                message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],  
            });
        }); // END: LoyaltyCard.findOne
    }else{
        updateCustomerProfile(req.body, id, res)
    }
};

const updateCustomerProfile = (body, id, res) => {
    
    // BEGIN: User.update
    User.update(
        body, 
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
    }); // END: User.update
};


exports.findAll = async (req, res) => {
    await User.findAll({
        //{ include: ["user_type",'user_access','user_branch','loyalty_card','discount'] }
        where: { status: 'Active',  contact_no: null, },
        attributes: ["id", "first_name"] // U
        /*include: [ // U
            { 
                model: UserType,
                as: "user_type",
                attributes: ["id", "role", "user", "status"],
                include: [{
                    model: Role,
                    attributes: ["id", "role_title"]
                }]
            },
            { 
                model: UserAccess,
                as: "user_access",
                attributes: ["id", "access", "user", "status"],
                include: [{
                    model: Access,
                    attributes: ["id", "access_title"]
                }]
            },
            { 
                model: UserBranch,
                as: "user_branch",
                attributes: ["id", "branch", "user", "status"],
                include: [{
                    model: Branch,
                    attributes: ["id", "branch_name"]
                }]
            },
        ]  */
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