const db = require("../models");
const Access = db.Access;
const SubAccess = db.SubAccess;
const UserAccess = db.UserAccess;
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
        Access,
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
  
    await Access.create(
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
    await Access.findAll({
        where: { status: 'Active' },
        attributes: ["id", "title"],
        include: [{
            model: SubAccess,
            as: 'sub_access',
            //where: { status: 'Active' }, 
            attributes: ["id", "title", "status"]
        }],
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
    
    await Access.findByPk(
        id // C
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
    
    // BEGIN: Access.update
    await Access.update(
        req.body, 
        { where: { id: id } }
    ).then((result) => {

        // BEGIN: if updated
        if (result[0]) {

            // BEGIN: SubAccess.update
            SubAccess.update(
                {
                    status: (req.body.status === "Active" ? "Active" : "Inactive"),
                    updated_by: req.user.id
                }, 
                { where: { access: id } }
            ).then((ignored) => {

                 // BEGIN: SubAccess.findOne
                SubAccess.findOne({
                    where: { access: id } 
                }).then((data) => {
                    
                    // BEGIN: if found
                    if (data) {
                             
                        // BEGIN: UserAccess.update
                        UserAccess.update(
                            { status: (req.body.status === "Active" ? "Active" : "Inactive") }, 
                            { where: { sub_access: data.id } }
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
                        }); // END: UserAccess.update
                    }else{
                        res.send({
                            success: true,
                            message: [process.env.SUCCESS_DEACTIVATION],
                        });
                    } // END: if found
                }).catch((err) => {
                    res.status(500).send({
                        success: false,
                        message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],  
                    });
                }); // END: SubAccess.findOne
            }).catch((err) => {
                res.status(500).send({
                    success: false,
                    message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],  
                });
            }); // END: SubAccess.update
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
    }); // END: Access.update
};

exports.delete = async (req, res) => {
    const id = req.params.id;

    // BEGIN: Access.update
    await Access.update(
        {
            status: "Inactive",
            updated_by: req.user.id
        }, 
        { where: { id: id } }
    ).then((result) => {

        // BEGIN: if updated
        if (result[0]) {

            // BEGIN: SubAccess.update
            SubAccess.update(
                {
                    status: "Inactive",
                    updated_by: req.user.id
                }, 
                { where: { access: id } }
            ).then((ignored) => {   
                
                 // BEGIN: SubAccess.findOne
                SubAccess.findOne({
                    where: { access: id } 
                }).then((data) => {
                    
                    // BEGIN: if found
                    if (data) {
                             
                        // BEGIN: UserAccess.update
                        UserAccess.update(
                            { status: "Inactive" }, 
                            { where: { sub_access: data.id } }
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
                        }); // END: UserAccess.update
                    }else{
                        res.send({
                            success: true,
                            message: [process.env.SUCCESS_DEACTIVATION],
                        });
                    } // END: if found
                }).catch((err) => {
                    res.status(500).send({
                        success: false,
                        message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],  
                    });
                }); // END: SubAccess.findOne
            }).catch((err) => {
                res.status(500).send({
                    success: false,
                    message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],  
                });
            }); // END: SubAccess.update
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
    }); // END: Access.update
};
