import { IsString } from 'class-validator';

export class GetFacebookTokensDto {
  @IsString()
  redirectUri: string;

  @IsString()
  clientId: string;

  @IsString()
  clientSecret: string;

  @IsString()
  code: string;
}
