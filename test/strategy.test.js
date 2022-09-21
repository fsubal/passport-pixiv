/* global describe, it */

const { expect } = require("chai");
const PixivStrategy = require("../lib/strategy");

describe("Strategy", function () {
  let strategy = new PixivStrategy(
    {
      clientID: "ABC123",
      clientSecret: "secret",
    },
    function () {}
  );

  it("should be named pixiv", function () {
    expect(strategy.name).to.equal("pixiv");
  });

  it("should have default user agent", function () {
    // @ts-expect-error
    expect(strategy._oauth2._customHeaders["User-Agent"]).to.equal(
      "passport-pixiv"
    );
  });

  describe("constructed with user agent option", function () {
    let strategy = new PixivStrategy(
      {
        clientID: "ABC123",
        clientSecret: "secret",
        userAgent: "example.com",
      },
      function () {}
    );

    it("should have default user agent", function () {
      // @ts-expect-error
      expect(strategy._oauth2._customHeaders["User-Agent"]).to.equal(
        "example.com"
      );
    });
  });

  describe("constructed with custom headers including user agent", function () {
    let strategy = new PixivStrategy(
      {
        clientID: "ABC123",
        clientSecret: "secret",
        customHeaders: { "User-Agent": "example.net" },
      },
      function () {}
    );

    it("should have default user agent", function () {
      // @ts-expect-error
      expect(strategy._oauth2._customHeaders["User-Agent"]).to.equal(
        "example.net"
      );
    });
  });

  describe("constructed with both custom headers including user agent and user agent option", function () {
    let strategy = new PixivStrategy(
      {
        clientID: "ABC123",
        clientSecret: "secret",
        customHeaders: { "User-Agent": "example.org" },
        userAgent: "example.net",
      },
      function () {}
    );

    it("should have default user agent", function () {
      // @ts-expect-error
      expect(strategy._oauth2._customHeaders["User-Agent"]).to.equal(
        "example.org"
      );
    });
  });
});
