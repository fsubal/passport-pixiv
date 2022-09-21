/* global describe, it */

const PixivStrategy = require("../lib/strategy");

describe("Strategy", () => {
  let strategy = new PixivStrategy(
    {
      clientID: "ABC123",
      clientSecret: "secret",
    },
    function () {}
  );

  it("should be named pixiv", () => {
    expect(strategy.name).toBe("pixiv");
  });

  it("should have default user agent", () => {
    // @ts-expect-error
    expect(strategy._oauth2._customHeaders["User-Agent"]).toBe("passport-pixiv");
  });

  describe("constructed with user agent option", () => {
    let strategy = new PixivStrategy(
      {
        clientID: "ABC123",
        clientSecret: "secret",
        userAgent: "example.com",
      },
      function () {}
    );

    it("should have default user agent", () => {
      // @ts-expect-error
      expect(strategy._oauth2._customHeaders["User-Agent"]).toBe("example.com");
    });
  });

  describe("constructed with custom headers including user agent", () => {
    let strategy = new PixivStrategy(
      {
        clientID: "ABC123",
        clientSecret: "secret",
        customHeaders: { "User-Agent": "example.net" },
      },
      function () {}
    );

    it("should have default user agent", () => {
      // @ts-expect-error
      expect(strategy._oauth2._customHeaders["User-Agent"]).toBe("example.net");
    });
  });

  describe("constructed with both custom headers including user agent and user agent option", () => {
    let strategy = new PixivStrategy(
      {
        clientID: "ABC123",
        clientSecret: "secret",
        customHeaders: { "User-Agent": "example.org" },
        userAgent: "example.net",
      },
      function () {}
    );

    it("should have default user agent", () => {
      // @ts-expect-error
      expect(strategy._oauth2._customHeaders["User-Agent"]).toBe("example.org");
    });
  });
});
