const jwt = require('jsonwebtoken')
const config = require('./config')
//middleware autenticación
/*
Descripción: Queremos un middleware que corte el acceso y devuelva los errores típicos en función de la configuración

El middleware debe permitir:
1.- Configurar si se requiere obligatoriamente una sesión activa
2.- Listar que perfiles pueden llamar al método
3.- Lanzar errores en caso de producirse un problema al verificar/extraer el token
4.- Dejar los datos del token en la petición para su uso posterior
*/

module.exports = function authenticator(requiredSession, allowedProfiles = []) {

  return async (req, res, next) => {
    const token = req.token
    req.tokenData = null

    if (!token && !requiredSession) {
      next()
      return
    }

    try {
      if (!token && requiredSession) {
        res.status(401).json({ message: 'Debes iniciar sesión para llamar a este método' })
        return
      }

      if (token) {
        req.tokenData = await jwt.verify(token, config.APP_SECRET)


      }

      if (requiredSession && allowedProfiles.indexOf(req.tokenData.profile) === -1) {
        res.status(403).json({ message: 'No tienes permisos suficientes para llamar a este método.' })
        return
      }

      next()
    } catch (error) {
      res.status(500).json({ message: error.message })
      return
    }
  }

}
