const express = require('express')
const { dbConnection } = require('./db/config')
require('dotenv').config()
const cors = require('cors')

//Crear el servidor de express
const app = express()
const port = process.env.PORT ?? 3000

// Base de datos
dbConnection()

// CORS
app.use(cors())

// Directorio público
app.use( express.static('public'))

// Lectura y parseo del body
app.use( express.json() )

// Rutas
app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))

app.get('*', (req, res) => {
  res.sendFile( __dirname + 'public/index.html' );
});


// Escuchar peticiones
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
}) 