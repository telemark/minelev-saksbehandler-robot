if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

module.exports = {
  ARCIVE_DIRECTORY_PATH: process.env.ARCIVE_DIRECTORY_PATH || 'test/directories/archive',
  CALLBACK_DIRECTORY_PATH: process.env.CALLBACK_DIRECTORY_PATH || 'test/directories/callback',
  DISTRIBUTION_DIRECTORY_PATH: process.env.DISTRIBUTION_DIRECTORY_PATH || 'test/directories/distribution',
  DONE_DIRECTORY_PATH: process.env.DONE_DIRECTORY_PATH || 'test/directories/done',
  ERRORS_DIRECTORY_PATH: process.env.ERRORS_DIRECTORY_PATH || 'test/directories/errors',
  NOTIFICATIONS_DIRECTORY_PATH: process.env.NOTIFICATIONS_DIRECTORY_PATH || 'test/directories/notifications',
  NOTIFICATIONS_SERVICE_URL: process.env.NOTIFICATIONS_SERVICE_URL || 'https://echo.mikrotjeneste.win',
  QUEUE_DIRECTORY_PATH: process.env.QUEUE_DIRECTORY_PATH || 'test/directories/queue',
  JWT_SECRET: process.env.JWT_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  DISTRIBUTION_CODE: process.env.DISTRIBUTION_CODE || '1111',
  DISTRIBUTION_LETTER_TYPE: process.env.DISTRIBUTION_LETTER_TYPE || 'BPOST',
  DSF_SERVICE_URL: process.env.DSF_SERVICE_URL || 'https://dsf.micro.tjeneste.win',
  P360_URL: process.env.P360_URL || 'http://tfk-fh-siweb01t.login.top.no:8088/SI.WS.Core/SIF/',
  P360_USER: process.env.P360_USER || 'domain/username',
  P360_PASSWORD: process.env.P360_PASSWORD || 'password',
  PAPERTRAIL_HOSTNAME: process.env.PAPERTRAIL_HOSTNAME || 'minelev-robot',
  PAPERTRAIL_HOST: process.env.PAPERTRAIL_HOST || 'logs.papertrailapp.com',
  PAPERTRAIL_PORT: process.env.PAPERTRAIL_PORT || 12345
}
