const db = require("../models");
const { Op } = require('sequelize');
const Role = db.Role;
const UserType = db.UserType;
const UserAccess = db.UserAccess;
const SubAccess = db.SubAccess; 
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
        Role,
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
     
    await Role.create(
        req.body,
        { include: ["user_access"] }
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
    await Role.findAll({
        where: { 
            status: 'Active',
            title: { [Op.notIn]: ['Super user', 'super user', 'Superuser', 'superuser', 'SuperUser'] }
        },
        attributes: ["id", "title"] // U
        /*include: [{  // U
            model:UserAccess,
            as: 'user_access',
            attributes: ["id", "access", "role", "status"],
            include: [{
                model:Access,
                attributes: ["id", "title", "status"]
            }]
        }] */ 
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

    await Role.findByPk(
        id,
        {
            include: [{  // C
                model: UserAccess,
                as: 'user_access',
                attributes: ["id", "sub_access", "status"],
                include: [{
                    model: SubAccess,
                    attributes: ["id", "title"]
                }]
            }]   
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

    req.body.updated_by = req.user.id;
    
    const newUserAccesses = req.body.user_access;
    if (newUserAccesses != undefined) {
        delete req.body.user_access;
        createNewUserAccesses(newUserAccesses, id, res, req.user.id);
    }

    const oldUserAccesses = req.body.oldUserAccesses;
    if (oldUserAccesses != undefined) {
        delete req.body.oldUserAccesses;
        deleteOldUserAccesses(oldUserAccesses, id, res);
    }

    // BEGIN: Role.update
    await Role.update(
        req.body, 
        { where: { id: id } }
    ).then((result) => {

        // BEGIN: if updated
        if (result[0]) {
            
            // BEGIN: UserType.update
            UserType.update(
                { status: (req.body.status === "Active" ? "Active" : "Inactive") }, 
                { where: { role: id } }
            ).then((ignored) => { 
                return res.send({
                    success: true,
                    message: [process.env.SUCCESS_UPDATE],
                });     
            }).catch((err) => {
                res.status(500).send({
                    success: false,
                    message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG], 
                });
            }); // END: UserType.update
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
    }); // END: Role.update
};

const createNewUserAccesses = async (newUserAccesses, id, res, created_by) => {
    await newUserAccesses.forEach((newSubAccess) => {
        UserAccess.create({
            sub_access: newSubAccess.sub_access,
            role: id,
            created_by: created_by
        }).then((ignored) => { 
           let pass;
        }).catch((err) => { 
            return res.status(500).send({
                success: false,
                message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG], 
            });
        }); 
    });
};

const deleteOldUserAccesses = async (oldUserAccesses, id, res) => {
    await oldUserAccesses.forEach((oldSubAccess) => {
        UserAccess.destroy({
            where: { 
                role: id,
                sub_access: oldSubAccess 
            }
        }).then((result) => { 
            if(!result){
                return res.status(500).send({
                    success: false,
                    message: [process.env.UPDATE_ERROR],  
                });
            }
        }).catch((err) => { 
            return res.status(500).send({
                success: false,
                message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG], 
            });
        }); 
    });
};

exports.delete = async (req, res) => {
    const id = req.params.id;

    // BEGIN: Role.update
    await Role.update(
        {
            status: "Inactive",
            updated_by: req.user.id
        }, 
        { where: { id: id } }
    ).then((result) => {

        // BEGIN: if updated
        if (result[0]) {

            // BEGIN: UserType.update
            UserType.update(
                { status: "Inactive" }, 
                { where: { role: id } }
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
            }); // END: UserType.update
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
    }); // END: Role.update
};
