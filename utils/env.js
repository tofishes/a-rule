const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';
const isDev = !isProduction;

module.exports = { name: env, isProduction, isDev };
