import { Snowflake } from '@sapphire/snowflake';

const epoch = new Date(process.env.SNOWFLAKE_EPOCH || '2026-01-05T00:00:00.000Z');
const snowflake = new Snowflake(epoch);

export const generateSnowflake = () => {
  return snowflake.generate().toString();
};
