import { IsString } from 'class-validator';

export class GetTokensDto {
  @IsString()
  code: string;

  @IsString()
  clientId: string;

  @IsString()
  clientSecret: string;

  @IsString()
  redirectUri: string;
}