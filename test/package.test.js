import strategy, { Strategy } from "..";

describe("passport-pixiv", () => {
  it("should export Strategy constructor directly from package", () => {
    expect(strategy).toBeInstanceOf(Function);
    // expect(strategy).to.equal(strategy.Strategy);
  });

  it("should export Strategy constructor", () => {
    expect(Strategy).toBeInstanceOf(Function);
  });
});
