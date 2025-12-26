import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UserDto } from './dto/user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async findAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }
  createUser(body: UserDto): Promise<User> {
    const users = this.userRepository.create(body);
    return this.userRepository.save(users);
  }
}
