import { parse } from "../lib/profile";

describe("profile.parse", () => {
  describe("example profile", () => {
    let profile;

    beforeAll((done) => {
      profile = parse(require("./data/example.json"));
      done();
    });

    it("should parse profile", () => {
      expect(profile.id).toBe("11");
      expect(profile.username).toBe("pixiv");
      expect(profile.displayName).toBe("pixiv事務局");
      expect(profile.photos).toHaveLength(2);
    });
  });
});
