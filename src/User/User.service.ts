import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../Schema/User';
import { CreateUserDto } from './Dto/CreateUser.Dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/Mail/Mail.service';
import { Challenge, ChallengeDocument } from 'src/Schema/Challenge';
import { Cron } from '@nestjs/schedule';
import { Postt, PosttDocument } from 'src/Schema/Postt';
import { generatePassword } from './util';


@Injectable()
export class UserService {
  private intervalId: NodeJS.Timeout; // Store the interval ID

  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Challenge.name) private challengeModel: Model<ChallengeDocument>,
    @InjectModel(Postt.name) private posttModel: Model<PosttDocument>,
    private mailService: MailService,
  ) {
    // Calculate the time until the next midnight
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); // Next day at 00:00
    const timeUntilMidnight = nextMidnight.getTime() - now.getTime();

    // Set a timeout to call reset function at midnight
    setTimeout(() => {
      this.resetCigaretteAndPoints().catch((err) => console.error(err));

      // Set an interval to call the reset function every day after that
      this.intervalId = setInterval(() => {
        this.resetCigaretteAndPoints().catch((err) => console.error(err));
      }, 86400000); // 86,400,000 ms = 24 hours
    }, timeUntilMidnight);
  }

  @Cron('0 0 * * *') // Runs at 00:00 every day
  async createChallengesForAllUsers(): Promise<void> {
    const users = await this.UserModel.find().exec();

    for (const user of users) {
      // Calculate Challenge values
      const nbexpeccig = user.compteurcig - 2; // Adjust as needed
      const timebtwcig = Math.floor((16 / nbexpeccig) * 60);

      // Create a new Challenge instance for each user
      const newChallenge = new this.challengeModel({
        dateactuel: new Date(), // Current date
        nbexpeccig: nbexpeccig,
        timebtwcig: timebtwcig,
        challengesucc: true,
        nbcigsmoked:0,
      });

      // Save the new Challenge instance
      await newChallenge.save();

      // Associate the created challenge with the user
      user.challenges.push(newChallenge.id);
      await user.save();
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if the user already exists
    const existingUser = await this.UserModel.findOne({ email: createUserDto.email }).exec();
    if (existingUser) {
        throw new ConflictException('Email already exists');
    }

    // Generate and hash the password
    const password = generatePassword(8);
    console.log('Generated password:', password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    // Calculate the initial money based on cigarettes
    const compteurargent = createUserDto.nbcigaretteinitial * createUserDto.prixcig;

    // Calculate Challenge values
    const nbexpeccig = createUserDto.nbcigaretteinitial - 2;
    const timebtwcig = Math.floor((16 / nbexpeccig) * 60);

    // Create a new Challenge instance
    const newChallenge = new this.challengeModel({
        dateactuel: new Date(), // Current date
        nbexpeccig: nbexpeccig,
        timebtwcig: timebtwcig,
        challengesucc: true,
        nbcigsmoked: 0,
    });

    // Save the new Challenge instance
    await newChallenge.save();

    // Create a new User instance with all necessary fields
    const newUser = new this.UserModel({
        ...createUserDto,
        password: hashedPassword,
        compteurcig: 0, // Initialize 'compteurcig' to 0
        compteurpts: 100, // Initialize 'compteurpts' to 100
        compteurargent: compteurargent, // Save the calculated argent value
        challenges: [newChallenge._id], // Associate the created challenge with the user
        totalcig: 0, // Initialize 'totalcig' to 0
    });

    // Save the new User instance to the database
    await newUser.save();
    console.log('User saved:', newUser);

    // Send the email with the generated password
    await this.mailService.sendUserPassword(createUserDto.email, password);

    // Return the newly created user
    return newUser;
}


  async findAll(): Promise<User[]> {
    return this.UserModel.find().exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.UserModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: CreateUserDto): Promise<User | null> {
    return this.UserModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async delete(id: string): Promise<User | null> {
    return this.UserModel.findByIdAndDelete(id).exec();
  }

  async login(email: string, password: string): Promise<string> {
    // Find the User by email
    const User = await this.UserModel.findOne({ email }).exec();

    // If User not found, throw an error
    if (!User) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, User.password);

    // If password is not valid, throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Return a success message
    return 'Login successful User';
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.UserModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate a reset token and expiration date
    const resetToken = crypto.randomBytes(4).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiration = new Date(Date.now() + 3600000); // Token valid for 1 hour
    await user.save();

    // Send reset token to user
    await this.mailService.sendUserPassword(email, resetToken);
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    const user = await this.UserModel.findOne({
      resetToken,
      resetTokenExpiration: { $gte: Date.now() },
    }).exec();

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
  }

  async updateCigaretteStats(userId: string): Promise<User | null> {
    // Find the user by ID
    const user = await this.UserModel.findById(userId).exec();

    // If user not found, throw an error
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update the fields: increment compteurcig, decrease compteurargent and compteurpts
    user.compteurcig += 1; // Increment compteurcig by 1
    user.compteurargent -= user.prixcig; // Decrease compteurargent by the price of a cigarette
    user.compteurpts -= 5; // Decrease compteurpts by 5

    // Save the updated user
    await user.save();

    return user;
  }

  async incrementTotalCig(userId: string): Promise<User | null> {
    // Find the user by ID
    const user = await this.UserModel.findById(userId).exec();

    // If user not found, throw an error
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Increment the totalcig field by 1
    user.totalcig += 1;

    // Save the updated user
    await user.save();

    return user;
  }

  async createPost(userId: string, postDto: { title: string; text: string }): Promise<Postt> {
    // Find the user by ID
    const user = await this.UserModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create a new post
    const post = new this.posttModel({
      title: postDto.title,
      text: postDto.text,
      date: new Date(), // Default date or use postDto.date if it's provided
    });

    // Save the post and associate it with the user
    await post.save();

    // Add the post to the user's posts array
    user.posts.push(post.id);
    await user.save();

    return post;
  }
  async calculateAverageCigarettesSmoked(email: string): Promise<number> {
    // Find the user by email
    const user = await this.UserModel.findOne({ email }).exec();

    // If user is not found, throw an error
    if (!user) {
        throw new NotFoundException('User not found');
    }

    // Get the total number of cigarettes smoked
    const totalCig = user.totalcig;

    // Get the number of challenges completed
    const numChallenges = user.challenges.length;

    // If there are no challenges, return 0 to avoid division by zero
    if (numChallenges === 0) {
        return 0;
    }

    // Calculate the average cigarettes smoked
    const averageCig = totalCig / numChallenges;

    // Return the calculated average
    return averageCig;
}


  async resetCigaretteAndPoints(): Promise<void> {
    // Update all users' compteurcig and compteurpts
    await this.UserModel.updateMany({}, { $set: { compteurcig: 0, compteurpts: 100 } }).exec();
  }

  async incrementCigarettesSmokedInLatestChallenge(userId: string): Promise<Challenge | null> {
  // Find the user by ID
  const user = await this.UserModel.findById(userId).populate('challenges').exec();

  // If user not found, throw an error
  if (!user) {
    throw new NotFoundException('User not found');
  }

  // Ensure the user has challenges
  if (user.challenges.length === 0) {
    throw new NotFoundException('No challenges found for the user');
  }

  // Get the latest challenge (last challenge in the array)
  const latestChallengeId = user.challenges[user.challenges.length - 1]._id;
  const latestChallenge = await this.challengeModel.findById(latestChallengeId).exec();

  // If the latest challenge is not found, throw an error
  if (!latestChallenge) {
    throw new NotFoundException('Latest challenge not found');
  }

  // Increment the nbcigsmoked field by 1
  latestChallenge.nbcigsmoked += 1;

  // Save the updated challenge
  await latestChallenge.save();

  return latestChallenge;
}
async getLastChallenge(userId: string): Promise<Challenge | null> {
  // Find the user by ID and populate the challenges
  const user = await this.UserModel.findById(userId).populate('challenges').exec();

  // If user not found, throw an error
  if (!user) {
    throw new NotFoundException('User not found');
  }

  // Ensure the user has challenges
  if (user.challenges.length === 0) {
    throw new NotFoundException('No challenges found for the user');
  }

  // Get the last challenge (the last element in the challenges array)
  const lastChallenge = user.challenges[user.challenges.length - 1];

  return lastChallenge;
}
async findByEmail(email: string): Promise<User | null> {
  return await this.UserModel.findOne({ email }).lean(); // Use .lean() here
}

async deleteUserByEmail(email: string): Promise<void> {
  const result = await this.UserModel.findOneAndDelete({ email }).exec();
  if (!result) {
    throw new NotFoundException(`User with email ${email} not found`);
  }
}
async getChallengesByEmail(email: string): Promise<Challenge[]> {
  const user = await this.UserModel.findOne({ email }).populate('challenges').exec();

  if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
  }

  return user.challenges;
}

}
