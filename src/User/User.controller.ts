import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus, BadRequestException, Patch, NotFoundException, Request } from '@nestjs/common';
import { UserService } from './User.service';
import { CreateUserDto } from './Dto/CreateUser.Dto';
import { User } from '../Schema/User';
import { LoginDto } from './Dto/login.dto';
import { Challenge } from 'src/Schema/Challenge';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) // Optional: Change the response status code to 200 OK
  async login(@Body() loginDto: LoginDto): Promise<string> {
    return this.userService.login(loginDto.email, loginDto.password);
  }

  @Post('password-reset/request')
  async requestPasswordReset(@Body('email') email: string): Promise<{ message: string }> {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    await this.userService.requestPasswordReset(email);
    return { message: 'Password reset token sent to your email' };
  }

  // Password reset endpoint
  @Post('password-reset/reset')
  async resetPassword(
    @Body('resetToken') resetToken: string,
    @Body('newPassword') newPassword: string,
  ): Promise<{ message: string }> {
    if (!resetToken || !newPassword) {
      throw new BadRequestException('Reset token and new password are required');
    }

    await this.userService.resetPassword(resetToken, newPassword);
    return { message: 'Password successfully reset' };
  }

  @Patch(':id/update-cigarette-stats')
  async updateCigaretteStatsAndIncrement(@Param('id') userId: string): Promise<{ message: string; user: User }> {
    try {
      // Update cigarette stats
      const updatedUser = await this.userService.updateCigaretteStats(userId);
      
      // Increment total cigarettes
      const incrementedUser = await this.userService.incrementTotalCig(userId);
      
      // If the user was not found after the update, throw a NotFoundException
      if (!incrementedUser) {
        throw new NotFoundException('User not found');
      }
  
      return {
        message: 'Cigarette stats updated and total cigarettes incremented successfully',
        user: incrementedUser,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException for proper handling
      }
      // Handle other potential errors (e.g., database issues)
      throw new Error('An error occurred while updating cigarette statistics and incrementing total cigarettes');
    }
  }
  

  @Post(':id/posts')
    async createPost(
        @Param('id') userId: string,
        @Body() createPostDto: { title: string; text: string }
    ) {
        return this.userService.createPost(userId, createPostDto);
    }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
  @Get(':email/average-cigarettes')
  async getAverageCigarettesSmoked(@Param('email') email: string): Promise<number> {
    try {
      // Call the service method to calculate the average using email
      const averageCig = await this.userService.calculateAverageCigarettesSmoked(email);
      return averageCig;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
  

  @Get(':email')
  async getUserByEmail(@Param('email') email: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User | null> {
    return this.userService.findById(id);
  }
  
  @Get(':userId/last-challenge')
  async getLastChallenge(@Param('userId') userId: string): Promise<Challenge | null> {
    return this.userService.getLastChallenge(userId);
  }
  @Get(':email/challenges')
    async getUserChallenges(@Param('email') email: string): Promise<Challenge[]> {
        return this.userService.getChallengesByEmail(email);
    }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: CreateUserDto): Promise<User | null> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<User | null> {
    return this.userService.delete(id);
  }
  
  @Patch(':id/increment-cigarette')
  async incrementCigarettesSmoked(@Param('id') userId: string): Promise<Challenge> {
    // Call the service method to increment nbcigsmoked of the latest challenge
    return this.userService.incrementCigarettesSmokedInLatestChallenge(userId);
  }
}
