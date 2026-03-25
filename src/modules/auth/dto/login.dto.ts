import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @MinLength(1)
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  id: string;
}
