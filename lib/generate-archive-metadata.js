const sanitize = require('sanitize-filename')
const getDocumentTemplate = require('document-templates')
const generateTitle = require('@vtfk/elev-varsel-generate-document-title')
const getSchoolInfo = require('vtfk-schools-info')
const datePadding = require('./date-padding')
const formatRecipients = require('./format-recipients')
const formatRecno = require('./format-recno')
const { logger } = require('@vtfk/logger')
const config = require('../config')

module.exports = input => {
  const now = new Date()
  const date = datePadding(now.getDate()) + '.' + datePadding(now.getMonth() + 1) + '.' + now.getFullYear()
  const data = input.data
  const documentTemplate = getDocumentTemplate({ domain: 'minelev', templateId: data.documentTemplate })
  const template = documentTemplate.archive
  const title = generateTitle(data)
  const unofficialTitle = generateTitle(data, true)
  const schoolInfo = data.schoolOrganizationNumber ? getSchoolInfo({ organizationNumber: data.schoolOrganizationNumber.replace(/\D/g, '') })[0] : ''

  logger('info', ['generate-archive-metadata', data.documentTemplate])

  let meta = {}

  if (!['samtale', 'notat'].includes(data.documentType)) {
    meta = {
      generator: 'add-documents',
      title: title,
      unofficialTitle: unofficialTitle,
      accessCode: template.AccessCode,
      accessGroup: schoolInfo.accessGroup,
      signOff: template.SignOff,
      documentCreated: data.documentDate || date,
      category: template.Category,
      paragraph: template.Paragraph,
      archive: config.P360_DEFAULT_ARCHIVE,
      status: template.Status,
      responsibleEnterpriseNumber: schoolInfo.organizationNumber360,
      responsiblePersonRecno: config.P360_DEFAULT_RESPONSIBLE_PERSON,
      contacts: [
        {
          IsUnofficial: true,
          ReferenceNumber: (data.p360Contact && data.p360Contact.Recno && formatRecno(data.p360Contact.Recno)) || data.recipient.personalIdNumber,
          Role: template.Category === 'Dokument inn' ? 'Avsender' : 'Mottaker'
        }
      ],
      file: {
        title: sanitize(`${title}.pdf`),
        data: input.fileData
      }
    }
    if (data.sendCopyToGuardian && data.recipientCopies && data.recipientCopies.length > 0) {
      const recipients = data.recipientCopies.map(formatRecipients)
      meta.contacts = meta.contacts.concat(recipients)
    }
    if (data.documentCategory === 'yff-bekreftelse-bedrift') {
      meta.contacts = []
      meta.unregisteredContacts = {
        address: data.bedriftsData.adresse,
        name: data.bedriftsData.navn,
        enterpriseNumber: data.bedriftsData.organisasjonsNummer,
        role: 'Mottaker',
        zipCode: data.bedriftsData.postnummer,
        zipPlace: data.bedriftsData.poststed
      }
    }
  } else if (data.documentCategory === 'ikke-samtale') {
    meta = {
      generator: 'add-documents',
      title: title,
      unofficialTitle: unofficialTitle,
      accessCode: template.AccessCode,
      accessGroup: schoolInfo.accessGroup,
      signOff: template.SignOff,
      documentCreated: data.documentDate || date,
      category: template.Category,
      paragraph: template.Paragraph,
      archive: config.P360_DEFAULT_ARCHIVE,
      status: template.Status,
      responsibleEnterpriseNumber: schoolInfo.organizationNumber360,
      responsiblePersonRecno: config.P360_DEFAULT_RESPONSIBLE_PERSON,
      contacts: [
        {
          IsUnofficial: true,
          ReferenceNumber: (data.p360Contact && data.p360Contact.Recno && formatRecno(data.p360Contact.Recno)) || data.recipient.personalIdNumber,
          Role: 'Mottaker'
        }
      ],
      file: {
        title: sanitize(`${title}.pdf`),
        data: input.fileData
      }
    }
  } else if (data.documentType === 'notat') {
    meta = {
      generator: 'add-documents',
      title: 'Lærernotat',
      unofficialTitle: `Lærernotat - ${data.newDocument.student.name}`,
      accessCode: template.AccessCode,
      accessGroup: schoolInfo.accessGroup,
      signOff: template.SignOff,
      documentCreated: data.documentDate || date,
      category: template.Category,
      paragraph: template.Paragraph,
      archive: config.P360_DEFAULT_ARCHIVE_SECURE,
      status: template.Status,
      responsibleEnterpriseNumber: schoolInfo.organizationNumber360,
      responsiblePersonRecno: config.P360_DEFAULT_RESPONSIBLE_PERSON,
      file: {
        title: 'Lærernotat.pdf',
        data: input.fileData
      }
    }
  } else { // this will be samtale
    meta = {
      generator: 'add-documents',
      title: title,
      unofficialTitle: unofficialTitle,
      accessCode: template.AccessCode,
      accessGroup: schoolInfo.accessGroup,
      signOff: template.SignOff,
      documentCreated: data.documentDate || date,
      category: template.Category,
      paragraph: template.Paragraph,
      archive: config.P360_DEFAULT_ARCHIVE,
      status: template.Status,
      responsibleEnterpriseNumber: schoolInfo.organizationNumber360,
      responsiblePersonRecno: config.P360_DEFAULT_RESPONSIBLE_PERSON,
      contacts: [
        {
          IsUnofficial: true,
          ReferenceNumber: schoolInfo.organizationNumber360,
          Role: 'Avsender'
        }
      ],
      file: {
        title: sanitize(`${title}.pdf`),
        data: input.fileData
      }
    }
  }
  return meta
}
