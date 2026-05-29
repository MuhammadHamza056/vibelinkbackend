// Dev-only helper: boots an ephemeral in-memory MongoDB and prints its URI.
// Used to verify the API without touching the real Atlas credentials.
const { MongoMemoryServer } = require('mongodb-memory-server');

(async () => {
  const mongod = await MongoMemoryServer.create({
    instance: { launchTimeout: 120000 },
  });
  const uri = mongod.getUri('vibelink');
  console.log('MEM_MONGO_URI=' + uri);
  process.on('SIGTERM', async () => {
    await mongod.stop();
    process.exit(0);
  });
})();
