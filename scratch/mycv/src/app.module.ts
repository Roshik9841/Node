import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { UserController } from './user/user.controller';

@Module({
  imports: [UsersModule, ReportsModule],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
