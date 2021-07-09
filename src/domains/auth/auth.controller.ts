import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req, Res, UsePipes } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { BcryptService } from './bcrypt.service';
import { Users } from '../users/users.model';
import { UsersService } from '../users/users.service';
import { TokenService } from './token.service';
import { SchemaValidate } from '../../pipes/schemaValidate';
import { AuthSchema } from './schemas/auth.scheme';
import { API_URL, REDIRECT_TO_FRONT, REDIRECT_URI } from '../../constants';

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

  @Get('/google-sign-up')
  async googleSignUp(@Req() request: Request, @Res() response: Response) {
    const code = request.query.code as string;

    const { id_token, access_token } = await this.authService.getGoogleTokens({
      code,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_CLIENT_ID,
      redirectUri: REDIRECT_URI,
    });

    const googleUser = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        }
      )
      .then((res) => res.data)
      .catch((error) => {
        throw new Error(error.message)
      });

    const token = await this.authService.createUserIfNotAtSystem(googleUser.email);

    response.cookie('auth-cookie', token, {
      maxAge: 900000,
      httpOnly: false,
      secure: false,
    });

    response.redirect(REDIRECT_TO_FRONT());
  }

  @Get('/facebook-sing-up')
  async facebookSignUp(@Req() request: Request, @Res() response: Response) {
    const code = request.query.code as string;
    const { access_token } = await this.authService.getFacebookTokens({
      code,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET_ID,
      clientId: process.env.FACEBOOK_CLIENT_ID,
      redirectUri: `${API_URL}/auth/facebook-sing-up`
    });
    const facebookUser = (await axios.get(`https://graph.facebook.com/me?access_token=${access_token}&fields=email`)).data;
    const token = await this.authService.createUserIfNotAtSystem(facebookUser.email);

    response.cookie('auth-cookie', token, {
      maxAge: 900000,
      httpOnly: false,
      secure: false,
    });

    response.redirect(REDIRECT_TO_FRONT());
  }
}