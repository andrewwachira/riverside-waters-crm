const mongoose = require("mongoose");

const connection = {}

async function connect(){
    try {
        if(connection.isConnected){
            console.log("already connected")
            return
        }
        if(mongoose.connections.length > 0){
            connection.isConnected = mongoose.connections[0].readyState;
            if(connection.isConnected === 1){
                console.log("used prev connection")
                return
            }
            await mongoose.disconnect();
        }
        
        const db = await mongoose.connect(process.env.MONGO_URI)
        connection.isConnected = db.connections[0].readyState
    } catch (error) {
        console.log(error.message)
        return error;
    }
    
}

async function disconnect(){
    try {
        if(connection.isConnected){
        if(process.env.NODE_ENV === "production"){
            await mongoose.disconnect()
            connection.isConnected = false;
        }else{
            console.log("not disconnected")
        }
        }
    } catch (error) {
        console.log(error.message);
        return error;
    }
}

function convertClientDocToObj(doc){
    if(!doc){
        return null
    }
    if(doc?._id) doc._id = doc._id.toString();
    if(doc?.createdAt) doc.createdAt = doc.createdAt.toISOString();
    if(doc?.updatedAt) doc.updatedAt = doc.updatedAt.toISOString();
    if (doc.__v !== undefined) doc.__v = doc.__v.toString();
    return doc;
}

const db = {connect, disconnect,convertClientDocToObj}
module.exports = db