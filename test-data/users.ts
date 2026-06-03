import type { User } from '../src/types';
import { requireEnv } from '../src/support/config';

export const USERS: Record<string, User> = {
  standard: {
    username: requireEnv('TEST_EMAIL'),
    password: requireEnv('TEST_PASSWORD'),
    name: 'Admin',
  },
  invalidCredentials: {
    username: 'invalid_user_xyz',
    password: 'WrongPassword_xyz_999',
  },
};
