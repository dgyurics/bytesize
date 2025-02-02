import { UniqueIdGenerator } from "./src/UniqueIdGenerator";

// Define entity symbols
const ENTITY_PROVIDER = Symbol("prv");
const ENTITY_CLIENT = Symbol("cli");
const ENTITY_INVOICE = Symbol("inv");

// Initialize the generator
const appId = "SFH";
const generator = new UniqueIdGenerator(
  appId,
  {
    [ENTITY_PROVIDER]: 1,
    [ENTITY_CLIENT]: 2,
    [ENTITY_INVOICE]: 3,
  }
);

// Helper function to align console output
function logFormatted(label: string, value?: string) {
  console.log(label.padEnd(30) + value);
}

// Generate and log some IDs
logFormatted("Generated Provider ID:", generator.generateId(ENTITY_PROVIDER));
logFormatted("Generated Client ID:", generator.generateId(ENTITY_CLIENT));
logFormatted("Generated Invoice ID:", generator.generateId(ENTITY_INVOICE));

// Extract and log information from an ID
const testId = generator.generateId(ENTITY_PROVIDER);
logFormatted("Entity from ID:", generator.extractEntityFromId(testId)?.description);
logFormatted("Timestamp from ID:", generator.getTimestampFromId(testId).toString());
logFormatted("Shortened ID:", generator.getShortenedId(testId));
logFormatted("Formatted ID:", generator.getFormattedId(testId));
