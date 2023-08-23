'use strict'

const express = require('express');

// Controlador de rutas
const ArticleController = require('../controllers/article')

let router = express.Router()

// Configurar el directorio para las imagenes
const multiparty = require('connect-multiparty');
let md_upload = multiparty({ uploadDir: './upload/articles' })

// Rutas de prueba
router.post('/datos-curso', ArticleController.datosCurso)
router.get('/test-de-controlador', ArticleController.test)

// Rutas
router.post('/save', ArticleController.save)
router.get('/articles/:last?', ArticleController.getArticles)
router.get('/article/:id', ArticleController.getArticle)
router.put('/article/:id', ArticleController.update)
router.delete('/article/:id', ArticleController.delete)
router.post('/upload-image/:id', md_upload, ArticleController.upload)
router.get('/get-image/:image', ArticleController.getImage)
router.get('/search/:search', ArticleController.search)

//? :x? Es un parametro y la interrogacion para hacerlo opcional se encuentra en req.params.x

module.exports = router;