export enum UsersStatus {
  active = 'active',
  inactive = 'inactive',
}
export enum UsersGender {
  male = 'male',
  female = 'female',
}

export class User {
  id: number;
  name: string;
  email: string;
  gender: UsersGender;
  status: UsersStatus;
}

export enum UsersSearchFields {
  name = 'name',
  email = 'email',
  gender = 'gender',
  status = 'status',
}

export enum UsersSortFields {
  id = 'id',
  name = 'name',
  email = 'email',
  gender = 'gender',
  status = 'status',
}

export enum UsersSortDirection {
  asc = 'asc',
  desc = 'desc',
}
