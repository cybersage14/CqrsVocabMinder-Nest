// https://gist.github.com/joseluisq/b82716f76ab76eee071f53bdd8356530

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
  
  export class EnvService {
    private vars: EnvData;
  
    constructor() {
      this.vars = {
        DB_TYPE: 'postgres',
        DB_HOST: process.env.DB_HOST,
        DB_PORT: +process.env.DB_PORT,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_NAME: process.env.DB_NAME,
        JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
        MODE: process.env.MODE as MODE,
      };
      for (const property in this.vars) {
        if (!this.vars[property]) {
          console.log(`"${property}" is not defined`);
          process.exit(0);
        }
      }
    }
  
    read(): Partial<EnvData> {
      return this.vars;
    }
  
    isDev(): boolean {
      return this.vars.MODE === 'develop';
    }

    isProd(): boolean {
      return this.vars.MODE === 'production';
    }
  
    isStaging(): boolean {
      return this.vars.MODE === 'staging';
    }
  }
  