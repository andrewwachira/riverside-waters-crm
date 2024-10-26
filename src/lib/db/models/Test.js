import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
    {    
        clientId : {type: mongoose.Schema.Types.ObjectId,ref:"Client",required:true},
        testResults:
            {
                florideTest: {
                    raw : {type:Number},
                    treated : {type:Number},
                    file : {type:String},
                    date: {type: Date}
                },
                otherTest: [
                    {
                        name: {type:String},
                        value:{type:Number},
                        file : {type:String},
                        date: {type:Date}
                    }
                ],
            }
    },
    {
        timestamps:true
    }
) 

const Test = mongoose.models?.Test || mongoose.model("Test",testSchema);
export default Test;






