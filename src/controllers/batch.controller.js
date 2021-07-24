const db = require("../models");
const Batch = db.Batch;

exports.findOne = async (req, res) => {
    const candidateBarcode = req.params.candidateBarcode;
    
    await Batch.findOne({
        where: { barcode: candidateBarcode }
    }).then((data) => {
        if (data) res.send({ success: true });
        else res.send({ success: false });
    }).catch((err) => {
        res.status(500).send({
            success: false,
            message: (err.errors ? err.errors.map((e) => e.message) : [process.env.GENERAL_ERROR_MSG]) || [process.env.GENERAL_ERROR_MSG],  
        });
    }); 
 };
 