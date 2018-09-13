import forOwn from 'lodash/forOwn'
import dotenv from 'dotenv'
dotenv.config()

global.__DEV__ = process.env.__DEV__

let config = {
  jwtSecret: 'simply_secret',
  tokenExpiration: '1 year',
  tokenRenewDelay: 2,
  bcryptSaltRounds: 10,
  bodyLimit: '100kb',
  corsHeaders: ['Link'],
  logLevel: 'DEBUG',
  hostname: 'localhost',
  port: __DEV__ ? 8080 : 80, // 443
  userPassword: 'password',
  /* here only initialization - these keys usually contain sensitive data and they should be set in .env file */
  stackdriverProjectId: '',
  GOOGLE_APPLICATION_CREDENTIALS: ''
}

forOwn(config, (val, key) => {
  config[key] = process.env[key] || config[key]
})

export default config
