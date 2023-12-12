'use strict'

// const authRoutes = require('@strapi/plugin-users-permissions/server/routes/content-api/auth')
// const userRoutes = require('@strapi/plugin-users-permissions/server/routes/content-api/user')
// const roleRoutes = require('@strapi/plugin-users-permissions/server/routes/content-api/role')
// const permissionsRoutes = require('@strapi/plugin-users-permissions/server/routes/content-api/permissions')

const authRoutes = require('../../@strapi/plugin-users-permissions/server/routes/content-api/auth')
const userRoutes = require('../../@strapi/plugin-users-permissions/server/routes/content-api/user')
const roleRoutes = require('../../@strapi/plugin-users-permissions/server/routes/content-api/role')
const permissionsRoutes = require('../../@strapi/plugin-users-permissions/server/routes/content-api/permissions')

const jwtCookieGetter = require('./middlewares/getter')
const jwtCookieSetter = require('./middlewares/setter')

const { COOKIE_NAME, destroyCookieOpts } = require('./config')

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

const logout = {
  route: {
    method: 'POST',
    path: '/auth/logout',
    handler: 'auth.logout',
    config: { auth: false, prefix: '' }
  },
  controller: (ctx) => {
    ctx.cookies.set(COOKIE_NAME.PAYLOAD, '', destroyCookieOpts)
    ctx.cookies.set(COOKIE_NAME.HEADER_SIGNATURE, '', destroyCookieOpts)

    ctx.response.status = 204
  }
}

module.exports = (userConfig) => (plugin) => {
  plugin.middlewares = {
    ...plugin.middlewares,
    jwtCookieGetter,
    jwtCookieSetter
  }

  plugin.controllers.auth = {
    ...plugin.controllers.auth,
    logout: logout.controller
  }

  plugin.routes['content-api'].routes = [
    ...authRoutesWithCookieMiddleware,
    logout.route,
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
