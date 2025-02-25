import delay from "../utils/delay";

describe("delay", () => {
  jest.useFakeTimers();
  jest.spyOn(global, "setTimeout");

  it("should resolve after specified time", async () => {
    const promise = delay(1000);

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);

    jest.runAllTimers();

    await expect(promise).resolves.toBeUndefined();
  });

  it("should accept 0 as valid delay", async () => {
    const promise = delay(0);

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 0);

    jest.runAllTimers();

    await expect(promise).resolves.toBeUndefined();
  });
});
