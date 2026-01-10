import * as dotenv from 'dotenv';

// Load environment variables for integration tests
dotenv.config();

// Increase timeout for integration tests
jest.setTimeout(30000);
