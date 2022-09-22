# Passport-Pixiv

[Passport](http://passportjs.org/) strategy for authenticating with [pixiv](http://www.pixiv.net/)
using the OAuth 2.0 API.

This module lets you authenticate using pixiv in your Node.js applications.
By plugging into Passport, pixiv authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

```
$ npm install passport-pixiv
```

## Usage

#### Configure Strategy

The pixiv authentication strategy authenticates users using a pixiv account
and OAuth 2.0 tokens. The strategy requires a `verify` callback, which accepts
these credentials and calls `done` providing a user, as well as `options`
specifying a client ID, client secret, and callback URL.

```js
passport.use(
  new PixivStrategy(
    {
      clientID: PIXIV_CLIENT_ID,
      clientSecret: PIXIV_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/pixiv/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOrCreate({ pixivId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  )
);
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'pixiv'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get("/auth/pixiv", passport.authenticate("pixiv"));

app.get(
  "/auth/pixiv/callback",
  passport.authenticate("pixiv", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);
```

## Examples

For a complete, working example, refer to the [login example](passport-pixiv/tree/master/examples/login).

## Tests

```
$ yarn
$ yarn test
```

## Credits

- [geta6](https://github.com/geta6)
- [fsubal](https://github.com/fsubal)

## Thanks

- [Jared Hanson](https://github.com/jaredhanson)

## License

[The MIT License](https://raw.githubusercontent.com/pixiv/passport-pixiv/master/LICENSE)
