const passport = require('passport')
const localStrategy = require('passport-local').Strategy;
const { sha512 } = require('js-sha512')
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

const userModel = require('../models/userModel')
const config = require('./config')


passport.use('login', new localStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    password = sha512(password)
    const user = await userModel.findOne({ email })
    if (!user) {
      return done(null, false, { message: 'Usuario y/o Contraseña no validos.' });
    }
    if (user.password !== password) {
      return done(null, false, { message: 'Usuario y/o Contraseña no validos.' });
    }
    return done(null, user, { message: 'Login successfull' });
  } catch (error) {
    return done(error)
  }
}
));

passport.use(new JWTStrategy({
  secretOrKey: config.APP_SECRET,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (token, done) => {
  try {
      return done(null, token)
  } catch (error) {
      done(error)
  }
}))
