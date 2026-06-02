import type { User } from '../src/types';

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const USERS: Record<string, User> = {
  standard: {
    email: requireEnv('TEST_EMAIL'),
    password: requireEnv('TEST_PASSWORD'),
    name: 'Admin',
  },
  admin: {
    email: requireEnv('ADMIN_EMAIL'),
    password: requireEnv('ADMIN_PASSWORD'),
    name: 'Admin',
  },
  invalidCredentials: {
    email: 'invalid_user_xyz',
    password: 'WrongPassword_xyz_999',
  },
};
