'use strict'

const express = require('express')
const router = express.Router()
const slugify = require('slugify')

const articleModel = require('../models/articleModel')
const commentModel = require('../models/commentModel')
const authMiddleware = require('../modules/authenticator')
//const publicAccess = authMiddleware(false, ['user', 'admin'])
//const onlyAdminAccess = authMiddleware(true, ['admin'])

router.route('/articles')
.get(async (req, res) => {
  try {
    const limit = req.query.hasOwnProperty('limit') ? parseInt(req.query.limit) : 50
    const filterParams = {}

    if (!req.tokenData || req.tokenData.profile === 'user') {
      filterParams.enabled = true
    }

    const articleList = await articleModel.find(filterParams).sort({ published_at: 'DESC', title: 'ASC' }).limit(limit).exec()

    res.json(articleList)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})
  .post( async (req, res) => {
    try {
      let reqBody = req.body;
      let newArticle = {title:reqBody.title,slug: reqBody.slug,user: reqBody.user,category:reqBody.category,body:reqBody.body}

      if (!newArticle.hasOwnProperty("slug") ||
        (newArticle.hasOwnProperty("slug") && newArticle.slug === '')) {
        //generamos el slug
        newArticle.slug = newArticle.title
      }

      newArticle.slug = slugify(newArticle.slug, { lower: true, strict: true })

      newArticle = await new articleModel(newArticle).save()

      res.status(201).json(newArticle)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

  router.route('/articles/:articleId')
  .get(async(req,res) =>{
    try{
      const articleId = req.params.articleId
    const article = await articleModel.findById(articleId)
    return res.json(article)}
    catch(error){
      res.status(500).json({ message: error.message })
    }
  }).put( async (req, res) => {
    try {
      const articleId = req.params.articleId
      const articleData = req.body

      if (!articleData.hasOwnProperty("slug") ||
        (articleData.hasOwnProperty("slug") && articleData.slug === '')) {
        //generamos el slug
        articleData.slug = articleData.title
      }
      console.log(articleData)

      articleData.slug = slugify(articleData.slug, { lower: true, strict: true })
      let updatedItem = await articleModel.findOneAndUpdate({ _id: articleId }, articleData, { new: true }).exec()

      if (!updatedItem) {
        res.status(404).json({ message: `Artículo con identificador ${articleId} no encontrado.` })
        return
      }

      res.json(updatedItem)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }).delete( async (req, res) => {
    try {
      const articleId = req.params.articleId

      const result = await articleModel.findOneAndDelete({ _id: articleId }).exec()

      if (!result) {
        res.status(404).json({ message: `Artículo con identificador ${articleId} no encontrado.` })
        return
      }
      res.status(204).json(null)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

  router.route('/articles/:articleId/comments')
  .post( async (req, res) => {
    try {
      const articleId = req.params.articleId
      const article = await articleModel.findById(articleId)
      let reqBody = req.body;
      let newComment = {
        user: reqBody.user,text: reqBody.text
      }

      newComment = await new commentModel(newComment).save()
      article.comments.push(newComment)
      article.save()
      res.status(201).json(newComment)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }).get(async (req, res) => {
    try {
      const articleId = req.params.articleId
      const article = await articleModel.findById(articleId).populate("comments").exec()
      const limit = req.query.hasOwnProperty('limit') ? parseInt(req.query.limit) : 50
      let filterParams = []

      // article.comments.forEach(comment => {filterParams.push(commentModel.findById(comment))
      // });

      res.json(article.comments)
      res.json(commentList)


    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })
  router.route('/articles/:articleId/comments/:commentId').delete( async (req, res) => {
    try {
      const commentId = req.params.commentId

      const result = await commentModel.findOneAndDelete({ _id: commentId }).exec()

      if (!result) {
        res.status(404).json({ message: `Comentario con identificador ${commentId} no encontrado.` })
        return
      }
      res.status(204).json(null)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })
module.exports = router
