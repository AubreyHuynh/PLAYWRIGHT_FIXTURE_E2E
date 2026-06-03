import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

export const config = {
  baseURL: optionalEnv('BASE_URL', 'https://opensource-demo.orangehrmlive.com'),
  apiBaseURL: optionalEnv('API_BASE_URL', optionalEnv('BASE_URL', 'https://opensource-demo.orangehrmlive.com')),

  credentials: {
    get username(): string { return requireEnv('TEST_EMAIL'); },
    get password(): string { return requireEnv('TEST_PASSWORD'); },
  },

  authStatePath: optionalEnv('AUTH_STATE_PATH', '.auth/user.json'),

  timeouts: {
    action: Number(optionalEnv('ACTION_TIMEOUT', '15000')),
    navigation: Number(optionalEnv('NAVIGATION_TIMEOUT', '30000')),
    expect: Number(optionalEnv('EXPECT_TIMEOUT', '10000')),
    global: Number(optionalEnv('GLOBAL_TIMEOUT', '60000')),
  },

  headless: optionalEnv('HEADLESS', 'true') !== 'false',
  isCI: Boolean(process.env.CI),

  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
} as const;
