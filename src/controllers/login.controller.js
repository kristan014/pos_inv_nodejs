const db = require("../models");
const User = db.User;
const UserType = db.UserType;
const Role = db.Role;
const UserAccess = db.UserAccess;
const SubAccess = db.SubAccess;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const generateToken = (data) => {
    return jwt.sign(
        data, 
        process.env.TOKEN_SECRET, 
        { expiresIn: "7200s" }
    );
}
exports.login = (req, res) => {
    if (req.body.email && req.body.password) {
        User.findOne({
            where: {
                email: req.body.email,
                status: "active",
            },
            include: [
                { // user_type[0].status, user_type[0].Role.user_access[0].status
                    model: UserType, // user_type[0].Role.user_access[0].SubAccess.title
                    as: "user_type",
                    attributes: ["role", "status"],
                    include: [{
                        model: Role,
                        attributes: ["id", "title"],
                        include: [{
                            model: UserAccess,
                            as: 'user_access',
                            attributes: ["sub_access", "status"],
                            include: [{
                                model: SubAccess,
                                attributes: ["title"]
                            }]
                        }]
                    }]
                },
            ],
        }).then((data) => {
            if (data) {
                bcrypt.compare(
                    req.body.password,
                    data.password,
                    function (err, result) {
                        if (result) {
                            
                            if (data.user_type.length) {
                                res.send({
                                    success: true,
                                    data: data,
                                    token: generateToken({
                                        id: data.id,
                                        full_name: data.full_name, //
                                        email: data.email,
                                    }),
                                    message: [process.env.SUCCESS_RETRIEVE],
                                });
                            }else{
                                res.send({
                                    success: true,
                                    data: data,
                                    token: generateToken({
                                        id: data.id,
                                        first_name: data.first_name, //
                                        email: data.email,
                                    }),
                                    message: [process.env.SUCCESS_RETRIEVE],
                                });
                            }
                        }else{
                            res.status(500).send({
                               success: false,
                               data: [],
                               message: ["Invalid credentials."], 
                            });
                        }
                    }
                );
            }else{
                res.status(500).send({
                    success: false,
                    data: [],
                    message: ["Invalid credentials."],
                });
            }
        }).catch((err) => {
            res.status(500).send({
                success: false,
                data: [],
                message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],
            });
        });
    }
};

exports.sendCode = async (req, res) => {
    // require("crypto").randomBytes(5).toString("hex");
    const transporter = nodemailer.createTransport({
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
        } else {
            res.send({
                success: true,
                message: [process.env.SUCCESS_CREATE],
            });
        }
    });
};