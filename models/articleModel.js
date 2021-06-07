'use strict'

const mongoose = require('mongoose')

const ArticleSchema = require('./schemas/articleSchema')

const ArticleModel = mongoose.model('articles', ArticleSchema)

module.exports = ArticleModel
