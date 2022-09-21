/* global describe, it,  before */

const fs = require("fs");
const PixivStrategy = require("../lib/strategy");

describe("Strategy#userProfile", () => {
  let strategy = new PixivStrategy(
    {
      clientID: "ABC123",
      clientSecret: "secret",
    },
    function () {}
  );

  // mock
  // @ts-expect-error
  strategy._oauth2.get = function (url, accessToken, callback) {
    if (url !== "https://public-api.secure.pixiv.net/v1/me.json") {
      return callback({ statusCode: 400 });
    }
    if (accessToken !== "token") {
      return callback({ statusCode: 400 });
    }

    fs.readFile("test/data/example.json", "utf8", function (err, body) {
      if (err) {
        return callback({ statusCode: 500 });
      }
      callback(null, body, undefined);
    });
  };

  describe("loading profile", () => {
    let profile;

    beforeAll(done => {
      strategy.userProfile("token", function (err, p) {
        if (err) {
          return done(err);
        }
        profile = p;
        done();
      });
    });

    it("should parse profile", () => {
      expect(profile.provider).toBe("pixiv");

      expect(profile.id).toBe("11");
      expect(profile.username).toBe("pixiv");
      expect(profile.displayName).toBe("pixiv事務局");
      expect(profile.photos).toHaveLength(2);
    });

    it.skip("should set raw property", function () {
      expect(typeof profile._raw).toBe("string");
    });

    it.skip("should set json property", function () {
      expect(profile._json).toBeInstanceOf(Object);
    });
  });

  describe("encountering an error", () => {
    let err, profile;

    beforeAll(done => {
      strategy.userProfile("wrong-token", function (e, p) {
        err = e;
        profile = p;
        done();
      });
    });

    it("should error", () => {
      expect(err).toBeInstanceOf(Error);
      expect(err.constructor.name).toBe("InternalOAuthError");
      expect(err.message).toBe("Failed to fetch user profile");
    });

    it("should not load profile", () => {
      expect(profile).toBeUndefined();
    });
  });
});
