import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { throwError } from 'rxjs';
import { CreateUserDto } from '../../../users/dto/create-user.dto';
import { User, UsersGender, UsersSearchFields, UsersSortDirection, UsersSortFields, UsersStatus } from '../../../users/entities/user.entity';
import { GoRestAPIError, GoRestApiService } from '../go-rest-api/go-rest-api.service';
import { UsersService, UsersServiceError } from './users.service';
const mockCreateUserDto: CreateUserDto = {
  email: 'bob_smith@fakeemail.info',
  name: 'Bob Smith',
  gender: UsersGender.male,
  status: UsersStatus.active,
};
const mockUserEntity: User = { ...mockCreateUserDto, id: 4130 };
describe('UsersService', () => {
  let service: UsersService;
  let goRestAPIService: GoRestApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [GoRestApiService, ConfigService, UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    goRestAPIService = module.get<GoRestApiService>(GoRestApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(goRestAPIService).toBeDefined();
  });
  it('create should call GoRestAPIService.createUser and return User entity (SUCCESS)', async () => {
    const mockResponse: User = { ...mockUserEntity };
    const spy = jest
      .spyOn(goRestAPIService, 'createUser')
      .mockResolvedValueOnce(mockResponse);
    const response = await service.create(mockCreateUserDto);
    expect(spy).toHaveBeenCalled();
    expect(response).toEqual(mockUserEntity);
  });
  it('create should call GoRestAPIService.createUser, catch error, and throw UsersServiceError', async () => {
    const spy = jest.spyOn(goRestAPIService, 'createUser').mockRejectedValueOnce(() => {
      return throwError(() => new GoRestAPIError('BAD', 500));
    });
    try {
      await service.create(mockCreateUserDto);
    } catch (e) {
      expect(e).toBeInstanceOf(UsersServiceError);
      expect(spy).toHaveBeenCalled();
    }
  });
  it('findAllOnPage should call GoRestAPIService.fetchUsers and return User entity (SUCCESS)', async () => {
    const mockResponse: User[] = [{ ...mockUserEntity }];
    const spy = jest
      .spyOn(goRestAPIService, 'fetchUsers')
      .mockResolvedValueOnce(mockResponse);
    const response = await service.findAllOnPage(3);
    expect(spy).toHaveBeenCalled();
    expect(response).toEqual([mockUserEntity]);
  });
  it('findAllOnPage should call GoRestAPIService.fetchUsers, catch error, and throw UsersServiceError', async () => {
    const spy = jest.spyOn(goRestAPIService, 'fetchUsers').mockRejectedValueOnce(() => {
      return throwError(() => new GoRestAPIError('BAD', 500));
    });
    try {
      await service.findAllOnPage(30000);
    } catch (e) {
      expect(e).toBeInstanceOf(UsersServiceError);
      expect(spy).toHaveBeenCalled();
    }
  });
  it('findOne should call GoRestAPIService.fetchUser and return User entity (SUCCESS)', async () => {
    const mockResponse: User = { ...mockUserEntity };
    const spy = jest
      .spyOn(goRestAPIService, 'fetchUser')
      .mockResolvedValueOnce(mockResponse);
    const response = await service.findOne(mockUserEntity.id);
    expect(spy).toHaveBeenCalled();
    expect(response).toEqual(mockUserEntity);
  });
  it('findOne should call GoRestAPIService.fetchUser, catch error, and throw UsersServiceError', async () => {
    const spy = jest.spyOn(goRestAPIService, 'fetchUser').mockRejectedValueOnce(() => {
      return throwError(() => new GoRestAPIError('BAD', 500));
    });
    try {
      await service.findOne(30000);
    } catch (e) {
      expect(e).toBeInstanceOf(UsersServiceError);
      expect(spy).toHaveBeenCalled();
    }
  });
  it('update should call GoRestAPIService.updateUser and return User entity (SUCCESS)', async () => {
    const mockUpdatedUser: User = Object.assign({}, mockUserEntity);
    mockUpdatedUser.name = 'Bob Allen';
    const mockResponse: User = { ...mockUpdatedUser };
    const spy = jest
      .spyOn(goRestAPIService, 'updateUser')
      .mockResolvedValueOnce(mockResponse);
    const response = await service.update(mockUpdatedUser.id, mockUpdatedUser);
    expect(spy).toHaveBeenCalled();
    expect(response).toEqual(mockUpdatedUser);
  });
  it('update should call GoRestAPIService.updateUser, catch error, and throw UsersServiceError', async () => {
    const mockUpdatedUser: User = Object.assign({}, mockUserEntity);
    mockUpdatedUser.name = 'Bob Allen';
    const spy = jest.spyOn(goRestAPIService, 'updateUser').mockRejectedValueOnce(() => {
      return throwError(() => new GoRestAPIError('BAD', 500));
    });
    try {
      await service.update(mockUpdatedUser.id, mockUpdatedUser);
    } catch (e) {
      expect(e).toBeInstanceOf(UsersServiceError);
      expect(spy).toHaveBeenCalled();
    }
  });
  it('remove should call GoRestAPIService.deleteUser and return true (SUCCESS)', async () => {
    const spy = jest
      .spyOn(goRestAPIService, 'deleteUser')
      .mockResolvedValueOnce(true);
    const response = await service.remove(mockUserEntity.id);
    expect(spy).toHaveBeenCalled();
    expect(response).toEqual(true);
  });
  it('remove should call GoRestAPIService.deleteUser, catch error, and throw UsersServiceError', async () => {
    const spy = jest.spyOn(goRestAPIService, 'deleteUser').mockRejectedValueOnce(() => {
      return throwError(() => new GoRestAPIError('BAD', 500));
    });
    try {
      await service.remove(30000);
    } catch (e) {
      expect(e).toBeInstanceOf(UsersServiceError);
      expect(spy).toHaveBeenCalled();
    }
  });
  it('search should call GoRestAPIService.searchUsers and return User entity (SUCCESS)', async () => {
    const mockResponse: User[] = [{ ...mockUserEntity }];
    const spy = jest
      .spyOn(goRestAPIService, 'searchUsers')
      .mockResolvedValueOnce(mockResponse);
    const response = await service.search(UsersSearchFields.name, "Bob Smith");
    expect(spy).toHaveBeenCalled();
    expect(response).toEqual([mockUserEntity]);
  });
  it('search should call GoRestAPIService.searchUsers, catch error, and throw UsersServiceError', async () => {
    const spy = jest.spyOn(goRestAPIService, 'searchUsers').mockRejectedValueOnce(() => {
      return throwError(() => new GoRestAPIError('BAD', 500));
    });
    try {
      await service.search(UsersSearchFields.name, "Bob Smith");
    } catch (e) {
      expect(e).toBeInstanceOf(UsersServiceError);
      expect(spy).toHaveBeenCalled();
    }
  });
  it('sort should return properly sorted array asc', async () => {
    const users: User[] = [
      {
        email: 'alvin@alvin.com',
        name: 'Alvin',
        gender: UsersGender.male,
        status: UsersStatus.active,
        id: 4130
      },
      {
        email: 'zoro@zoro.com',
        name: 'Zoro',
        gender: UsersGender.female,
        status: UsersStatus.inactive,
        id: 4131
      }
    ]
    const response = await service.sort(users, UsersSortFields.name, UsersSortDirection.asc);
    expect(response[0]).toEqual(users[0]);
  });
  it('sort should return properly sorted array desc', async () => {
    const usersPreSort: User[] = [
      {
        email: 'alvin@alvin.com',
        name: 'Alvin',
        gender: UsersGender.male,
        status: UsersStatus.active,
        id: 4130
      },
      {
        email: 'zoro@zoro.com',
        name: 'Zoro',
        gender: UsersGender.female,
        status: UsersStatus.inactive,
        id: 4131
      }
    ]
    let usersPostSort = [...usersPreSort]
    usersPostSort = await service.sort(usersPostSort, UsersSortFields.name, UsersSortDirection.desc);
    expect(usersPostSort[0]).toEqual(usersPreSort[1]);
  });
});

