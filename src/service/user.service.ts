import { User } from "../models/user.model";
import { UserRepository } from "../repository/user.repository";


export class UserService {

    _userRepository:UserRepository;

    constructor(private userRepository:UserRepository){
        this._userRepository = userRepository
    }
  createUser = async (input: any): Promise<User> => {
    try {
        const createdUser = await this._userRepository.signup(input);
        return createdUser;
    } catch (error) {
      console.error("An error occurred while creating a user: ", error);
      throw error
    }
  };

  loginUser = async (input:any): Promise<User> => {

    throw new Error("Not implemented");
  };

  googleAuth = async(input:any):Promise<User> =>{
    const user = await this._userRepository.googleAuth(input);
    return user;
  }
}

