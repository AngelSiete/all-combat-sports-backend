'use strict'

const express = require('express')
const router = express.Router()
const slugify = require('slugify')

// const articleModel = require('../models/articleModel')
// const commentModel = require('../models/commentModel')
// const authMiddleware = require('../modules/authenticator')
//const publicAccess = authMiddleware(false, ['user', 'admin'])
//const onlyAdminAccess = authMiddleware(true, ['admin'])

router.route('/' || "/home").get(async(req,res)=>{
  try{

    res.json()
  }
  catch(error){
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
