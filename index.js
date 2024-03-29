'use strict'

// Modulos
let mongoose = require('mongoose')
let app = require('./app')

// Parametros servidor
let port = 3900
let url = 'mongodb://localhost:27017/api_rest_blog'

//! Dan error
// mongoose.set('useFindAndModify', false);
// mongoose.Promise = global.Promise;

// Conectar a DB y parametros
mongoose.connect(url, {

  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4

})
  .then(() => {

    // Comprobar conexion
    console.log('Conectado');

    // Crear servidor y escuchar peticiones
    app.listen(port, () => {
      console.log('Servidor corriendo en el puerto:', port);
    })

  })
  .catch(err => console.log(err))
