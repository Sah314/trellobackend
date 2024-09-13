import { User } from "../models/user.model";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UserRepository{


    async login(user: any) : Promise<User>{
        const currentuser = await prisma.user.findUnique({
            where: {
                email: user.email
            }
        })
        if(currentuser){
            if(currentuser.password === user.password){
                currentuser.name = currentuser.name!;
                return currentuser as User;
            }
        }
        throw new Error("")
    }


    async signup(data: User):Promise<User>{
        const createdUser = await prisma.user.create({
            data: {
                ...data
            }
        });
        return createdUser as User;
    }


    async googleAuth(data:any): Promise<User>{
        const existingUser = await prisma.user.findUnique(
           { where:{
                email:data.email
            }}
        ) 
        if(existingUser){
            return existingUser as User
        }
        const createdUser = await prisma.user.create(
           { data:{
                email:data.email,
                password:"",
                googleId: data.sub  
            }}
        )
        return createdUser as User
    }
}