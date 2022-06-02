'use strict'

const { isFromFrontend, splitJwt } = require('../utils')
const {
  COOKIE_NAME,
  payloadOpts,
  headersAndSignatureOpts
} = require('../config')

module.exports = (config, { strapi }) => {
  return async ({ request, response, cookies }, next) => {
    await next()

    // split jwt into cookies
    if (
      isFromFrontend(request) &&
      response.status === 200 &&
      response.body.jwt
    ) {
      const { payload, headersAndSignature } = splitJwt(response.body.jwt)

      cookies.set(COOKIE_NAME.PAYLOAD, payload, payloadOpts)
      cookies.set(
        COOKIE_NAME.HEADER_SIGNATURE,
        headersAndSignature,
        headersAndSignatureOpts
      )
    }
  }
}
