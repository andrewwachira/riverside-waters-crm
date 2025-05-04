const mongoose = require("mongoose");

const countySchema = new mongoose.Schema({
    
    county : {type : String},
    area : [{type:String}],
    value : {type : String},
    index : {type : Number}
},{timestamps :false})

const County= mongoose.models.County || mongoose.model('County',countySchema);

module.exports = County;