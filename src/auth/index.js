import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import db from "@/lib/db";
import User from "@/lib/db/models/User";
import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";
import { CredentialsSignin } from "@auth/core/errors";
import Google from "next-auth/providers/google";
import System from "@/lib/db/models/System";

class CustomError extends CredentialsSignin {
    code = "custom"
    constructor (message,errorOptions){
      super(message,errorOptions)
      this.message = message
    }

    // errMessage(){
    //   return this.message
    // }
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  session:{
    strategy:"jwt"
},
callbacks:{
    async signIn({account,profile}){
      console.log("profile: " ,profile);
      if (account.provider === "google") {
        if(!profile){
            throw new Error("There is no such profile")
        }
        try {
          await db.connect();
          const totalAdmins = User.countDocuments();
          const system = System.findOne({});
          const user = await User.findOne({email:profile.email});
          await db.disconnect();
          if(!user && totalAdmins >= system.adminAccounts ){
                throw new Error("Additional admins are not allowed")
          }
          if(!user.image){
            await user.updateOne({image:profile.image});
          }
          return true;
        } catch (error) {
            console.log(error);
            return false
        }
    }
        return true
    
    },
    async jwt({token,user}){
        if(user?._id) token._id = user._id;
        if(user?.iSupersAdmin) token.isSuperAdmin  = user.isSuperAdmin;
        if(user?.isAuthenticated) token.isAuthenticated = user.isAuthenticated;
        if(user?.image) token.image = user.image;
        if(user?.phoneNumber) token.phoneNumber = user.phoneNumber;
        if(user?.createdAt) token.createdAt = user.createdAt;
        return token;
    },
    async session({token,session}){
        if(token?._id) session.user._id = token._id;
        if(token?.isSuperAdmin) session.user.isSuperAdmin  = token.isSuperAdmin;
        if(token?.isAuthenticated) session.user.isAuthenticated = token.isAuthenticated;
        if(token?.image) session.user.image = token.image;
        if(token?.phoneNumber) session.user.phoneNumber = token.phoneNumber;
        if(token?.createdAt) session.user.createdAt = token.createdAt;
        return session;
    }
},
  providers: [
    Credentials({
        credentials: {
          email: {},
          password: {},
        },
        authorize: async (credentials) => {
          await db.connect();
                const user = await User.findOne({email:credentials.email});
                await db.disconnect();
                if(user && bcrypt.compareSync(credentials.password,user.password)){
                    return{
                        _id:user._id,
                        name:user.name,
                        email:user.email,
                        image:user.image,
                        isSuperAdmin:user.isSuperAdmin,
                        isAuthenticated: user.isAuthenticated,
                        createdAt: user.createdAt,
                        phoneNumber: CryptoJS.AES.encrypt(JSON.stringify(user.phoneNumber),process.env.AUTH_SECRET).toString(),
                    }
                }else if(!user){
                   throw new CustomError("User with the provided email not found.");
                }else{
                    throw new CustomError("Invalid Password");
                }
        },
      }),
      Google
  ],
})