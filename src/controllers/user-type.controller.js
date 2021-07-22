const db = require("../models");
const User = db.User;
const UserType = db.UserType;
const Role = db.Role;

exports.findAll = async (req, res) => {
  await UserType.findAll({
    where: {
      status: "Active"
    },
  })
    .then((data) => {
      res.send({
        success: true,
        data: data,
        message: [process.env.SUCCESS_RETRIEVE],
      });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        data: [],
        message: (err.errors
          ? err.errors.map((e) => e.message)
          : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],
      });
    });
};

exports.findOne = async (req, res) => {
  const id = req.params.id;

  await UserType.findByPk(
    id // C
  )
    .then((data) => {
      if (data) {
        res.send({
          success: true,
          data: data,
          message: [process.env.SUCCESS_RETRIEVE],
        });
      } else {
        res.status(500).send({
          success: false,
          data: [],
          message: [process.env.RETRIEVE_ERROR],
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        data: [],
        message: (err.errors
          ? err.errors.map((e) => e.message)
          : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],
      });
    });
};
