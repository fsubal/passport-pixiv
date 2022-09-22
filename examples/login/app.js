import { fileURLToPath } from "node:url";
import path from "path";

import express from "express";
import logger from "morgan";
import methodOverride from "method-override";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import passport from "passport";
import { PixivStrategy } from "../../lib/index.js";

const PIXIV_CLIENT_ID = "--insert-pixiv-client-id-here--";
const PIXIV_CLIENT_SECRET = "--insert-pixiv-client-secret-here--";

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete pixiv profile is serialized
//   and deserialized.
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Use the PixivStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and pixiv
//   profile), and invoke a callback with a user object.
passport.use(
  new PixivStrategy(
    {
      clientID: PIXIV_CLIENT_ID,
      clientSecret: PIXIV_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/pixiv/callback",
    },
    /**
     * @param {string} _accessToken
     * @param {string} _refreshToken
     * @param {unknown} profile
     * @param {(err: unknown, res: unknown) => void} done
     */
    (_accessToken, _refreshToken, profile, done) => {
      // asynchronous verification, for effect...
      process.nextTick(() => {
        // To keep the example simple, the user's pixiv profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the pixiv account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    }
  )
);

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// configure Express
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(
  session({ secret: "keyboard cat", resave: false, saveUninitialized: true })
);

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

app.get("/account", ensureAuthenticated, (req, res) => {
  res.render("account", { user: req.user });
});

app.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

// GET /auth/pixiv
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in pixiv authentication will involve redirecting
//   the user to pixiv.net.  After authorization, pixiv will redirect the user
//   back to this application at /auth/pixiv/callback
app.get("/auth/pixiv", passport.authenticate("pixiv"), (_req, _res) => {
  // The request will be redirected to pixiv for authentication, so this
  // function will not be called.
});

// GET /auth/pixiv/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get(
  "/auth/pixiv/callback",
  passport.authenticate("pixiv", { failureRedirect: "/login" }),
  (_req, res) => {
    res.redirect("/");
  }
);

app.get("/logout", (req, res, next) => {
  req.logout(next);
  res.redirect("/");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.info(`[express] server is running on http://127.0.0.1:${PORT}`);
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
