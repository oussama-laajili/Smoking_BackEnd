import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../User/User.service';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../schema/User';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    console.log('Found user:', user); // Check if user is found
    if (user && (await bcrypt.compare(pass, user.password))) {
        const { password, ...result } = user;
        return result;
    }
    return null;
}

  

  async login(user: User) {
    const payload: JwtPayload = { 
      email: user.email,
            // Include avatar
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  

  async validateJwtPayload(payload: JwtPayload): Promise<User> {
    return this.userService.findByEmail(payload.email);
  }
}
