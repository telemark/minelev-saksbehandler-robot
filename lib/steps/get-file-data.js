const { QUEUE_DIRECTORY_PATH } = require('../../config')
const { logConfig, logger } = require('@vtfk/logger')

module.exports = file => {
  return new Promise((resolve, reject) => {
    const filePath = `../../${QUEUE_DIRECTORY_PATH}/${file}`
    logger('info', ['get-file-data', filePath])
    const data = require(filePath)
    if (data) {
      logConfig({ prefix: data._id })
      logger('info', ['get-file-data', 'data found'])
      resolve(data)
    } else {
      const error = new Error('File not found')
      logger('error', ['get-file-data', 'error', error])
      reject(error)
    }
  })
}
