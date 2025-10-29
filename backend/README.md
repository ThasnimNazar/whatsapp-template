#Template API Documentation

This README provides documentation for the Template Management API endpoints with cURL examples.

#Base URL Backend
http://localhost:5000/api

#frontend url
http://localhost:5173

#Installation & Setup

#1.Install dependencies:
npm i (both frontend and backend)

#3. Start the server:
npm run dev(both frontend and backend concurrently)

#API Endpoints

#1. Get All Templates
Retrieve a list of all templates.

Endpoint:`GET /templates`

cURL Request:
curl -X GET http://localhost:3000/api/templates

#2. Get Template by ID
View details of a specific template.

Endpoint: `GET /template/:templateId`

cURL Request:
curl -X GET http://localhost:3000/api/template/TEMPLATE_ID_HERE

curl -X GET http://localhost:3000/api/template/12345

#3. Get Template Logs
Retrieve all logs for a specific template.

Endpoint: `GET /logs/:templateId`

cURL Request:
bash
curl -X GET http://localhost:3000/api/logs/TEMPLATE_ID_HERE

Example:
curl -X GET http://localhost:3000/api/logs/12345

#4. Create Template
Create a new template.

Endpoint: `POST /create-template`

cURL Request:
bash
curl -X POST http://localhost:3000/api/create-template \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Welcome Template",
    "content": "Hello {{name}}, welcome to our service!",
    "language": "en",
    "category": "MARKETING"
  }'

#5. Send Template Message
Send a message using a template.

Endpoint: `POST /send-message`

cURL Request:
curl -X POST http://localhost:3000/api/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "12345",
    "recipient": "+1234567890",
    "parameters": {
      "name": "John Doe"
    }
  }'
```

---

### 6. Update Template
Edit an existing template.

**Endpoint:** `PUT /update-template/:templateId`

**cURL Request:**
```bash
curl -X PUT http://localhost:3000/api/update-template/TEMPLATE_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Welcome Template",
    "content": "Hi {{name}}, thanks for joining us!",
    "language": "en"
  }'
```

Example:
curl -X PUT http://localhost:3000/api/update-template/12345 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Welcome Template",
    "content": "Hi {{name}}, thanks for joining us!"
  }'


#7. Update Template Status
Change the status of a template (e.g., active/inactive).

Endpoint: `PATCH /status/:templateId`

cURL Request:
curl -X PATCH http://localhost:3000/api/status/TEMPLATE_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "status": "active"
  }'

Example:
curl -X PATCH http://localhost:3000/api/status/12345 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "inactive"
  }'

#8. Delete Template
Delete a specific template.

Endpoint: `DELETE /template/:templateId`

cURL Request:
curl -X DELETE http://localhost:3000/api/template/TEMPLATE_ID_HERE

Example:
curl -X DELETE http://localhost:3000/api/template/12345


#Response Format
All responses are returned in JSON format.

Success Response Example:**

{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response Example:**
```json
{
  "success": false,
  "error": "Error message here",
  "statusCode": 400
}
```

---


