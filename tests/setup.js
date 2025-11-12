/**
 * Test Setup
 * Runs before all tests
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Setup before all tests
beforeAll(async () => {
  // Create in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect to in-memory database
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  console.log('✅ Test database connected');
});

// Cleanup after all tests
afterAll(async () => {
  // Disconnect and stop MongoDB
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
  
  console.log('✅ Test database disconnected');
});

// Clear database between tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
