import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { Get, Post, Body } from '@nestjs/common';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private userServices: UsersService) {}
  @Get()
  findAllUsers() {
    return this.userServices.findAllUsers();
  }
  @Post()
  createUser(@Body() body: UserDto) {
    return this.userServices.createUser(body);
  }
}
