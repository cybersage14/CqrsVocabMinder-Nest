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
    API_KEY: string;
    HEARTBEAT_TIMEOUT_SECONDS: number;
    WAITING_FOR_BARCODE_TIMEOUT_SECONDS: number;
    DEFAULT_USER_PASSWORD: string;
    GENERATE_MOCK_DATA: boolean;
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: number;
    SEND_SMS: boolean;
    SMS_USERNAME: string;
    SMS_PASSWORD: string;
    SMS_FROM_NUMBER: string;
    SMS_INVITATION_ADMIN_PATTERN_CODE: string;
    SMS_INVITATION_COURIER_PATTERN_CODE: string;
    SMS_REGISTRATION_CUSTOMER_VERIFICATION_CODE: string;
    SMS_FORGET_PASSWORD_VERIFICATION_CODE: string;
    SMS_START_DELIVERY_CHAIN_PATTERN_CODE: string;
    SMS_COURIER_DELAY_PATTERN_CODE: string;
    NESHAN_API_KEY: string;
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
        API_KEY: process.env.API_KEY,
        HEARTBEAT_TIMEOUT_SECONDS: +process.env.HEARTBEAT_TIMEOUT_SECONDS,
        WAITING_FOR_BARCODE_TIMEOUT_SECONDS:
          +process.env.WAITING_FOR_BARCODE_TIMEOUT_SECONDS,
        DEFAULT_USER_PASSWORD: process.env.DEFAULT_USER_PASSWORD,
        GENERATE_MOCK_DATA: Boolean(process.env.GENERATE_MOCK_DATA),
        PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD:
          +process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD,
        SEND_SMS: Boolean(process.env.SEND_SMS),
        SMS_USERNAME: process.env.SMS_USERNAME,
        SMS_PASSWORD: process.env.SMS_PASSWORD,
        SMS_FROM_NUMBER: process.env.SMS_FROM_NUMBER,
        SMS_INVITATION_ADMIN_PATTERN_CODE:
          process.env.SMS_INVITATION_ADMIN_PATTERN_CODE,
        SMS_INVITATION_COURIER_PATTERN_CODE:
          process.env.SMS_INVITATION_COURIER_PATTERN_CODE,
        SMS_REGISTRATION_CUSTOMER_VERIFICATION_CODE:
          process.env.SMS_REGISTRATION_CUSTOMER_VERIFICATION_CODE,
        SMS_FORGET_PASSWORD_VERIFICATION_CODE:
          process.env.SMS_FORGET_PASSWORD_VERIFICATION_CODE,
        SMS_START_DELIVERY_CHAIN_PATTERN_CODE:
          process.env.SMS_START_DELIVERY_CHAIN_PATTERN_CODE,
        SMS_COURIER_DELAY_PATTERN_CODE:
          process.env.SMS_COURIER_DELAY_PATTERN_CODE,
        NESHAN_API_KEY: process.env.NESHAN_API_KEY,
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
  
    isSendSms(): boolean {
      return this.vars.SEND_SMS === true;
    }
  
    isProd(): boolean {
      return this.vars.MODE === 'production';
    }
  
    isStaging(): boolean {
      return this.vars.MODE === 'staging';
    }
  }
  