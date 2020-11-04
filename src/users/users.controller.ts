import { User } from './shared/user'
import { Body, Controller, Get, Param, Post, Put , ValidationPipe} from '@nestjs/common';
import { UsersService } from './shared/users.service';
import { AuthCredentialsDto } from './../auth/dto/auth-credentials.dto';


@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService
    ) { }
    
    @Get()
    async getAll(): Promise<User[]> {
        return this.usersService.getAll()
    }

    @Get(':id')
    async getById(@Param('id') id: string): Promise<User> {
        return this.usersService.getById(id)
    }

    @Post()
    async signUp(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
      ): Promise<void> {
        return await this.usersService.signUp(authCredentialsDto);
      }

    @Put(':id')
    async update(@Param('id') id: string, @Body() user: User): Promise<User> {
        return this.usersService.update(id, user)
    }


 }
