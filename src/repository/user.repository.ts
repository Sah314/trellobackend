import { TokenPayload } from "google-auth-library";
import { User } from "../models/user.model";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
const saltRounds = (process.env.SALT_ROUNDS) || "10";

export class UserRepository{
    async login(data: any) : Promise<User>{
        try {
            const currentuser = await prisma.user.findUnique({
                where: {
                    email: data.email,
                },
            });
            console.log("Data received for login: ", data);

        if (!currentuser) {
            throw new Error("User not found");
        }  
        if (!currentuser.password) {
            throw new Error("User does not have a password");
        }
          const passwordMatch = bcrypt.compareSync(
            data.password,currentuser.password
          );
          console.log("Password match??",passwordMatch);
          if (!passwordMatch) {
            throw new Error("Invalid password");
          }       
        
          return currentuser as unknown as User;

        } catch (error) {
            throw error;
        }
         
    }


    async signup(data: User):Promise<User>{
    try {
         const salt = bcrypt.genSaltSync(parseInt(saltRounds));
         const hashedPassword = bcrypt.hashSync(data.password, salt);
        console.log(data.firstname, data.lastname);
         const createdUser = await prisma.user.create({
           data: {
             firstname: data.firstname,
             lastname: data.lastname,
             email: data.email,
             password: hashedPassword,
           },
         });
        
         return createdUser as unknown as User;
    } catch (error) {
        console.error("An error occurred while creating a user: ", error);
        throw error;
    }
   
       // return createdUser as User;
    }


    async googleAuth(data:TokenPayload): Promise<User>{

        if(!data.email){
            throw new Error("Invalid email")
        }

        const existingUser = await prisma.user.findUnique(
           { where:{
                email:data.email
            }}
        ) 

        if(existingUser){
            //return existingUser as User
            return existingUser as unknown as User;
        }

        const createdUser = await prisma.user.create(
           { data:{
                email:data.email,
                firstname: data.given_name || "",
                lastname: data.family_name || "",
                password: "", // No password for Google users
                googleId: data.sub  
            }}
        )
      
        return createdUser as unknown as User;
    }
}