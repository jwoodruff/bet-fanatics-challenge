import { UsersGender, UsersStatus } from '../entities/user.entity';

export class CreateUserDto {
  name: string;
  email: string;
  gender: UsersGender;
  status: UsersStatus;
}
