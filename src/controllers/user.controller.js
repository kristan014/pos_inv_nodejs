const db = require("../models");
const { Op } = require('sequelize');
const User = db.User;
const UserType = db.UserType;
const Role = db.Role;
const UserAccess = db.UserAccess; // !
const Access = db.Access;
const UserBranch = db.UserBranch;  
const Branch = db.Branch;
const LoyaltyCard = db.LoyaltyCard; // !
const Discount = db.Discount; // !
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const datatable = require("sequelize-datatables");

exports.findDatatable = async (req, res) => {
    // just a demo
    req.body = {
        draw: "1",
        columns: [
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
            data: "user_branch[0].Branch.branch_name",
            name: "user_branch[0].Branch.branch_name",
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
            data: "contact_no",
            name: "contact_no",
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
        //{ include: ["user_type",'user_access','user_branch'] }
        {   
            include: [
                { // C
                    model: UserType,
                    as: "user_type",
                    attributes: ["id", "role", "status"],
                    include: [{
                        model: Role,
                        attributes: ["id", "title"]
                    }]
                },
                { // C
                    model: UserBranch,
                    as: "user_branch",
                    attributes: ["id", "branch", "status"],
                    include: [{
                        model: Branch,
                        attributes: ["id", "branch_name"]
                    }]
                },
            ],
            where: { 
                contact_no: { [Op.not]: null },
                id: { [Op.not]: req.user.id }
            },
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
    req.body.profile_pic = req.file != undefined ? req.file.filename : "";
    
    req.body.full_name = ""; 
    
    const password = 'qwe' // require("crypto").randomBytes(5).toString("hex");

    req.body.password = await bcrypt.hash(
        password, 
        parseInt(process.env.SALT_ROUND),
    );
    
    req.body.created_by = req.user != undefined ? req.user.id : null;
  
    req.body.user_type = { role: req.body.role };
    delete req.body.role;

    req.body.user_branch = { branch: req.body.branch };
    delete req.body.branch;
  
    await User.create(
        req.body,
        { include: ['user_branch', 'user_type'] }
    ).then((ignored) => {   
        /*const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'poswithis123@gmail.com',
              pass: 'adminpassword123'
            }
        });
          
        const mailOptions = {
            from: 'poswithis123@gmail.com',
            to: req.body.email,
            subject: 'Password',
            text: 'Your password: ' + password
        };
          
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                res.status(500).send({
                    success: false,
                    message: ['Failed to send an email with password.'],
                });
            } else {*/
                res.send({
                    success: true,
                    message: [process.env.SUCCESS_CREATE],
                });
         /*   }
        });*/
    }).catch((err) => {
        res.status(500).send({
            success: false,
            message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],
        });
    });
 };

exports.findAll = async (req, res) => {
    await User.findAll({
        //{ include: ["user_type",'user_access','user_branch','loyalty_card','discount'] }
        where: { status: 'Active',  contact_no: { [Op.not]: null }, },
        attributes: ["id", "full_name"] // U
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

exports.findOne = async (req, res) => {
    const id = req.params.id;
    
    await User.findByPk(
        id, // C
        {   
            include: [
                { // C
                    model: UserType,
                    as: "user_type",
                    attributes: ["id", "role", "status"],
                    include: [{
                        model: Role,
                        attributes: ["title"]
                    }]
                    //where: { status: 'Active' }
                },
                { // C
                    model: UserBranch,
                    as: "user_branch",
                    attributes: ["id", "branch", "status"],
                    include: [{
                        model: Branch,
                        attributes: ["branch_name"]
                    }]
                    //where: { status: 'Active' }
                },
            ]  
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

    if (req.file != undefined) req.body.profile_pic = req.file.filename;

    req.body.full_name = ""; 
   
    // update user branch
    const branch = req.body.branch;
    if (branch != undefined) { 
        const branchToDelete = req.body.branchToDelete;
       
        delete req.body.branch;
        delete req.body.branchToDelete;
        
        createNewUserBranchOrType(
            UserBranch,
            { branch: branch, user: id }, 
            res
        );  
        deleteOldUserBranchOrType(
            UserBranch, 
            { branch: branchToDelete, user: id },
            res
        );
    }

    // update user type
    const role = req.body.role;
    if (role != undefined) {
        const roleToDelete = req.body.roleToDelete;
       
        delete req.body.role;
        delete req.body.roleToDelete;

        createNewUserBranchOrType(
            UserType,
            { role: role, user: id }, 
            res
        );  
        deleteOldUserBranchOrType(
            UserType, 
            { role: roleToDelete, user: id }, 
            res
        );
    }

    if (req.body.updated_by == id) req.body.updated_by = null;
    
    // BEGIN: User.update
    await User.update(
        req.body, 
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

const createNewUserBranchOrType =  (instance, branchOrRole, res) => {
     instance.create(
        branchOrRole
    ).then((ignored) => {   
        let pass;
    }).catch((err) => { 
        res.status(500).send({
            success: false,
            message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG], 
        });
    }); 
};

const deleteOldUserBranchOrType =  (instance, branchOrRoleToDelete, res) => {
    instance.destroy({
        where: branchOrRoleToDelete 
    }).then((result) => { 
        if (!result){
            res.status(500).send({ 
                success: false,  
                message: [process.env.UPDATE_ERROR]
            });
        }
    }).catch((err) => { 
        res.status(500).send({
            success: false,
            message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG], 
        });
    }); 
};

exports.delete = async (req, res) => {
    const id = req.params.id;

    // BEGIN: User.update
    await User.update(
        {
            status: "Inactive",
            updated_by: req.user.id
        }, 
        { where: { id: id } }
    ).then((result) => {

        // BEGIN: if updated
        if (result[0]) {
            res.send({
                success: true,
                message: [process.env.SUCCESS_DEACTIVATION],
            });
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
    }); // END: User.update
};
