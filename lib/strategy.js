/**
 * Module dependencies.
 */
import OAuth2Strategy, { InternalOAuthError } from "passport-oauth2";
import * as Profile from "./profile.js";

/**
 * @typedef {Partial<OAuth2Strategy.StrategyOptions | OAuth2Strategy.StrategyOptionsWithRequest> & { userAgent?: string, userProfileURL?: string }} PixivStrategyOptions
 */

/**
 * @type {PixivStrategyOptions}
 */
const DEFAULT_OPTIONS = {
  authorizationURL: "https://oauth.secure.pixiv.net/v2/auth/authorize",
  tokenURL: "https://oauth.secure.pixiv.net/v2/auth/token",
  scopeSeparator: ",",
  customHeaders: {},
};

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
 * ```js
 * passport.use(
 *   new PixivStrategy({
 *     clientID: '123-456-789',
 *     clientSecret: 'shhh-its-a-secret'
 *     callbackURL: 'https://www.example.net/auth/pixiv/callback'
 *   },
 *   (accessToken, refreshToken, profile, done) => {
 *     User.findOrCreate(..., (err, user) => {
 *       done(err, user);
 *     });
 *   }
 * ));
 * ```
 */
export default class PixivStrategy extends OAuth2Strategy {
  /** @type {string} */
  name = "pixiv";

  /** @type {string} */
  userProfileURL;

  /**
   * @param {PixivStrategyOptions} options
   * @param {OAuth2Strategy.VerifyFunction | OAuth2Strategy.VerifyFunctionWithRequest} verify
   */
  constructor(options, verify) {
    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...options,

      customHeaders: {
        ...DEFAULT_OPTIONS.customHeaders,
        ...options.customHeaders,
      },
    };

    if (!mergedOptions.customHeaders?.["User-Agent"]) {
      mergedOptions.customHeaders["User-Agent"] =
        mergedOptions.userAgent ?? "passport-pixiv";
    }

    // @ts-expect-error
    super(mergedOptions, verify);

    this.userProfileURL =
      mergedOptions.userProfileURL ??
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
   * @type {OAuth2Strategy['userProfile']}
   */
  userProfile(accessToken, done) {
    this._oauth2.get(this.userProfileURL, accessToken, (err, body) => {
      if (err) {
        return done(
          new InternalOAuthError("Failed to fetch user profile", err)
        );
      }

      try {
        const response = JSON.parse(body.toString());

        done(null, Profile.parse(response));
      } catch {
        return done(new Error("Failed to parse user profile"));
      }
    });
  }
}
