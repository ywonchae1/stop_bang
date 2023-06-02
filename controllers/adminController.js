
const adminModel = require('../models/adminModel');

exports.getNewUsersCount = async(req,res) => {
    
    try {
        const rows = await adminModel.getNewUsersCountModel();
        return rows;

    } catch (err) {
        console.error(err.stack)
    }
},
exports.getNewAgent = async(req,res) => {
    
    try {
        const rows = await adminModel.getNewAgentModel();
        return rows;

    } catch (err) {
        console.error(err.stack)
    }
},
exports.getAgent = async(regno) => {
    
    try {
        const rows = await adminModel.getAgentModel(regno);
        return rows;

    } catch (err) {
        console.error(err.stack)
    }
},

exports.getAdmin = async(r_id) =>{

    try{
        const is_admin = await adminModel.getAdminModel(r_id);
        //console.log("print admin !!!!: "+is_admin.r_isadmin);
        
        return is_admin.r_isadmin;

    }catch(err){

    }
},

exports.agentConfirm = async(regno,a_id) =>{

    try{
        const rows = await adminModel.confirmModel(regno,a_id);
        return rows;

    }catch(err){

    }
},

exports.getReports = async() =>{

    try{
        const rows = await adminModel.getReportModel();
        console.log("Rows !!! :"+rows);
        return rows;

    }catch(err){

    }
},
exports.getOneReport = async(rvid) =>{

    try{
        const rows = await adminModel.getOneReportModel(rvid);
        console.log("Rows !!! :"+rows);
        return rows;

    }catch(err){

    }
},

exports.deleteComment = async(rvid) =>{

    try{
        const rows = await adminModel.deleteCommentModel(rvid);
    }catch(err){

    }
},

exports.deleteReport = async(rvid) =>{

    try{
        const rows = await adminModel.deleteReportModel(rvid);
    }catch(err){

    }
};