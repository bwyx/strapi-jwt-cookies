'use strict'

const { splitJwt } = require('../utils')
const {
  COOKIE_NAME,
  payloadOpts,
  headersAndSignatureOpts
} = require('../config')

module.exports = (config, { strapi }) => {
  return async ({ response, cookies }, next) => {
    await next()

    if (response.status === 200 && response.body.jwt) {
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
