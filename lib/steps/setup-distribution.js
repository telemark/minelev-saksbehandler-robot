const { v4: uuid } = require('uuid')
const normalizeContact = require('tfk-dsf-normalize-contact')
const generateSvarutTitle = require('tfk-generate-svarut-title')
const filterGuardian = require('../filter-guardian')
const { logger } = require('@vtfk/logger')
const formatSvarUtRecipient = require('../format-svarut-recipient')
const config = require('../../config')

module.exports = async data => {
  logger('info', ['setup-distribution', data.documentTemplate])
  if (data.dsf !== false) {
    const recipients = []
    const distribution = {
      _id: data._id,
      title: generateSvarutTitle(data)
    }
    if (data.needsDistribution === true) {
      logger('info', ['setup-distribution', 'needs distribution', data.documentCategory])
      data.recipient = data.documentCategory !== 'yff-bekreftelse-bedrift' ? normalizeContact(data.dsf.HOV) : data.bedriftsData
      recipients.push(data.recipient)
      data.sendToDistribution = true
    } else {
      logger('info', ['setup-distribution', 'no need for distribution'])
      data.recipient = normalizeContact(data.dsf.HOV)
      data.sendToDistribution = false
    }
    if (data.sendToDistribution === true) {
      if (data.sendCopyToGuardian !== false) {
        const parents = filterGuardian(data.dsf)
        logger('info', ['setup-distribution', 'sendCopyToGuardians', parents.length])
        const normalized = parents.map(normalizeContact)
        data.recipientCopies = normalized
        data.guardiansFound = normalized.length
        data.recipientCopies.forEach(recipient => recipients.push(recipient))
      } else {
        logger('info', ['setup-distribution', 'sendCopyToGuardians', false])
      }
      distribution.recipients = recipients.map(recipient => formatSvarUtRecipient(recipient))

      distribution.shipment = {
        emittingSystem: 'MinElev',
        postingCode: config.DISTRIBUTION_CODE,
        level4login: false,
        encrypted: false,
        digitalDelivery: false
      }

      distribution.printConfiguration = {
        letterType: config.DISTRIBUTION_LETTER_TYPE,
        colorPrint: true,
        duplex: false
      }

      if (data.callbackUrl) {
        distribution.callbackData = {
          _id: uuid(),
          system: 'MinElev',
          jobId: data._id,
          url: data.callbackUrl,
          payload: {
            data: {
              status: 'sent'
            }
          }
        }
      }
    }
    data.distribution = distribution
  } else {
    logger('error', ['setup-distribution', 'missing dsf data'])
  }
  return data
}
