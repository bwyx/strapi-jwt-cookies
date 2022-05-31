'use strict'

const { joinJwt } = require('../utils')
const { COOKIE_NAME, payloadOpts } = require('../config')

module.exports = (config, { strapi }) => {
  return async ({ request, cookies }, next) => {
    const payload = cookies.get(COOKIE_NAME.PAYLOAD)
    const headersAndSignature = cookies.get(COOKIE_NAME.HEADER_SIGNATURE)

    if (request.url.startsWith('/api')) {
      // reconstruct the jwt from the cookies
      if (payload && headersAndSignature) {
        const jwt = joinJwt(payload, headersAndSignature)
        request.headers.authorization = `Bearer ${jwt}`
      }

      await next()

      // renew 'COOKIE_NAME.PAYLOAD' expire time.
      if (payload && !request.url.startsWith('/api/auth/logout')) {
        cookies.set(COOKIE_NAME.PAYLOAD, payload, payloadOpts)
      }
    } else {
      await next()
    }
  }
}
