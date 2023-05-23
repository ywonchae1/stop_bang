
const adminModel = require('../models/adminModel');

exports.getNewUsersCount = async(req,res) => {
    
    try {
        const rows = await adminModel.getNewUsersCountModel();
        return rows;

    } catch (err) {
        console.error(err.stack)
    }
};
