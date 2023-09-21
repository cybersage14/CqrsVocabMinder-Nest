import * as dotenv from 'dotenv';
import * as fs from 'fs';

enum MODE {
  'develop' = 'develop',
  'staging' = 'staging',
  'production' = 'production',
}
export interface EnvData {
  DB_TYPE: 'postgres';
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  JWT_SECRET_KEY: string;
  MODE: MODE;
}
export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor(filePath: string) {
    this.envConfig = dotenv.parse(fs.readFileSync(filePath));
    for (const property in this.envConfig) {
      if (!this.envConfig[property]) {
        console.log(`"${property}" is not defined`);
        process.exit(0);
      }
    }
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  isEnv(env: string) {
    return this.envConfig.APP_ENV === env;
  }
  isStaging(): boolean {
    return this.envConfig.MODE === 'staging';
  }
  isDev(): boolean {
    return this.envConfig.MODE === 'develop';
  }

  isProd(): boolean {
    return this.envConfig.MODE === 'production';
  }
}