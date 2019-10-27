const createDb = require("../../../src/createOrm");

describe("handleWhere", () => {
  const db = createDb({ models: { testModel: {} } });

  const session = db.createSession();

  const where = { foo: "bar" };
  const record = { foo: "bar" };
  const recordFalse = { foo: "baz" };

  const recordFoundIn = { foo: "bar", _foundIn: ["model.foo.bar.1"] };
  const whereFoundIn = { _foundIn: "model.foo.bar.1" };

  const whereDotNotation = { "foo.bar.baz": "is equal" };
  const nestedRecord = { foo: { bar: { baz: "is equal" } } };

  const whereArray = { foo: ["bar", "some other value"] };

  const handleWhere = session.Models.testModel.__private__.handleWhere;
  it("returns true if where criteria matches on record", () => {
    expect(handleWhere(record, where)).toBe(true);
  });

  it("returns false if where value does not match", () => {
    expect(handleWhere(record, { foo: "baz" })).toBe(false);
  });

  it("returns true if dotNotation value matches nested attribute", () => {
    expect(handleWhere(nestedRecord, whereDotNotation)).toBe(true);
  });

  it("returns true if any array values match", () => {
    expect(handleWhere(record, whereArray)).toBe(true);
  });

  it("returns false if array values dont match", () => {
    expect(handleWhere(recordFalse, whereArray)).toBe(false);
  });

  it("returns true if _foundIn criteria matches", () => {
    expect(handleWhere(recordFoundIn, whereFoundIn)).toBe(true);
  });
});
