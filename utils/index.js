const joinJwt = (payload, headersAndSignature) => {
  const [headers, signature] = headersAndSignature.split('.')
  return `${headers}.${payload}.${signature}`
}

const splitJwt = (jwt) => {
  const [headers, payload, signature] = jwt.split('.')
  const headersAndSignature = `${headers}.${signature}`

  return { payload, headersAndSignature }
}

module.exports = {
  joinJwt,
  splitJwt
}
