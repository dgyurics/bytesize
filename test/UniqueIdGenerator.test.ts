const { UniqueIdGenerator } = require("../src/UniqueIdGenerator");

const ENTITY_USER = Symbol("user");
const ENTITY_ORDER = Symbol("order");

describe("UniqueIdGenerator", () => {
  const generator = new UniqueIdGenerator("app", {
    [ENTITY_USER]: 1,
    [ENTITY_ORDER]: 2,
  });

  it("should generate unique IDs", () => {
    const id1 = generator.generateId(ENTITY_USER);
    const id2 = generator.generateId(ENTITY_USER);
    expect(id1).not.toEqual(id2);
  });

  it("should extract entity from ID", () => {
    const id = generator.generateId(ENTITY_ORDER);
    const entity = generator.extractEntityFromId(id);
    expect(entity).toBe(ENTITY_ORDER);
  });

  it("should extract timestamp as a Date object", () => {
    const id = generator.generateId(ENTITY_USER);
    const timestamp = generator.getTimestampFromId(id);
    expect(timestamp).toBeInstanceOf(Date);
    expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now());
  });

  it("should return entity-prefixed ID", () => {
    const id = generator.generateId(ENTITY_USER);
    const prefixedId = generator.getShortenedId(id);
    expect(prefixedId.startsWith("use-")).toBeTruthy();
  });

  it("should return formatted ID with app and entity name", () => {
    const id = generator.generateId(ENTITY_ORDER);
    const formattedId = generator.getFormattedId(id);
    expect(formattedId.startsWith("app-order-")).toBeTruthy();
  });

  it("should throw an error for unknown entity", () => {
    expect(() => generator.generateId(Symbol("unknown"))).toThrowError(
      "Entity ID must be within 4 bits (0-15)."
    );
  });

  it("should generate IDs that contain the correct entity when extracted", () => {
    const idUser = generator.generateId(ENTITY_USER);
    const idOrder = generator.generateId(ENTITY_ORDER);
    expect(generator.extractEntityFromId(idUser)).toBe(ENTITY_USER);
    expect(generator.extractEntityFromId(idOrder)).toBe(ENTITY_ORDER);
  });

  it("should always produce IDs that are 64-bit safe", () => {
    const id = generator.generateId(ENTITY_USER);
    expect(BigInt(id) <= BigInt("9223372036854775807")).toBeTruthy();
  });

  const testCases = 10000;
  it(`should generate ${testCases} unique IDs`, () => {
    const ids = new Set<string>();

    for (let i = 0; i < testCases; i++) {
      const id = generator.generateId(ENTITY_USER);
      ids.add(id);
    }
  
    expect(ids.size).toBe(testCases); // No collisions
  });

  it("should generate 10 UniqueIdGenerators with unique machineIds", async () => {
    const generators = new Set<number>();
  
    for (let i = 0; i < 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 5)); // Small sleep of 5ms
      const newGenerator = new UniqueIdGenerator("app", {
        [ENTITY_USER]: 1,
        [ENTITY_ORDER]: 2,
      });
  
      generators.add(newGenerator["machineId"]); // Access private machineId directly
    }
  
    expect(generators.size).toBe(10); // Ensure all generated IDs are unique
  });
});
