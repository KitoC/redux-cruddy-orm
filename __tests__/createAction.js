const createAction = require("../src/createAction");
const isFunction = require("lodash/isFunction");

describe("createAction", () => {
  const TYPE = "counter/increment";
  const increment = createAction(TYPE);

  const expectedReturnWhenNoArgs = { type: TYPE, payload: {} };
  const expectedReturnWithArgs = { type: TYPE, payload: { foo: "bar" } };

  const expectedObjectAssignmentFunction = () => {};
  const expectedObjectAssignment = {
    [TYPE]: expectedObjectAssignmentFunction
  };

  it("returns a function", () => {
    expect(isFunction(increment)).toBeTruthy();
  });

  it("assigns type to function object", () => {
    expect(increment.type).toBe(TYPE);
  });

  it("reassigns toString to return type", () => {
    expect(increment.toString()).toBe(TYPE);
  });

  describe("when assigned to object with bracket notation", () => {
    const objectAssignment = { [increment]: expectedObjectAssignmentFunction };

    it("uses type as object key ", () => {
      expect(objectAssignment).toStrictEqual(expectedObjectAssignment);
    });
  });

  describe("when called with no arguments", () => {
    it("returns type and empty payload", () => {
      expect(increment()).toStrictEqual(expectedReturnWhenNoArgs);
    });
  });

  describe("when called with arguments", () => {
    it("returns type and payload", () => {
      expect(increment(expectedReturnWithArgs.payload)).toStrictEqual(
        expectedReturnWithArgs
      );
    });
  });
});
