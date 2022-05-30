'use strict'

const { joinJwt } = require('../utils')

module.exports = (config, { strapi }) => {
  const COOKIES = strapi.config.get('jwt-cookie.cookies')

  return async ({ request, cookies }, next) => {
    const payload = cookies.get('user')
    const headersAndSignature = cookies.get('token')

    if (request.url.startsWith('/api')) {
      if (payload && headersAndSignature) {
        const jwt = joinJwt(payload, headersAndSignature)
        request.headers.authorization = `Bearer ${jwt}`
      }

      await next()

      if (payload) {
        cookies.set(COOKIES.user.key, payload, COOKIES.user.options)
      }
    } else {
      await next()
    }
  }
}
