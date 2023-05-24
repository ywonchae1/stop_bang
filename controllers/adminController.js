
const adminModel = require('../models/adminModel');

exports.getNewUsersCount = async(req,res) => {
    
    try {
        const rows = await adminModel.getNewUsersCountModel();
        return rows;

    } catch (err) {
        console.error(err.stack)
    }
},

exports.getAdmin = async(r_id) =>{

    try{
        const is_admin = await adminModel.getAdminModel(r_id);
        //console.log("print admin : "+rows);
        return is_admin;

    }catch(err){

    }


}
