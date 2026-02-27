import { IsEmail, IsOptional, IsString } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  picture?: string
}
