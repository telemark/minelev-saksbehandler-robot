'use strict'

const fs = require('fs')
const { QUEUE_DIRECTORY_PATH } = require('../../config')
const { logger } = require('@vtfk/logger')
const isJson = (file) => file.endsWith('.json')

module.exports = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(QUEUE_DIRECTORY_PATH, (error, files) => {
      if (error) {
        logger('error', ['get-next-job-from-queue', 'error', error])
        reject(error)
      } else {
        const file = files.filter(isJson)[0]
        if (file) {
          logger('info', ['get-next-job-from-queue', 'job found', file])
          resolve(file)
        } else {
          logger('info', ['get-next-job-from-queue', 'no jobs found'])
          process.exit(0)
        }
      }
    })
  })
}
