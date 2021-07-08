import { IsString } from 'class-validator';

export class GetGoogleTokensDto {
  @IsString()
  code: string;

  @IsString()
  clientId: string;

  @IsString()
  clientSecret: string;

  @IsString()
  redirectUri: string;
}