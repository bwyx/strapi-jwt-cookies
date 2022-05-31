'use strict'

const { joinJwt } = require('../utils')
const { COOKIE_NAME, payloadOpts } = require('../config')

module.exports = (config, { strapi }) => {
  return async ({ request, cookies }, next) => {
    const payload = cookies.get(COOKIE_NAME.PAYLOAD)
    const headersAndSignature = cookies.get(COOKIE_NAME.HEADER_SIGNATURE)

    if (request.url.startsWith('/api')) {
      if (payload && headersAndSignature) {
        const jwt = joinJwt(payload, headersAndSignature)
        request.headers.authorization = `Bearer ${jwt}`
      }

      await next()

      if (payload) {
        cookies.set(COOKIE_NAME.PAYLOAD, payload, payloadOpts)
      }
    } else {
      await next()
    }
  }
}
