import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  UsersSortDirection,
  UsersSortFields,
} from './users/entities/user.entity';
import { UsersService } from './users/services/users/users.service';
import { UsersModule } from './users/users.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const usersService = app
      .select(UsersModule)
      .get(UsersService, { strict: true });

    const users = await usersService.findAllOnPage(3);
    let sortedUsers = [...users];
    sortedUsers = usersService.sort(
      sortedUsers,
      UsersSortFields.name,
      UsersSortDirection.asc,
    );
    let updatedUser = sortedUsers[users.length - 1];
    const userID = updatedUser.id;
    Logger.log(
      `Last name in sorted list: ${JSON.stringify(updatedUser.name, null, 2)}`,
    );
    updatedUser.name = 'Bob Smith';
    updatedUser = await usersService.update(userID, updatedUser);
    Logger.log(`Updated user: ${JSON.stringify(updatedUser, null, 2)}`);
    Logger.log(`Deleted user response: ${await usersService.remove(userID)}`);
    await usersService.findOne(5555);
  } catch (error) {
    Logger.error(error);
  }
  Logger.log('Process complete.');
  await app.close();
}
bootstrap();
