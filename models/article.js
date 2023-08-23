'use strict'

// Modulo
const mongoose = require('mongoose');
let Schema = mongoose.Schema

// Modelo
let ArticleSchema = Schema({
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
  image: String
})

module.exports = mongoose.model('Article', ArticleSchema)
