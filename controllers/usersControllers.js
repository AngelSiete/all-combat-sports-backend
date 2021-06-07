'use strict'

const express = require('express');
const { sha512 } = require('js-sha512');
const router = express.Router()
const userModel = require('../models/userModel')

router.route('/users')
  .get(async (req, res) => {
    try {
      const limit = req.query.hasOwnProperty('limit') ? parseInt(req.query.limit) : 50

      let userList = await userModel.find().sort({ firstname: 'ASC', lastname: 'ASC' }).limit(limit).exec()
      userList = userList.map((user) => {
        user = user.toJSON()
        delete user.password

        return user
      })

      res.json(userList)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })
  .post(async (req, res) => {
    let userData = req.body
    try {

      userData.profile = "user"
      userData.password = sha512(userData.password)

      userData = await new userModel(userData).save()
      userData = userData.toJSON()
      delete userData.password

      res.status(201).json(userData)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  })

router.route('/users/:userId')
  .get(async (req, res) => {
    try {
      const userId = req.params.userId
      let foundUser = await userModel.findById(userId).exec()

      if (!foundUser) {
        res.status(404).json({ message: `Usuario ${userId} no encontrado.` })
        return
      }
      foundUser = foundUser.toJSON()
      delete foundUser.password

      res.json(foundUser)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })
  .put(async(req, res) => {
    try {
      const userId = req.params.userId
      const userData = req.body

      let updatedItem = await userModel.findOneAndUpdate({ _id: userId }, userData, { new: true }).exec()

      if (!updatedItem) {
        res.status(404).json({ message: `Usuario ${userId} no encontrado.` })
        return
      }

      updatedItem = updatedItem.toJSON()
      delete updatedItem.password

      res.json(updatedItem)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })
  .delete(async (req, res) => {
    try {
      const userId = req.params.userId

      let foundItem = await userModel.findOneAndDelete({ _id: userId }).exec()

      if (!foundItem) {
        res.status(404).json({ message: `Usuario ${userId} no encontrado.` })
        return
      }

      res.status(204).json(null)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

module.exports = router
