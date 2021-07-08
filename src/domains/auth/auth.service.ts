import { Injectable } from '@nestjs/common';
import * as querystring from 'querystring';
import axios from 'axios';
import { GetGoogleTokensDto } from './dto/getGoogleTokens.dto';
import { GetFacebookTokensDto } from './dto/getFacebookTokens.dto';
import { API_URL } from '../../constants';

@Injectable()
export class AuthService {
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
}