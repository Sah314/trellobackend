import { User } from "../models/user.model";
import { UserRepository } from "../repository/user.repository";
import { getJwtToken } from "../utils/auth";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export class UserService {

    _userRepository:UserRepository;

    constructor(private userRepository:UserRepository){
        this._userRepository = userRepository
    }
  createUser = async (input: any): Promise<{user:User,token:string}> => {
    try {
      //console.log(input.firstName, input.lastName);
        const createdUser:User = await this._userRepository.signup(input);
        const token = getJwtToken(createdUser.id,createdUser.email);
        return {user:createdUser, token};
    } catch (error) {
      console.error("An error occurred while creating a user: ", error);
      throw error
    }
  };

  loginUser = async (input:any): Promise<{user:User, token:string}> => {
        try { 
         
          const existingUser = await this._userRepository.login(input);
          const token = getJwtToken(existingUser.id, existingUser.email);
          return { user: existingUser, token };

        } catch (error) {
           console.error("An error occurred while logging in the user: ", error);
           throw error;
        }
  };

  googleAuth = async(input:any):Promise<{user:User, token:string}> =>{

    try {
      const ticket = await client.verifyIdToken({
        idToken: input,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error("Invalid Google token");
      }
      const googleUser = await this._userRepository.googleAuth(payload);
      const token = getJwtToken(googleUser.id, googleUser.email);
      return {user:googleUser, token};


    } catch (error) {
      console.error("An error occurred while authenticating the user: ", error);
      throw error;
    }

  }

}

