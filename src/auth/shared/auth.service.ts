import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from './../../users/shared/users.service'

@Injectable()
export class AuthService { 


    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }


    async validateUser(userEmail: string, userPassword: string) {
        const user = await this.usersService.getByEmail(userEmail)
        const valid = await bcrypt.compare(userPassword, user.password);
        if (user && valid){
            const {_id, name, email, tokenTrello, keyTrello} = user
            return {id: _id, name, email, tokenTrello, keyTrello}
        }

        return null
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id}
        return {
            acess_token: this.jwtService.sign(payload)
        }
    }
}
