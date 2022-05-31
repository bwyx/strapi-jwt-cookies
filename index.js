'use strict'

const authRoutes = require('@strapi/plugin-users-permissions/server/routes/content-api/auth')
const userRoutes = require('@strapi/plugin-users-permissions/server/routes/content-api/user')
const roleRoutes = require('@strapi/plugin-users-permissions/server/routes/content-api/role')
const permissionsRoutes = require('@strapi/plugin-users-permissions/server/routes/content-api/permissions')

const jwtCookieGetter = require('./middlewares/getter')
const jwtCookieSetter = require('./middlewares/setter')

const authRoutesWithCookieMiddleware = authRoutes.map((r) => {
  const middlewares = r.config?.middlewares ?? []
  const middlewaresWithJwtCookies = [
    ...middlewares,
    'plugin::users-permissions.jwtCookieSetter'
  ]

  return {
    ...r,
    config: {
      ...r.config,
      middlewares: middlewaresWithJwtCookies
    }
  }
})

module.exports = (userConfig) => (plugin) => {
  plugin.middlewares = {
    ...plugin.middlewares,
    jwtCookieGetter,
    jwtCookieSetter
  }

  plugin.routes['content-api'].routes = [
    ...authRoutesWithCookieMiddleware,
    ...userRoutes,
    ...roleRoutes,
    ...permissionsRoutes
  ]

  // apply user custom config strapi-server
  if (typeof userConfig === 'function') {
    return userConfig(plugin)
  }

  return plugin
}
