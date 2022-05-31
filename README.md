# Strapi JWT Cookies
Securely use [users-permissions](https://github.com/strapi/strapi/tree/master/packages/plugins/users-permissions/)'s JWT on cookies.

[![](https://flat.badgen.net/npm/v/@bwyx/strapi-jwt-cookies?icon=npm)](https://www.npmjs.com/package@bwyx/strapi-jwt-cookies)

## How this package works
This package extends the `@strapi/plugin-users-permissions` core plugin via [Extending a plugin's interface](https://docs.strapi.io/developer-docs/latest/development/plugins-extension.html#extending-a-plugin-s-interface). It exports a higher order function to wrap `strapi-server` customization.

### What this package does to the plugin
- Added [two middlewares](https://github.com/bwyx/strapi-jwt-cookies/blob/80414f5bcd44217f2d6af6b78c22a8c4bce87067/index.js#L37) and apply the `jwtCookieSetter` middleware to [auth routes](https://github.com/bwyx/strapi-jwt-cookies/blob/80414f5bcd44217f2d6af6b78c22a8c4bce87067/index.js#L13) only, so it wont affect the other routes.
- Added one [route](https://github.com/bwyx/strapi-jwt-cookies/blob/80414f5bcd44217f2d6af6b78c22a8c4bce87067/index.js#L49) and [logout controller](https://github.com/bwyx/strapi-jwt-cookies/blob/80414f5bcd44217f2d6af6b78c22a8c4bce87067/index.js#L43) to remove cookie server side: `POST /api/auth/logout`

### Features
- Split JWT into two cookies, httpOnly for JWT `header.signature` and javascript-accessible cookie for the `payload`, so frontend can easily read the JWT payload. read it more [here](https://medium.com/lightrail/getting-token-authentication-right-in-a-stateless-single-page-application-57d0c6474e3)

## Usage

**Install**

```bash
npm install --save @bwyx/strapi-jwt-cookies
```
Create file under directory `src/extensions/users-permissions/strapi-server.js`:

```js
// src/extensions/users-permissions/strapi-server.js

module.exports = require('@bwyx/strapi-jwt-cookies')(); 

```

If you already extend the `strapi-server.js`, you could wrap your function like this:

```js
const withJwtCookie = require('@bwyx/strapi-jwt-cookies');

module.exports = withJwtCookie((plugin) => {
  // some customization

  return plugin
});

```

Then add the global middleware, this middleware reconstructs JWT from request cookies then assign it to `headers.authorization`
```js
// config/middlewares.js

module.exports = [
  'strapi::errors',
  ...
  'strapi::public',
  'plugin::users-permissions.jwtCookieGetter'
]
```


### References
- [Getting Token Authentication Right in a Stateless Single Page Application](https://medium.com/lightrail/getting-token-authentication-right-in-a-stateless-single-page-application-57d0c6474e3) by [Peter Locke](https://medium.com/@pdlocke)
