'use strict'

const mongoose = require('mongoose')

const CommentSchema = require('./schemas/commentSchema')

const CommentModel = mongoose.model('comments', CommentSchema)

module.exports = CommentModel
