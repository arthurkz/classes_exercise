import { IsString, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
    @IsString()
    @MinLength(2)
    @MaxLength(40)
    name: string;

    @IsString()
    @MinLength(4)
    @MaxLength(40)
    email: string;

    @IsString()
    @MinLength(1, { message: 'Password is too short (8 characters min)' })
    @MaxLength(20, { message: 'Password is too long (20 characters max)' })
    password: string;

    @IsString()
    @MinLength(32)
    @MaxLength(32)
    keyTrello: string;

    @IsString()
    @MinLength(64)
    @MaxLength(64)
    tokenTrello: string;
}