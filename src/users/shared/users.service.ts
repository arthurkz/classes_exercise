import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from './user'
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './../../auth/dto/auth-credentials.dto';

@Injectable()
export class UsersService { 

    constructor(@InjectModel('User') private readonly userModel: Model<User>){ }

    async getAll() {
        return await this.userModel.find().exec()
    }

    async getById(id: string) {
        return await this.userModel.findById(id).exec()
    } 

    async getByEmail(email: string) {
        return await this.userModel.findOne({email}).exec()
    }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const {name, email, password, keyTrello, tokenTrello } = authCredentialsDto;
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const user = new this.userModel({name, email, password: hashedPassword, keyTrello, tokenTrello});
    
        try {
          await user.save();
        } catch (error) {
          if (error.code === 11000) {
            throw new ConflictException('User already exists');
          }
          alert("Verifique se o token/key foi inserido de forma correta!")
          throw error;
        }
      }

    async update(id: string, user: User){
        await this.userModel.updateOne({_id:id}, User).exec()
        return this.getById(id)
    }




}
