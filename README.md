### Backend con NodeJS y MongoDB

La aplicacion corre en el puerto 3900 y en la DB api_rest_blog

# Modulos npm

- Mongoose
- Express
- Body Parser
- Connect Multiparty
- Validator
- Nodemon(Solo en produccion)

# Archivos

- index.js: donde se inicia el servidor
- models/article.js: el modelo de articulo que se manda a la DB
- controllers/article.js: controlador de rutas y funciones de las rutas
- routes/article.js: rutas y funciones del articleController
- app.js: archivo donde se cargan los modulos del servidor, middlewares y se añade el prefijo a las rutas

# Errores

Al lanzar el server crasheaba, para evitarlo se deben incluir estos parametros al hacer la conexion con moongose:

- useNewUrlParser: true,
- useUnifiedTopology: true,
- family: 4
