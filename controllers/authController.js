'use strict'

const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')

const config = require('../modules/config')


router.route('/auth/login')
  .post(async (req, res, next) => {
    passport.authenticate('login', async (error, user, info) => {
      try {
        if (error || !user) {
          return next(error)
        }

        req.login(user, { session: false }, async (error) => {
          if (error) return next(error)

          let payload = {
            _id: user._id,
            email: user.email,
            username: user.userName,
            profile: user.profile
          }

          const token = jwt.sign(payload, config.APP_SECRET, {
            expiresIn: "30 days"
          })
          return res.json({ token })
        })
      }
      catch (error) {
        res.json(error)
        return next(error)
      }
    })(req, res, next)
  })

router.route('/auth/forggotten-password')
  .post((req, res) => {
    res.json({})
  })

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  try {
    res.json({
      message: 'You did it!',
      user: req.user,
      token: req.token,
    })
  } catch (error) {
    res.json(error)
  }
})

module.exports = router
