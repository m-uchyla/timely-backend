import { SetMetadata } from '@nestjs/common';

export enum Role {
  ADMIN = 'admin',
  OWNER = 'owner',
  USER = 'user',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]): ReturnType<typeof SetMetadata> =>
  SetMetadata(ROLES_KEY, roles);

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = (): ReturnType<typeof SetMetadata> => SetMetadata(IS_PUBLIC_KEY, true);
