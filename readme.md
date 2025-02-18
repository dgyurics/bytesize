# Unique ID Generator

## Overview
The `UniqueIdGenerator` class is a utility for generating unique, structured 64-bit IDs based on timestamp, machine ID, entity type, and sequence number. The implementation is inspired by Twitter's Snowflake ID generation strategy and ensures IDs are unique across different machines and entities.

## Features
- **Generate Unique IDs**: Quickly generate unique 64-bit IDs within a deployment.
- **Extract Entity from ID**: Retrieve the associated entity type from an existing ID.
- **Retrieve Timestamp from ID**: Get the creation timestamp of a generated ID.
- **Format IDs for Readability**: Convert IDs into human-friendly formats with app and entity prefixes.
- **Custom Entity Mapping**: Define and use different entity types with symbol-based identifiers.

## Installation
```sh
npm install <not yet published>
```

## Usage
### Importing the Generator
```typescript
import { UniqueIdGenerator } from "./UniqueIdGenerator";
```

### Creating an Instance
```typescript
const ENTITY_USER = Symbol("user");
const ENTITY_ORDER = Symbol("order");

const generator = new UniqueIdGenerator("app", {
  [ENTITY_USER]: 1,
  [ENTITY_ORDER]: 2,
});
```

### Generating an ID
```typescript
const userId = generator.generateId(ENTITY_USER);
console.log("Generated User ID:", userId);
```

### Extracting Entity Type from ID
```typescript
const entity = generator.extractEntityFromId(userId);
console.log("Extracted Entity:", entity?.description);
```

### Getting Timestamp from ID
```typescript
const timestamp = generator.getTimestampFromId(userId);
console.log("Timestamp:", timestamp.toISOString());
```

### Formatting IDs
```typescript
console.log("Shortened ID:", generator.getShortenedId(userId));
console.log("Formatted ID:", generator.getFormattedId(userId));
```

## ID Structure (64-bit Format)
| Bits | Field          | Description                           |
|------|--------------|---------------------------------------|
| 1    | Unused       | Always 0                              |
| 41   | Timestamp   | Milliseconds since custom epoch       |
| 8    | Machine ID  | Unique ID for the machine instance   |
| 10   | Sequence ID | Prevents collisions in the same millisecond |
| 4    | Entity ID   | Identifies entity type               |

## Limitations & Considerations
- **Machine ID Collision Risk**: Since machine ID is derived from timestamps modulo 256, it may lead to occasional collisions in distributed environments.
- **Sequence Exhaustion**: If more than 1024 IDs are generated within a millisecond, the timestamp increments to prevent overflow.
- **Entity ID Limits**: Only supports up to 16 different entity types (4-bit limitation).

## Future Improvements
- Enhance machine ID uniqueness to avoid potential conflicts in large-scale distributed deployments.
- Implement distributed coordination mechanisms for better uniqueness guarantees.
- Optimize entity ID allocation to support more than 16 entities.

## License
MIT License
