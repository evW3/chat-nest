import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { BcryptService } from './bcrypt.service';
import { Users } from '../users/users.model';
import { UsersService } from '../users/users.service';
import { TokenService } from './token.service';
import { SchemaValidate } from '../../pipes/schemaValidate';
import { AuthSchema } from './schemas/auth.scheme';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
              private readonly bcryptService: BcryptService,
              private readonly usersService: UsersService,
              private readonly tokenService: TokenService) {}

  @Post('sign-up')
  @UsePipes(new SchemaValidate(AuthSchema))
  async signUp(@Body() userDto: AuthDto) {
    const cryptResult = await this.bcryptService.encrypt(userDto.password);
    const userEntity = new Users();

    userEntity.email = userDto.email;
    userEntity.password = cryptResult.encryptedPassword;
    userEntity.password_salt = cryptResult.salt;

    const newUserEntity = await this.usersService.saveUser(userEntity);
    const token = this.tokenService.createToken(newUserEntity.id);

    return { token };
  }

  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() userDto: AuthDto) {
    const userEntity = await this.usersService.getUserByEmail(userDto.email);
    const encryptedPassword = await this.bcryptService.encryptBySalt(userDto.password, userEntity.password_salt);
    const isUserValid = userEntity.password === encryptedPassword;

    if(isUserValid) {
      const token = this.tokenService.createToken(userEntity.id);
      return { token };
    } else {
      throw new HttpException('Email or password isn`t correct', HttpStatus.BAD_REQUEST);
    }
  }
}