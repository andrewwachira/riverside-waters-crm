import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
    {    
        clientId : {type: mongoose.Schema.Types.ObjectId,ref:"Client",required:true},
        testResults:[
            {
                testDate: {type:Date},
                florideTest: {type: Number},
                testsPassed:{type:Boolean},
                otherTest: [
                    {
                        name: {type:String},
                        value:{type:Number}
                    }
                ],
                attachments : [
                    {
                        test:{type:String},
                        srcUrl: {type:String}
                    }
                ]
            }
        ],
    },
    {
        timestamps:true
    }
) 

const Test = mongoose.models?.Test || mongoose.model("Test",testSchema);
export default Test;






