import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from '../../../users/dto/create-user.dto';
import { UpdateUserDto } from '../../../users/dto/update-user.dto';
import {
  User,
  UsersSearchFields,
  UsersSortDirection,
  UsersSortFields,
} from '../../../users/entities/user.entity';
import { GoRestApiService } from '../go-rest-api/go-rest-api.service';

export class UsersServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.message = `UsersServiceError: ${message}`;
  }
}
@Injectable()
export class UsersService {
  constructor(private readonly goRestAPIService: GoRestApiService) { }
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.goRestAPIService.createUser(createUserDto);
      return user;
    } catch (error) {
      Logger.error(error);
      throw new UsersServiceError(error);
    }
  }
  async findAllOnPage(page: number): Promise<User[]> {
    try {
      const users = await this.goRestAPIService.fetchUsers(page);
      return users;
    } catch (error) {
      Logger.error(error);
      throw new UsersServiceError(error);
    }
  }
  async findOne(id: User['id']): Promise<User> {
    try {
      const user = await this.goRestAPIService.fetchUser(id);
      return user;
    } catch (error) {
      Logger.error(error);
      throw new UsersServiceError(error);
    }
  }
  async update(id: User['id'], updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.goRestAPIService.updateUser(updateUserDto, id);
      return user;
    } catch (error) {
      Logger.error(error);
    }
  }
  async remove(id: User['id']): Promise<boolean> {
    try {
      const response = await this.goRestAPIService.deleteUser(id);
      return response;
    } catch (error) {
      Logger.error(error);
      throw new UsersServiceError(error);
    }
  }
  async search(field: UsersSearchFields, value: string): Promise<User[]> {
    try {
      const user = await this.goRestAPIService.searchUsers(field, value);
      return user;
    } catch (error) {
      throw new UsersServiceError(error);
    }
  }
  sort(
    users: User[],
    field: UsersSortFields,
    direction: UsersSortDirection,
  ): User[] {
    if (direction == UsersSortDirection.desc) {
      users.sort((a, b) =>
        a[field] > b[field] ? -1 : a[field] < b[field] ? 1 : 0,
      );
    } else {
      users.sort((a, b) =>
        a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0,
      );
    }
    return users;
  }
}
