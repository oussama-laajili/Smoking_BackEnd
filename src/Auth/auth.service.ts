import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../User/User.service';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../schema/User';
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    console.log('Found user:', user); // Log the user found
    if (user && (await bcrypt.compare(pass, user.password))) {
        const { password, ...result } = user; // Exclude password
        console.log('User object returned for login:', result); // Check the result
        return result; // Ensure this contains the email
    }
    return null;
}



  
async login(user: User & Document) {
  console.log('User object before signing JWT:', user); // Log the user object

  // Check if user is an instance of Mongoose Document
  const isMongooseDoc = user instanceof Document;

  // Use toObject() if it's a Mongoose Document, otherwise access the properties directly
  const { email } = isMongooseDoc ? user.toObject() : user; 
  
  const payload: JwtPayload = { email }; // Now email is accessible
  console.log('JWT Payload:', payload); // Log the payload before signing

  return {
      access_token: this.jwtService.sign(payload),
  };
}







  
async validate(payload: JwtPayload) {
  console.log('Decoded JWT Payload:', payload); // This should show the email
  return { 
      email: payload.email 
  };
}

async validateJwtPayload(payload: JwtPayload): Promise<User> {
  return this.userService.findByEmail(payload.email);
}

}
