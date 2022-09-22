import PixivStrategy from "../lib/strategy.js";

describe("Strategy", () => {
  const strategy = new PixivStrategy(
    {
      clientID: "ABC123",
      clientSecret: "secret",
    },
    () => {}
  );

  it("should be named pixiv", () => {
    expect(strategy.name).toBe("pixiv");
  });

  it("should have default user agent", () => {
    // @ts-expect-error
    expect(strategy._oauth2._customHeaders["User-Agent"]).toBe(
      "passport-pixiv"
    );
  });

  describe("constructed with user agent option", () => {
    const strategy = new PixivStrategy(
      {
        clientID: "ABC123",
        clientSecret: "secret",
        userAgent: "example.com",
      },
      () => {}
    );

    it("should have default user agent", () => {
      // @ts-expect-error
      expect(strategy._oauth2._customHeaders["User-Agent"]).toBe("example.com");
    });
  });

  describe("constructed with custom headers including user agent", () => {
    const strategy = new PixivStrategy(
      {
        clientID: "ABC123",
        clientSecret: "secret",
        customHeaders: { "User-Agent": "example.net" },
      },
      () => {}
    );

    it("should have default user agent", () => {
      // @ts-expect-error
      expect(strategy._oauth2._customHeaders["User-Agent"]).toBe("example.net");
    });
  });

  describe("constructed with both custom headers including user agent and user agent option", () => {
    const strategy = new PixivStrategy(
      {
        clientID: "ABC123",
        clientSecret: "secret",
        customHeaders: { "User-Agent": "example.org" },
        userAgent: "example.net",
      },
      () => {}
    );

    it("should have default user agent", () => {
      // @ts-expect-error
      expect(strategy._oauth2._customHeaders["User-Agent"]).toBe("example.org");
    });
  });
});
