/**
 * Module dependencies.
 */
const OAuth2Strategy = require("passport-oauth2");
const Profile = require("./profile");
const InternalOAuthError = require("passport-oauth2").InternalOAuthError;

/**
 * `Strategy` constructor.
 *
 * The pixiv authentication strategy authenticates requests by delegating to
 * pixiv using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your pixiv application's Client ID
 *   - `clientSecret`  your pixiv application's Client Secret
 *   - `callbackURL`   URL to which pixiv will redirect the user after granting authorization
 *   - `scope`         array of permission scopes to request.  valid scopes include:
 *                     'read-favorite-users', 'write-favorite-users'
 *   - `userAgent`     All API requests MUST include a valid User Agent string.
 *                     e.g: domain name of your application.
 *
 * Examples:
 *
 *     passport.use(new PixivStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/pixiv/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
module.exports = class Strategy extends OAuth2Strategy {
  name = "pixiv";

  constructor(options = {}, verify) {
    options.authorizationURL =
      options.authorizationURL ??
      "https://oauth.secure.pixiv.net/v2/auth/authorize";
    options.tokenURL =
      options.tokenURL ?? "https://oauth.secure.pixiv.net/v2/auth/token";
    options.scopeSeparator = options.scopeSeparator ?? ",";
    options.customHeaders = options.customHeaders ?? {};

    if (!options.customHeaders["User-Agent"]) {
      options.customHeaders["User-Agent"] =
        options.userAgent ?? "passport-pixiv";
    }

    super(options, verify);

    this._userProfileURL =
      options.userProfileURL ??
      "https://public-api.secure.pixiv.net/v1/me.json";
    this._oauth2.useAuthorizationHeaderforGET(true);
  }

  /**
   * Retrieve user profile from pixiv.
   *
   * This function constructs a normalized profile, with the following properties:
   *
   *   - `provider`         always set to `pixiv`
   *   - `id`               the user's pixiv ID
   *   - `username`         the user's pixiv username
   *   - `displayName`      the user's full name
   *   - `profileUrl`       the URL of the profile for the user on pixiv
   *   - `photos`           the user's profile images
   *
   * @param {String} accessToken
   * @param {Function} done
   * @api protected
   */
  userProfile(accessToken, done) {
    this._oauth2.get(this._userProfileURL, accessToken, function (err, body) {
      let json;

      if (err) {
        return done(
          new InternalOAuthError("Failed to fetch user profile", err)
        );
      }

      try {
        json = JSON.parse(body);
      } catch (ex) {
        return done(new Error("Failed to parse user profile"));
      }

      let profile = Profile.parse(json);
      profile.provider = "pixiv";
      profile._raw = body;
      profile._json = json;

      done(null, profile);
    });
  }
};
