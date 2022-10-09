import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserServiceModule } from './user-service/user-service.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
      MongooseModule.forRoot('mongodb+srv://tkuku:Messi911@userservice.5gbk9dq.mongodb.net/?retryWrites=true&w=majority'),
      UserServiceModule,
      ConfigModule.forRoot({
          isGlobal: true,
      })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
