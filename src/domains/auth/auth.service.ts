import { Injectable } from '@nestjs/common';
import * as querystring from 'querystring';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

import { GetGoogleTokensDto } from './dto/getGoogleTokens.dto';
import { GetFacebookTokensDto } from './dto/getFacebookTokens.dto';
import { UsersService } from '../users/users.service';
import { BcryptService } from './bcrypt.service';
import { TokenService } from './token.service';
import { Users } from '../users/users.model';
import { SMTPService } from '../users/SMTP.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService,
              private readonly bcryptService: BcryptService,
              private readonly tokenService: TokenService,
              private readonly smtpService: SMTPService) {}

  getGoogleTokens(getGoogleTokensDto: GetGoogleTokensDto): Promise<GetTokensInterface> {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
      code: getGoogleTokensDto.code,
      client_id: getGoogleTokensDto.clientId,
      client_secret: getGoogleTokensDto.clientSecret,
      redirect_uri: getGoogleTokensDto.redirectUri,
      grant_type: "authorization_code",
    };

    return axios
      .post(url, querystring.stringify(values), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => res.data)
      .catch((error) => {
        console.error(`Failed to fetch auth tokens`);
        throw new Error(error.message);
      });
  }

  getFacebookTokens(getFacebookTokensDto: GetFacebookTokensDto): Promise<GetFacebookTokensInterface> {
    const rootUrl = 'https://graph.facebook.com/oauth/access_token';
    const options = {
      redirect_uri: getFacebookTokensDto.redirectUri,
      client_id: getFacebookTokensDto.clientId,
      client_secret: getFacebookTokensDto.clientSecret,
      code: getFacebookTokensDto.code
    };
    return axios
      .get(`${rootUrl}?${querystring.stringify(options)}`)
      .then((res) => res.data)
      .catch((error) => {
        console.error(`Failed to fetch auth tokens`);
        throw new Error(error.message)
      });
  }
  
  async createUserIfNotAtSystem(email: string): Promise<string> {
    const isUserAlreadyInSystem = await this.usersService.isExistsEmail(email);

    let token = '';

    if(!isUserAlreadyInSystem) {
      const tmpPassword = uuid();
      const cryptResult = await this.bcryptService.encrypt(tmpPassword);
      const userEntity = new Users();

      userEntity.email = email;
      userEntity.password = cryptResult.encryptedPassword;
      userEntity.password_salt = cryptResult.salt;

      const newUserEntity = await this.usersService.saveUser(userEntity);

      token = this.tokenService.createToken(newUserEntity.id);

      this.smtpService.sendMail(`U can enter with this data:\nEmail: ${userEntity.email}\nPassword: ${tmpPassword}`, 'Auth data', userEntity.email);

    } else {
      const userEntity = await this.usersService.getUserByEmail(email);
      token = this.tokenService.createToken(userEntity.id);
    }

    return token;
  }
}