const { logger } = require('@vtfk/logger')
const archiveMetadata = require('../generate-archive-metadata')
const restrictedAddress = require('../laerekontrakt-generate-document-restricted-address')
const generateDocumentData = require('../generate-document-data')
const getError = require('../get-error')

module.exports = async data => {
  logger('info', ['laerekontrakt-setup-documents'])
  // Main document for archive
  const documentData = await generateDocumentData(data)
  const archiveDocument = JSON.parse(JSON.stringify(data.document))
  const archiveMetadataDocument = archiveMetadata({ data: data, fileData: documentData })
  data.documents.push(Object.assign({}, archiveDocument, { archive: true, archiveMetadata: archiveMetadataDocument }))
  logger('info', ['laerekontrakt-setup-documents', 'archiveMetadataDocument added to data.documents'])
  // Will it be distributed
  if (data.sendToDistribution === true) {
    logger('info', ['laerekontrakt-setup-documents', 'distribution needed'])
    data.document.recipients.push(data.recipient)
    const distributionDocument = JSON.parse(JSON.stringify(data.document))
    data.documents.push(Object.assign({}, distributionDocument, { distribution: true, file: archiveMetadataDocument.file }))
  }
  // If we should distribute but can't
  if (data.sendToDistribution === false) {
    logger('info', ['laerekontrakt-setup-documents', 'manual distribution', data.documentTemplate])
    try {
      const document = await restrictedAddress(data)
      data.documents.push(Object.assign({ archive: true, archiveMetadata: document }))
      logger('info', ['laerekontrakt-setup-documents', 'manual distribution', data.documentTemplate, 'document added to data.documents'])
    } catch (error) {
      data.errors.push(getError(error))
      logger('error', ['laerekontrakt-setup-documents', 'manual distribution', data.documentTemplate, error])
    }
  }
  return data
}
