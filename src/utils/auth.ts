import jwt from "jsonwebtoken";


export const getJwtToken = (id:string, email:string): string => {
  try {
    const token = jwt.sign(
      {
        id: id,
        email: email,
      },
      process.env.JWT_SECRET as string
    );
    return token;
  } catch (error) {
    console.error("An error occurred while creating a JWT token: ", error);
    throw error;
  }
};
