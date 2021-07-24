const db = require("../models");
const User = db.User;
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');

exports.passwordReset = async (req, res) => {
    
    // BEGIN: if filled out
    if (req.body.email && req.body.oldPassword && req.body.newPassword) {
        
        req.body.newPassword = await bcrypt.hash(
            req.body.newPassword, 
            parseInt(process.env.SALT_ROUND),
        );
       
        // BEGIN: User.findOne
        await User.findOne({
            where: {
                email: req.body.email,
                status: "active",
            }
        }).then((data) => {

            // BEGIN: if found
            if (data) {

                // BEGIN: bcrypt.compare
                bcrypt.compare(
                    req.body.oldPassword,
                    data.password,
                    function (err, result) {

                        // BEGIN: if matched
                        if (result) {

                            // BEGIN: User.update
                            User.update(
                                { password: req.body.newPassword },
                                { where: { email: req.body.email } }
                            ).then((result) => {
                                req.body = {};

                                // BEGIN: if updated
                                if (result[0]) {
                                    res.send({
                                        error: false,
                                        data: [],
                                        message: ['Password Reset Success!'],
                                    });
                                }else{
                                    res.status(500).send({
                                        error: true,
                                        data: [],
                                        mesage: [process.env.UPDATE_ERROR], 
                                    });
                                } // END: if updated
                            }).catch((err) => {
                                req.body = {};
                                res.status(500).send({
                                    error: true,
                                    data: [],
                                    message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],
                                });
                            }); // END: User.update
                        }else{
                            req.body = {};
                            res.status(500).send({
                               error: true,
                               data: [],
                               message: ["Invalid Account!"],
                            });
                        } // END: if matched
                    }
                ); // END: bcrypt.compare
            }else{
                req.body = {};
                res.status(500).send({
                    error: true,
                    data: [],
                    message: ["Invalid Account!"],
                });
            } // END: if found
        }).catch((err) => {
            req.body = {};
            res.status(500).send({
                error: true,
                data: [],
                message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],
            });
        }); // END: User.findOne
    } // END: if filled out
};
