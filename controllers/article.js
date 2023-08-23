'use strict'

const validator = require('validator');
let Article = require('../models/article');
const fs = require('fs');
const path = require('path');

let controller = {
  datosCurso: (req, res) => {

    // Devuelves un JSON con un codigo de estado HTTP
    return res.status(200).send({
      curso: 'MasterFrameworksJS',
      alumno: 'Ivan',
      fav: 'Vue',
    })

  },

  test: (req, res) => {

    return res.status(200).send({
      message: 'Accion test del controlador'
    })

  },

  save: (req, res) => {

    // Recoger parametros
    let params = req.body

    // Validar datos (Validator)
    let validate_title
    let validate_content

    try {

      // Comprobar si contienen contenido
      validate_title = !validator.isEmpty(params.title)
      validate_content = !validator.isEmpty(params.content)

    } catch (err) {

      // En caso de error devolver esto
      return res.status(404).send({
        status: 'error',
        message: 'Faltan datos'
      })

    }

    if (validate_title && validate_content) {
      // Crear el objeto
      let article = new Article();

      // Asignar valores
      article.title = params.title
      article.content = params.content
      article.image = null;

      // Guardar el articulo en la base de datos
      article.save()
        .then((articleStored) => {

          // Devolver una respuesta
          return res.status(200).send({
            status: 'success',
            article: articleStored
          })

        })
        .catch(err => {

          return res.status(404).send({
            status: 'error',
            message: 'El articulo no se ha guardado',
            error: err
          })

        })


    } else {

      // Devolver esto si no tienen contenido
      return res.status(200).send({
        status: 'error',
        message: 'Los datos no son validos'
      })
    }


  },

  getArticles: (req, res) => {

    let query = Article.find({})

    let last = req.params.last

    if (last || last != undefined) {
      query.limit(5)
    }

    // Ordenar los articulos de mas nuevo a mas viejo
    query.sort('-date').exec()
      .then((articles) => {

        if (!articles) {
          return res.status(404).send({
            status: 'error',
            message: 'No se han encontrado articulos'
          })
        }

        return res.status(200).send({
          status: 'success',
          articles
        })

      })
      .catch(err => {

        return res.status(500).send({
          status: 'error',
          message: 'Error al devolver los articulos',
          error: err
        })

      })
  },

  getArticle: (req, res) => {

    // Recoger id
    let id = req.params.id

    // Comprobar si existe
    if (!id || id == null) {
      return res.status(404).send({
        status: 'error',
        message: 'No existe'
      })

    }

    // Buscar el articulo
    Article.findById(id)
      .then((article) => {

        if (!article) {

          return res.status(404).send({
            status: 'error',
            message: 'No se ha encontrado el articulo',
          })
        }

        // Devolver en JSON
        return res.status(200).send({
          status: 'success',
          article

        })
      })
      .catch(err => {

        return res.status(500).send({
          status: 'error',
          message: 'Error en el server',
          error: err
        })

      })
  },

  update: (req, res) => {
    // Recoger el id
    let id = req.params.id

    // Recoger los datos que llegan por put
    let params = req.body

    // Validar
    let validate_title
    let validate_content


    try {
      // Validar los campos del articulo
      validate_title = !validator.isEmpty(params.title)
      validate_content = !validator.isEmpty(params.content)

    } catch (err) {

      return res.status(404).send({
        status: 'error',
        message: 'Faltan datos',
        error: err
      })

    }

    if (validate_title && validate_content) {
      // Find and update
      Article.findOneAndUpdate({ _id: id }, params, { new: true })
        .then(articleUpdated => {

          if (!articleUpdated) {
            return res.status(500).send({
              status: 'error',
              message: 'Error al actualizar',
            })
          }

          return res.status(200).send({
            status: 'success',
            article: articleUpdated
          })

        })
        .catch(err => {

          return res.status(500).send({
            status: 'error',
            message: 'Ha ocurrido un error',
            error: err
          })

        })
    } else {

      // Respuesta
      return res.status(500).send({
        status: 'error',
        message: 'Faltan datos',
      })

    }

  },

  delete: (req, res) => {

    // Recoger id
    let id = req.params.id

    // Find and delete
    Article.findOneAndDelete({ _id: id })
      .then(articleRemoved => {

        if (!articleRemoved) {

          return res.status(404).send({
            status: 'error',
            message: 'No se ha encontrado el articulo',
          })

        }

        // Respuesta
        return res.status(200).send({
          status: 'success',
          article: articleRemoved
        })

      })
      .catch(err => {

        return res.status(500).send({
          status: 'error',
          message: 'Error al eliminar',
          error: err
        })

      })

  },

  upload: (req, res) => {

    // Configurar connect-multiparty (routes)

    // Recoger el fichero
    let file_name = 'Imagen no subida'

    if (!req.files) {
      return res.status(404).send({
        status: 'error',
        message: file_name,
      })
    }

    // Conseguir nombre y extension
    let file_pat = req.files.file0.path
    let file_split = file_pat.split('\\')

    file_name = file_split[2]

    let extension_split = file_name.split('\.')
    let file_ext = extension_split[1]

    // Comprobar extension
    if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {

      // Borrar el archivo
      fs.unlink(file_pat)
        .then(err => {

          return res.status(500).send({
            status: 'error',
            message: 'La extension de la imagen no es valida',
            error: err
          })

        })

    } else {

      // Buscar articulo y asignar imagen
      let id = req.params.id

      // Se encuentra el archivo y se pasa la imagen mediante los params
      Article.findOneAndUpdate({ _id: id }, { image: file_name }, { new: true })
        .then(articleUpdated => {

          if (!articleUpdated) {

            return res.status(404).send({
              status: 'error',
              message: 'No se ha encontrado el archivo',
            })

          }

          return res.status(200).send({
            status: 'success',
            message: 'Se ha subido la imagen correctamente',
            article: articleUpdated
          })

        })
        .catch(err => {

          return res.status(500).send({
            status: 'error',
            message: 'No se ha subido la imagen',
            error: err
          })

        })
    }

  },

  getImage: (req, res) => {

    // Recoger datos del archivo
    let file = req.params.image;
    let path_file = './upload/articles/' + file

    // Si existe se devuelve la imagen
    fs.exists(path_file, exists => {

      if (exists) {

        return res.sendFile(path.resolve(path_file))

      } else {

        return res.status(404).send({
          status: 'error',
          message: 'La imagen no existe',
        })

      }

    })

  },

  search: (req, res) => {

    // Sacar el string a buscar
    let searchString = req.params.search

    // Buscar el articulo
    Article.find({

      // Se comprueba si alguno de los campos contiene searchString
      '$or': [
        { 'title': { '$regex': searchString, '$options': 'i' } },
        { 'content': { '$regex': searchString, '$options': 'i' } }
      ]

    })
      // Ordenar los articulos
      .sort([['date', 'descending']])
      .exec()
      .then(articles => {

        if (!articles || articles.lenght <= 0) {

          return res.status(404).send({
            status: 'error',
            message: 'No se ha encontrado el articulo',
          })

        }

        return res.status(200).send({
          status: 'success',
          article: articles
        })

      })
      .catch(err => {

        return res.status(500).send({
          status: 'error',
          message: 'Error en la peticion',
          error: err
        })

      })

  }
}

module.exports = controller;