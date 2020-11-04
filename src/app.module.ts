import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';


@Module({
  imports: [
    UsersModule,
    AuthModule,
    MongooseModule.forRoot(process.env.MONGO_URI,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
