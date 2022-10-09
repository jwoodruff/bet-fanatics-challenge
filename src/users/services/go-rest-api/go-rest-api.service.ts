import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User, UsersSearchFields } from 'src/users/entities/user.entity';

export class GoRestAPIError extends HttpException {
  constructor(message: string, status: number) {
    super(message, status);
    this.message = `${status} ${message}`;
  }
}
@Injectable()
export class GoRestApiService {
  goRestAPIToken: string;
  goRestAPIBaseURL: string;
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.goRestAPIToken = this.configService.get<string>('GO_REST_API_TOKEN');
    this.goRestAPIBaseURL = this.configService.get<string>(
      'GO_REST_API_BASE_URL',
    );
    this.httpService.axiosRef.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${this.goRestAPIToken}`;
      return config;
    });
    this.httpService.axiosRef.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        Logger.error(error);
        if (error.response) {
          throw new GoRestAPIError(
            error.response.statusText,
            error.response.status,
          );
        } else if (error.request || error.response.status == 500) {
          throw new GoRestAPIError('Upstream Error', 502);
        } else {
          throw new GoRestAPIError('Internal Server Error', 500);
        }
      },
    );
  }
  async createUser(newUser: CreateUserDto): Promise<User> {
    const axiosResponse = await lastValueFrom(
      this.httpService.post(`${this.goRestAPIBaseURL}/users`, newUser),
    );
    const user: User = axiosResponse.data;
    return user;
  }
  async deleteUser(userID: User['id']): Promise<boolean> {
    await lastValueFrom(
      this.httpService.delete(`${this.goRestAPIBaseURL}/users/${userID}`),
    );
    return true;
  }
  async fetchUser(userID: User['id']): Promise<User> {
    const axiosResponse = await lastValueFrom(
      this.httpService.get(`${this.goRestAPIBaseURL}/users/${userID}`),
    );
    const user: User = axiosResponse.data;
    return user;
  }
  async fetchUsers(page = 0): Promise<User[]> {
    const params = { page };
    const axiosResponse = await lastValueFrom(
      this.httpService.get(`${this.goRestAPIBaseURL}/users`, {
        params,
      }),
    );
    Logger.log(
      `Total Number of Pages: ${axiosResponse.headers['x-pagination-total']}`,
    );
    const users: User[] = axiosResponse.data;
    return users;
  }
  async searchUsers(
    searchBy: UsersSearchFields,
    value: string,
  ): Promise<User[]> {
    const params = {};
    params[searchBy] = value;
    const axiosResponse = await lastValueFrom(
      this.httpService.get(`${this.goRestAPIBaseURL}/users`, {
        params,
      }),
    );
    const users: User[] = axiosResponse.data;
    return users;
  }
  async updateUser(
    updatedUser: UpdateUserDto,
    userID: User['id'],
  ): Promise<User> {
    const axiosResponse = await lastValueFrom(
      this.httpService.patch(
        `${this.goRestAPIBaseURL}/users/${userID}`,
        updatedUser,
      ),
    );
    const user: User = axiosResponse.data;
    return user;
  }
}
