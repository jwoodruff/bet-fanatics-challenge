import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GoRestApiService } from './services/go-rest-api/go-rest-api.service';
import { UsersService } from './services/users/users.service';

@Module({
  imports: [HttpModule],
  providers: [UsersService, GoRestApiService],
})
export class UsersModule {}
