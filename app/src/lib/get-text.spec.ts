import { getText } from "@/lib/get-text";

describe("test", () => {
  it("tests", () => {
    const result = getText();

    expect(typeof result).toBe("string");
  });
});
