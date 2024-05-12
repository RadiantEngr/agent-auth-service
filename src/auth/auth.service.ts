import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto, AuthResponseDto } from './auth.dto';
import { User } from '../entities/user.entity';
import { compareSync } from 'bcryptjs';
import * as Joi from 'joi';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser({
    username,
    password,
  }: AuthCredentialsDto): Promise<Omit<User, 'password'>> {
    const user: User = await this.userService.findByUsername(username, true);
    if (user && compareSync(password, user.password)) {
      const { password, ...userDto } = user;
      return userDto;
    }
    return null;
  }

  async login(credential: AuthCredentialsDto): Promise<AuthResponseDto> {
    const user: Omit<User, 'password'> = await this.validateUser(credential);
    if (!user) {
      throw new UnauthorizedException('Wrong username or password');
    }
    const access_token = this.jwtService.sign({ user });
    
    return { access_token };
  }

  async register(user: User): Promise<AuthResponseDto> {
    const { error, value } = this.validateUserRequest(user);
    if (error) {
      throw new BadRequestException(error.details[0].message);
    }
    const existedUser = await this.userService.findByUsername(value.username);
    if (existedUser) {
      throw new BadRequestException('Username already existed');
    }
    await this.userService.create(user);
    return this.login({ username: user.username, password: user.password });
  }

  validateUserRequest(user: User) {
    const schema = Joi.object({
      username: Joi.string().email().required(),
      firstName: Joi.string().required(),
      middleName: Joi.string(),
      lastName: Joi.string().required(),
      password: Joi.string().required(),
    });

    return schema.validate(user);
  }
}
