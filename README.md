# Strapi JWT Cookies

Securely use [users-permissions](https://github.com/strapi/strapi/tree/master/packages/plugins/users-permissions/)'s JWT on cookies. Compatible with Strapi v4 and requires `@strapi/plugin-users-permissions@^4.1.12`

[![@rogdex24/strapi-jwt-cookies on npm](https://flat.badgen.net/npm/v/@rogdex24/strapi-jwt-cookies?icon=npm)](https://www.npmjs.com/package/@rogdex24/strapi-jwt-cookies)

## How this package works

This package extends the `@strapi/plugin-users-permissions` core plugin via [Extending a plugin's interface](https://docs.strapi.io/developer-docs/latest/development/plugins-extension.html#extending-a-plugin-s-interface). It exports a higher-order function to wrap `strapi-server` customization.

### What this package does to the plugin

- Adds [two middlewares](https://github.com/bwyx/strapi-jwt-cookies/blob/80414f5bcd44217f2d6af6b78c22a8c4bce87067/index.js#L37) and applies the `jwtCookieSetter` middleware to [auth routes](https://github.com/bwyx/strapi-jwt-cookies/blob/80414f5bcd44217f2d6af6b78c22a8c4bce87067/index.js#L13) only, so it wont affect the other routes.
- Adds one [route](https://github.com/bwyx/strapi-jwt-cookies/blob/80414f5bcd44217f2d6af6b78c22a8c4bce87067/index.js#L49) and [logout controller](https://github.com/bwyx/strapi-jwt-cookies/blob/80414f5bcd44217f2d6af6b78c22a8c4bce87067/index.js#L43) to remove cookie server-side: `POST /api/auth/logout`

### Features

- Split JWT into two cookies, httpOnly for JWT `header.signature` and javascript-accessible cookie for the `payload`, so frontend can easily read the JWT payload. read it more [here](https://medium.com/lightrail/getting-token-authentication-right-in-a-stateless-single-page-application-57d0c6474e3)
- Automatically log out on user inactivity by [setting cookie expires](#configurations)

### How About CSRF?

Note that this package **doesn't** add a CSRF prevention mechanism, but it **does** ensure the request is from the frontend by using [SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite) flag sets to `lax`,
and by checking request custom headers which only can be sent from the same CORS domain.

- set `X-Requested-With` to `XMLHttpRequest` to be able receive and validate jwt cookies on the server

## Install

```bash
npm install --save @rogdex24/strapi-jwt-cookies
```

Create file under directory `src/extensions/users-permissions/strapi-server.js`:

```js
// src/extensions/users-permissions/strapi-server.js

module.exports = require('@rogdex24/strapi-jwt-cookies')(); 

```

If you already extend the `strapi-server.js`, you could wrap your function like this:

```js
const withJwtCookie = require('@rogdex24/strapi-jwt-cookies');

module.exports = withJwtCookie((plugin) => {
  // some customization

  return plugin
});

```

Then add the global middleware, this middleware reconstructs JWT from request cookies and then assigns it to `headers.authorization`

```js
// config/middlewares.js

module.exports = [
  'strapi::errors',
  ...
  'strapi::public',
  'plugin::users-permissions.jwtCookieGetter'
]
```

### Configurations

By default, frontend users will be logged out after **30 mins of inactivy** (not make an api request)

```bash
COOKIE_PAYLOAD_LIFESPAN_MINUTES=30
```

You can restrict the cookie to your specific frontend domain (recommended):

```bash
FRONTEND_DOMAIN=myfrontend.com
```

The default cookies name are **user** for the `payload` and **token** for `headers.signature`, you can prefix the cookies name with env

```bash
APP_NAME=myapp
```

then the cookies will be **myapp_user** and **myapp_token**

### TODO
- [ ] Add test (?)

### References

- [Getting Token Authentication Right in a Stateless Single Page Application](https://medium.com/lightrail/getting-token-authentication-right-in-a-stateless-single-page-application-57d0c6474e3) by [Peter Locke](https://medium.com/@pdlocke)
