const { MongoMemoryServer } = require('mongodb-memory-server');

async function run() {
  console.log('Starting local standalone MongoDB instance for development...');
  const mongod = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbName: 'dsdl_recruitment'
    }
  });

  const uri = mongod.getUri();
  console.log(`✅ Standalone MongoDB server started successfully on ${uri}`);
  console.log('Press Ctrl+C to stop.');

  process.on('SIGINT', async () => {
    await mongod.stop();
    process.exit(0);
  });
}

run().catch(err => {
  console.error('Failed to start local standalone MongoDB:', err);
  process.exit(1);
});
