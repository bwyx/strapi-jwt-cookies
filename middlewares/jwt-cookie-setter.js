'use strict'

const { splitJwt } = require('../utils')

module.exports = (config, { strapi }) => {
  const COOKIES = strapi.config.get('jwt-cookie.cookies')

  return async ({ response, cookies }, next) => {
    await next()

    if (response.status === 200 && response.body.jwt) {
      const { payload, headersAndSignature } = splitJwt(response.body.jwt)

      cookies.set(COOKIES.user.key, payload, COOKIES.user.opts)
      cookies.set(COOKIES.token.key, headersAndSignature, COOKIES.token.opts)
    }
  }
}
