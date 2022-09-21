/* global describe, it, before */

const { expect } = require("chai");
const parse = require("../lib/profile").parse;

describe("profile.parse", () => {
  describe("example profile", () => {
    let profile;

    before((done) => {
      profile = parse(require("./data/example.json"));
      done();
    });

    it("should parse profile", function () {
      expect(profile.id).to.equal("11");
      expect(profile.username).to.equal("pixiv");
      expect(profile.displayName).to.equal("pixiv事務局");
      expect(profile.photos).to.have.length(2);
    });
  });
});
