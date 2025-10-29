const express = require('express')
const { createTemplate,getAllTemplates,viewTemplate,editTemplate,deleteTemplate,
    sendTemplateMessage, 
    getAllLogs ,
    updateTemplateStatus
} = require('../controllers/templateController')

const templateRoute = express.Router();

templateRoute.get('/templates',getAllTemplates)
templateRoute.get('/template/:templateId',viewTemplate)
templateRoute.get('/logs/:templateId',getAllLogs)

templateRoute.post('/create-template',createTemplate)
templateRoute.post('/send-message',sendTemplateMessage)

templateRoute.put('/update-template/:templateId',editTemplate)

templateRoute.patch('/status/:templateId',updateTemplateStatus)

templateRoute.delete('/template/:templateId',deleteTemplate)

module.exports = templateRoute

