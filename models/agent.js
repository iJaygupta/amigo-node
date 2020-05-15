const mongoose = require("mongoose");
const dbConfig = require("../dbConfig");
const Schema = mongoose.Schema;

let agentSchema = new Schema({
    "agent": { type: String },
    "userType":{ type: String },
    "policy_mode": { type: String },
    "producer": { type: String },
    "policy_number":{ type: String },
    "premium_amount": { type: Number },
    "policy_type": { type: String },
    "company_name": { type: String },
    "category_name": { type: String },
    "policy_start_date": { type: Number },
    "policy_end_date": { type: Number },
    "csr": { type: String },
    "account_name": { type: String },
    "email": { type: String },
    "gender": { type: String },
    "firstname": { type: String },
    "city": { type: String },
    "account_type": { type: String },
    "phone": { type: String },
    "address": { type: String },
    "state": { type: String },
    "zip": { type: String },
    "dob": { type: Number },
    "premium_amount_written":{ type: String },
    "primary": { type: String },
    "Applicant ID": { type: String },
    "agency_id": { type: String },
    "hasActive ClientPolicy": { type: String },
    createdAt: { type: Date, default: new Date() },
});

module.exports.getModel = function () {
    let connection = dbConfig.connect();
    return connection.model("agent", agentSchema);
};



