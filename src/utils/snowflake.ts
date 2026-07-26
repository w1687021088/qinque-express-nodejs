import { Snowflake } from '@sapphire/snowflake';
import { appEnvConfig } from '@/env/index.js';

const epoch = new Date(appEnvConfig.snowflakeEpoch);
const snowflake = new Snowflake(epoch);

export const generateSnowflake = () => {
  return snowflake.generate().toString();
};
