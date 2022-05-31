const APP_NAME = process.env.APP_NAME

const COOKIE_NAME = {
  PAYLOAD: APP_NAME ? `${APP_NAME}_user` : 'user',
  HEADER_SIGNATURE: APP_NAME ? `${APP_NAME}_token` : 'token'
}

const payloadOpts = cookieOptions({
  lifespan: parseInt(process.env.COOKIE_PAYLOAD_LIFESPAN_MINUTES) || 30,
  accessibleFromJavascript: true
})

const headersAndSignatureOpts = cookieOptions({
  accessibleFromJavascript: false
})

module.exports = {
  COOKIE_NAME,
  payloadOpts,
  headersAndSignatureOpts
}
