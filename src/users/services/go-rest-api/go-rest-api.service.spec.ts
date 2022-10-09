// import { HttpModule, HttpService } from '@nestjs/axios';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { CreateUserDto } from '../../../users/dto/create-user.dto';
import {
  User,
  UsersGender,
  UsersSearchFields,
  UsersStatus,
} from '../../../users/entities/user.entity';

import { GoRestAPIError, GoRestApiService } from './go-rest-api.service';
const mockCreateUserDto: CreateUserDto = {
  email: 'bob_smith@fakeemail.info',
  name: 'Bob Smith',
  gender: UsersGender.male,
  status: UsersStatus.active,
};
const mockUserEntity: User = { ...mockCreateUserDto, id: 4130 };
describe('GoRestApiService', () => {
  let service: GoRestApiService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        GoRestApiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'GO_REST_API_TOKEN') {
                return '1a2b3c';
              }
              if (key === 'GO_REST_API_BASE_URL') {
                return 'https://www.test.com/api/v2';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<GoRestApiService>(GoRestApiService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined with proper config values', () => {
    expect(service).toBeDefined();
    expect(configService).toBeDefined();
    expect(httpService).toBeDefined();
    expect(service.goRestAPIBaseURL).toEqual('https://www.test.com/api/v2');
    expect(service.goRestAPIToken).toEqual('1a2b3c');
  });
  it('createUser should POST and return User entity (SUCCESS)', async () => {
    const mockResponse: AxiosResponse<any> = {
      data: { ...mockUserEntity },
      headers: {},
      config: { url: 'http://localhost:3000/mockUrl' },
      status: 200,
      statusText: 'OK',
    };
    const spy = jest
      .spyOn(httpService, 'post')
      .mockImplementationOnce(() => of(mockResponse));
    const response = await service.createUser(mockCreateUserDto);
    expect(spy).toHaveBeenCalled();
    expect(response).toEqual(mockUserEntity);
  });
  it('createUser should POST, catch/log error, and throw GoRestAPIError', async () => {
    const mockResponse: AxiosResponse<any> = {
      data: null,
      headers: {},
      config: { url: 'http://localhost:3000/mockUrl' },
      status: 500,
      statusText: 'BAD',
    };
    const postSpy = jest
      .spyOn(httpService, 'post')
      .mockImplementationOnce(() => of(mockResponse));
    const logSpy = jest.spyOn(Logger, 'error').mockImplementationOnce(() => {
      return;
    });
    try {
      await service.createUser(mockCreateUserDto);
    } catch (e) {
      expect(e).toBeInstanceOf(GoRestAPIError);
      expect(postSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalled();
    }
  });
  it('deleteUser should DELETE and return true (SUCCESS)', async () => {
    const mockResponse: AxiosResponse<any> = {
      data: '',
      headers: {},
      config: { url: 'http://localhost:3000/mockUrl' },
      status: 201,
      statusText: 'OK',
    };
    const spy = jest
      .spyOn(httpService, 'delete')
      .mockImplementationOnce(() => of(mockResponse));
    const response = await service.deleteUser(mockUserEntity.id);
    expect(spy).toHaveBeenCalled();
    expect(response).toEqual(true);
  });
  it('deleteUser should POST, catch/log error, and throw GoRestAPIError', async () => {
    const mockResponse: AxiosResponse<any> = {
      data: null,
      headers: {},
      config: { url: 'http://localhost:3000/mockUrl' },
      status: 500,
      statusText: 'BAD',
    };
    const postSpy = jest
      .spyOn(httpService, 'delete')
      .mockImplementationOnce(() => of(mockResponse));
    const logSpy = jest.spyOn(Logger, 'error').mockImplementationOnce(() => {
      return;
    });
    try {
      await service.deleteUser(mockUserEntity.id);
    } catch (e) {
      expect(e).toBeInstanceOf(GoRestAPIError);
      expect(postSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalled();
    }
  });
  it('fetchUser should GET and return User entity (SUCCESS)', async () => {
    const mockResponse: AxiosResponse<any> = {
      data: { ...mockUserEntity },
      headers: {},
      config: { url: 'http://localhost:3000/mockUrl' },
      status: 200,
      statusText: 'OK',
    };
    const spy = jest
      .spyOn(httpService, 'get')
      .mockImplementationOnce(() => of(mockResponse));
    const response = await service.fetchUser(mockUserEntity.id);
    expect(spy).toHaveBeenCalled();
    expect(response).toEqual(mockUserEntity);
  });
  it('fetchUser should GET, catch/log error, and throw GoRestAPIError', async () => {
    const mockResponse: AxiosResponse<any> = {
      data: null,
      headers: {},
      config: { url: 'http://localhost:3000/mockUrl' },
      status: 404,
      statusText: 'NOT FOUND',
    };
    const postSpy = jest
      .spyOn(httpService, 'get')
      .mockImplementationOnce(() => of(mockResponse));
    const logSpy = jest.spyOn(Logger, 'error').mockImplementationOnce(() => {
      return;
    });
    try {
      await service.fetchUser(mockUserEntity.id);
    } catch (e) {
      expect(e).toBeInstanceOf(GoRestAPIError);
      expect(postSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalled();
    }
  });
  it('fetchUsers should GET and return User entity (SUCCESS)', async () => {
    const mockResponse: AxiosResponse<any> = {
      data: [{ ...mockUserEntity }],
      headers: {},
      config: { url: 'http://localhost:3000/mockUrl' },
      status: 200,
      statusText: 'OK',
    };
    const spy = jest
      .spyOn(httpService, 'get')
      .mockImplementationOnce(() => of(mockResponse));
    const response = await service.fetchUsers(3);
    expect(spy).toHaveBeenCalled();
    expect(response).toEqual([mockUserEntity]);
  });
  it('fetchUsers should GET, catch/log error, and throw GoRestAPIError', async () => {
    const mockResponse: AxiosResponse<any> = {
      data: null,
      headers: {},
      config: { url: 'http://localhost:3000/mockUrl' },
      status: 404,
      statusText: 'NOT FOUND',
    };
    const postSpy = jest
      .spyOn(httpService, 'get')
      .mockImplementationOnce(() => of(mockResponse));
    const logSpy = jest.spyOn(Logger, 'error').mockImplementationOnce(() => {
      return;
    });
    try {
      await service.fetchUsers(30000);
    } catch (e) {
      expect(e).toBeInstanceOf(GoRestAPIError);
      expect(postSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalled();
    }
  });
  it('searchUsers should GET and return User entity (SUCCESS)', async () => {
    const mockResponse: AxiosResponse<any> = {
      data: [{ ...mockUserEntity }],
      headers: {},
      config: { url: 'http://localhost:3000/mockUrl' },
      status: 200,
      statusText: 'OK',
    };
    const spy = jest
      .spyOn(httpService, 'get')
      .mockImplementationOnce(() => of(mockResponse));
    const response = await service.searchUsers(
      UsersSearchFields.name,
      'Bob Smith',
    );
    expect(spy).toHaveBeenCalled();
    expect(response).toEqual([mockUserEntity]);
  });
  it('searchUsers should GET, catch/log error, and throw GoRestAPIError', async () => {
    const mockResponse: AxiosResponse<any> = {
      data: null,
      headers: {},
      config: { url: 'http://localhost:3000/mockUrl' },
      status: 500,
      statusText: 'BAD',
    };
    const postSpy = jest
      .spyOn(httpService, 'get')
      .mockImplementationOnce(() => of(mockResponse));
    const logSpy = jest.spyOn(Logger, 'error').mockImplementationOnce(() => {
      return;
    });
    try {
      await service.searchUsers(UsersSearchFields.name, 'Bob Smith');
    } catch (e) {
      expect(e).toBeInstanceOf(GoRestAPIError);
      expect(postSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalled();
    }
  });
  it('updateUser should PATCH and return User entity (SUCCESS)', async () => {
    const mockUpdatedUser: User = Object.assign({}, mockUserEntity);
    mockUpdatedUser.name = 'Bob Allen';
    const mockResponse: AxiosResponse<any> = {
      data: { ...mockUpdatedUser },
      headers: {},
      config: { url: 'http://localhost:3000/mockUrl' },
      status: 200,
      statusText: 'OK',
    };
    const spy = jest
      .spyOn(httpService, 'patch')
      .mockImplementationOnce(() => of(mockResponse));
    const response = await service.updateUser(
      mockUpdatedUser,
      mockUserEntity.id,
    );
    expect(spy).toHaveBeenCalled();
    expect(response).toEqual(mockUpdatedUser);
  });
  it('updateUser should PATCH, catch/log error, and throw GoRestAPIError', async () => {
    const mockUpdatedUser: UpdateUserDto = Object.assign({}, mockCreateUserDto);
    mockUpdatedUser.name = 'Bob Allen';
    const mockResponse: AxiosResponse<any> = {
      data: null,
      headers: {},
      config: { url: 'http://localhost:3000/mockUrl' },
      status: 500,
      statusText: 'BAD',
    };
    const postSpy = jest
      .spyOn(httpService, 'patch')
      .mockImplementationOnce(() => of(mockResponse));
    const logSpy = jest.spyOn(Logger, 'error').mockImplementationOnce(() => {
      return;
    });
    try {
      await service.updateUser(mockUpdatedUser, mockUserEntity.id);
    } catch (e) {
      expect(e).toBeInstanceOf(GoRestAPIError);
      expect(postSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalled();
    }
  });
});
