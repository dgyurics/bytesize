import { UniqueIdGenerator } from "./src/UniqueIdGenerator";

// Define entity symbols
const ENTITY_PROVIDER = Symbol("prv");
const ENTITY_CLIENT = Symbol("cli");
const ENTITY_INVOICE = Symbol("inv");

// Initialize the generator
const appId = "SFH"; // salesforce hub
const machineId = 0;
const entityMap = {
  [ENTITY_PROVIDER]: 1,
  [ENTITY_CLIENT]: 2,
  [ENTITY_INVOICE]: 3,
};
const generator = new UniqueIdGenerator(appId, entityMap, machineId);

// Generate and log some IDs
logFormatted("Generated Provider ID:", generator.generateId(ENTITY_PROVIDER));
logFormatted("Generated Provider ID:", generator.generateId(ENTITY_PROVIDER));

logFormatted("Generated Client ID:", generator.generateId(ENTITY_CLIENT));
logFormatted("Generated Client ID:", generator.generateId(ENTITY_CLIENT));

logFormatted("Generated Invoice ID:", generator.generateId(ENTITY_INVOICE));
logFormatted("Generated Invoice ID:", generator.generateId(ENTITY_INVOICE));

// Extract and log information from an ID
// const testProviderId_0 = generator.generateId(ENTITY_PROVIDER);
// console.log("\n\n")
// logFormatted("Generated Provider ID:", testProviderId_0);
// logFormatted("Entity from ID:", generator.extractEntityFromId(testProviderId_0)?.description);
// logFormatted("Timestamp from ID:", generator.getTimestampFromId(testProviderId_0).toString());
// logFormatted("Shortened ID:", generator.getShortenedId(testProviderId_0));
// logFormatted("Formatted ID:", generator.getFormattedId(testProviderId_0));

// console.log("\n\n")
// const testProviderId_1 = generator.generateId(ENTITY_PROVIDER);
// logFormatted("Generated Provider ID:", testProviderId_1);
// logFormatted("Entity from ID:", generator.extractEntityFromId(testProviderId_1)?.description);
// logFormatted("Timestamp from ID:", generator.getTimestampFromId(testProviderId_1).toString());
// logFormatted("Shortened ID:", generator.getShortenedId(testProviderId_1));
// logFormatted("Formatted ID:", generator.getFormattedId(testProviderId_1));

// console.log("\n\n")
// const testClientId_0 = generator.generateId(ENTITY_CLIENT);
// logFormatted("Generated Client ID:", testClientId_0);
// logFormatted("Entity from ID:", generator.extractEntityFromId(testClientId_0)?.description);
// logFormatted("Timestamp from ID:", generator.getTimestampFromId(testClientId_0).toString());
// logFormatted("Shortened ID:", generator.getShortenedId(testClientId_0));
// logFormatted("Formatted ID:", generator.getFormattedId(testClientId_0));

// console.log("\n\n")
// const testInvoiceId_1 = generator.generateId(ENTITY_INVOICE);
// logFormatted("Generated Invoice ID:", testInvoiceId_1);
// logFormatted("Entity from ID:", generator.extractEntityFromId(testInvoiceId_1)?.description);
// logFormatted("Timestamp from ID:", generator.getTimestampFromId(testInvoiceId_1).toString());
// logFormatted("Shortened ID:", generator.getShortenedId(testInvoiceId_1));
// logFormatted("Formatted ID:", generator.getFormattedId(testInvoiceId_1));


// Helper function to align console output
function logFormatted(label: string, value?: string) {
  console.log(label.padEnd(30) + value);
}
