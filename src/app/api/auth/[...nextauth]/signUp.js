import bcryptjs from "bcryptjs";
import User from "@/lib/db/models/User";
import db from "@/lib/db/index";

export default async function handler(req,res){
    if(req.method !== "POST"){
        return res.status(405).send({message:"Method not allowed"});
    }else{
       
        const {name,email,password,phone} = req.body;
        const pattern  = /^\d{12,12}$/

        if(!name){
            res.status(422).json({message:"Name not provided"});
            return
        }
        else if( !email || !email.includes("@")){
            res.status(422).json({message:"Invalid email"});
            return
        }
        else if(!password || password.length < 5 ){
            res.status(422).json({message:"Password not provided or password length too short"});
            return
        }
        else if( !phone){
            res.status(422).json({message:"Phone not provided"});
            return
        }
        else if(!pattern.test(phone)){
            res.status(422).json({message:"wrong phone number format"});
            return
        }else{
            await db.connect();
            const existsEmail =await  User.findOne({email});
            const existsPhone = await User.findOne({phoneNumber:phone});
            if(existsEmail){
                res.status(422).send({message:"User with the provided email already exists. Go to login and sign in if you opened an account with us."})
                await db.disconnect();
                return;
            }else if(existsPhone){
                res.status(422).send({message:"User with the provided phone number already exists. Go to login and sign in if you opened an account with us."})
                await db.disconnect();
                return;
            }else {
                await db.connect();
                const newUser =  new User({
                    name,email,
                    password: bcryptjs.hashSync(password),
                    phoneNumber:phone,
                    isSubAdmin: false,
                    isAuthenticated:false
                })
                console.log("bcrypt_hash",bcryptjs.hashSync(password));
                const user  = await newUser.save();
                await db.disconnect();
                return res.status(201).send({
                    message: "Account created successfully",
                    _id: user._id,
                    name: user.name,
                    email : user.email,
                    isSubAdmin : user.isAdmin,
                    isAuthenticated : false
                })
            }  
        }
    }
}