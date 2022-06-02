'use strict'

const FRONTEND_DOMAIN = process.env.FRONTEND_DOMAIN

const isFromFrontend = (req) =>
  req.headers['x-requested-with'] === 'XMLHttpRequest'

const joinJwt = (payload, headersAndSignature) => {
  const [headers, signature] = headersAndSignature.split('.')
  return `${headers}.${payload}.${signature}`
}

const splitJwt = (jwt) => {
  const [headers, payload, signature] = jwt.split('.')
  const headersAndSignature = `${headers}.${signature}`

  return { payload, headersAndSignature }
}

const cookieOptions = ({
  path = '/',
  signed = false,
  accessibleFromJavascript = false,
  lifespan
}) => {
  const minute = 60 * 1000

  return {
    path,
    domain: FRONTEND_DOMAIN ? `.${FRONTEND_DOMAIN}` : undefined,
    signed,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: !accessibleFromJavascript,
    maxAge: lifespan ? lifespan * minute : undefined,
    expires: lifespan === 0 ? new Date(0) : undefined
  }
}

module.exports = {
  isFromFrontend,
  joinJwt,
  splitJwt,
  cookieOptions
}
