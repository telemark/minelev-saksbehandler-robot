'use strict'

const saveFile = require('../save-file')
const { logger } = require('@vtfk/logger')
const config = require('../../config')

module.exports = async data => {
  logger('info', ['save-to-distribution'])
  if (data.errors.length === 0 && data.sendToDistribution === true && data.distribution) {
    logger('info', ['save-to-distribution', 'no errors', 'saving to distribution'])
    data.distribution.documents = data.documents.filter(document => document.distribution === true)
    const fileName = `${config.DISTRIBUTION_DIRECTORY_PATH}/${data._id}.json`
    await saveFile({ filePath: fileName, data: data.distribution })
  } else {
    if (data.sendToDistribution === false || !data.distribution) {
      logger('info', ['save-to-distribution', 'nothing to distribute'])
    } else {
      logger('warn', ['save-to-distribution', 'errors', data.errors.length])
    }
  }
  return data
}
