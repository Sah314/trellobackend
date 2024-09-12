import { User } from "../models/user.model";


const createUser = async (user: User): Promise<User> => {
    try {
        
    } catch (error) {
        console.error("An error occurred while creating a user: ", error);
    }
}

const loginUser = async (email: string, password: string): Promise<User> => {
    throw new Error("Not implemented");
}
