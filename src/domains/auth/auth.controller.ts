import { Body, Controller, Post, UsePipes } from '@nestjs/common';
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
}