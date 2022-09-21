import { PixivStrategy } from "..";

describe("passport-pixiv", () => {
  it("should export Strategy constructor directly from package", () => {
    expect(PixivStrategy).toBeInstanceOf(Function);
    // expect(strategy).to.equal(strategy.Strategy);
  });

  it.skip("should export Strategy constructor", () => {
    // expect(Strategy).toBeInstanceOf(Function);
  });
});
