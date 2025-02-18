export class UniqueIdGenerator {
  private appId: string;
  private machineId: number;
  private entityMap: Record<symbol, number>;
  private inverseEntityMap: Record<number, symbol>;
  private seqId: number;
  private lastTimestamp: number;
  private readonly customEpoch = new Date("2025-01-01T00:00:00Z").getTime(); // Custom epoch

  constructor(appId: string, entityMap: Record<symbol, number> = {}, machineId?: number) {
    if (!appId || appId.length !== 3) {
      throw new Error("App ID must be exactly 3 letters.");
    }

    this.appId = appId.toLowerCase();
    this.machineId = machineId ?? this.generateMachineIdFromTimestamp();
    this.entityMap = entityMap;
    this.inverseEntityMap = this.createInverseEntityMap(entityMap);;
    this.seqId = 0;
    this.lastTimestamp = 0;
  }

  // Generate a unique machine ID
  // WARNING!! FIXME: Has potential for collisions
  private generateMachineIdFromTimestamp(): number {
    const timestamp = Date.now() - this.customEpoch; // Milliseconds since custom epoch
    return timestamp % 256; // Keep within 8-bit range (0-255)
  }

  private createInverseEntityMap(entityMap: Record<symbol, number>): Record<number, symbol> {
    const inverseMap: Record<number, symbol> = {};

    // Use getOwnPropertySymbols to get the Symbol keys
    const symbolKeys = Object.getOwnPropertySymbols(entityMap);

    for (const symbolKey of symbolKeys) {
      const value = entityMap[symbolKey];
      inverseMap[value] = symbolKey;
    }
    return inverseMap;
  }

  public generateId(symbol: symbol): string {
    // Calculate milliseconds since custom epoch (max 41 bits, approx. 69 years)
    let timestamp = Date.now() - this.customEpoch;
    if (timestamp > 2199023255551) {
      throw new Error("Timestamp must be smaller than 2199023255551 (41 bits).");
    }

    // Map symbol to integer (max 4 bits, 0-15)
    const entityId = this.entityMap[symbol] ?? -1;
    if (entityId > 15 || entityId < 0) {
      throw new Error("Entity ID must be within 4 bits (0-15).");
    }

    // Ensures unique ID generation by properly handling sequence exhaustion
    // This is necessary to prevent collisions when generating IDs in rapid succession
    // within the same millisecond and shard
    while (true) {
      if (timestamp !== this.lastTimestamp) {
          this.seqId = 0;
          this.lastTimestamp = timestamp;
          break; // Timestamp has changed, reset sequence and continue
      }

      this.seqId++;
      if (this.seqId < 1024) {
          break; // Sequence within limits, continue
      }

      // Sequence exhausted, increment timestamp and try again
      timestamp = Date.now() - this.customEpoch;

      if (timestamp > 2199023255551) {
        throw new Error("Timestamp must be smaller than 2199023255551 (41 bits).");
      }
  }

    // Create the unique ID (64 bits), where the MSB is unused
    const id = BigInt(timestamp) << 22n | // 41 bits for timestamp
               BigInt(this.machineId) << 14n | // 8 bits for machine ID
               BigInt(this.seqId) << 4n |      // 10 bits for sequence
               BigInt(entityId);            // 4 bits for entity ID

    return id.toString();
  }

  public extractEntityFromId(id: string): symbol | null {
    const numericId = BigInt(id);

    // Extract the last 4 bits (entity ID)
    const entityId = Number(numericId & 0b1111n);

    // Map the integer back to the corresponding symbol
    return this.inverseEntityMap[entityId] || null;
  }

  public getTimestampFromId(id: string): Date {
    const numericId = BigInt(id);
    const timestamp = Number(numericId >> 22n) + this.customEpoch; // Extract timestamp
    return new Date(timestamp); // Convert to human-readable date
  }

  public getShortenedId(id: string): string {
    const entityName = this.extractEntityFromId(id)?.description ?? "unknown"; // Extract entity
    return `${entityName.substring(0, 3)}-${id}`; // Prefix first 3 chars of entity name
  }

  public getFormattedId(id: string): string {
    const entityName = this.extractEntityFromId(id)?.description ?? "unknown"; // Extract entity
    return `${this.appId}-${entityName}-${id}`; // Format appID-entity-ID
  }
}
