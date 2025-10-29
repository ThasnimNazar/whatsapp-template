const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('../backend/connections/dbConnection')
const templateRoute = require('../backend/routes/templateRoutes')

dotenv.config();

const app = express();
const port = 5000 || process.env.PORT

connectDB();

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://whatsapp-template-kappa.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions))
app.use(express.json());
app.use('/api',templateRoute)



app.listen(port,()=>{
    console.log(`server listening on ${port}`)
})