import { getText } from "@/lib/get-text";

describe("test", () => {
  it("tests", () => {
    const result = getText({ text: "text", accountId: "accountId" });

    expect(result).toBe("Hello, world!\ntext");
  });
});
