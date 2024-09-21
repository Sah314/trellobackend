import { IsString, IsEmail,IsOptional ,MinLength } from "class-validator";

export class SignupRequest {
  @IsEmail({}, { message: "Email must be a valid email address" })
  email!: string;

  @IsString()
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password!: string;

  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  lastname?: string;
}

export class LoginRequest {
  @IsEmail({}, { message: "Email must be a valid email address" })
  email!: string;

  @IsString()
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password!: string;
}
