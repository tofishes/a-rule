const defaultEnv = process.env.NODE_ENV || 'development';

function getEnv(name = defaultEnv) {
  const isProduction = name === 'production';
  const isDev = !isProduction;

  return { name, isProduction, isDev, getEnv };
}

const env = getEnv();

module.exports = env;
