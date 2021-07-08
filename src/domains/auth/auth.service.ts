import { Injectable } from '@nestjs/common';
import { GetTokensDto } from './dto/getTokens.dto';
import * as querystring from 'querystring';
import axios from 'axios';

@Injectable()
export class AuthService {
  getTokens(getTokensDto: GetTokensDto): Promise<GetTokensInterface> {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
      code: getTokensDto.code,
      client_id: getTokensDto.clientId,
      client_secret: getTokensDto.clientSecret,
      redirect_uri: getTokensDto.redirectUri,
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
}