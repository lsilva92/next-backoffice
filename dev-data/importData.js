const { MongoClient } = require('mongodb');
const fs = require('fs');
require('dotenv').config({ path: '../.env.local' });

const mongoUrl = process.env.MONGODB_URI;
const dbName = process.env.MONGO_DATABASE;
const collectionName = process.env.MONGO_COLLECTION;

const rawData = fs.readFileSync('./configData.json');
const jsonData = JSON.parse(rawData);

async function importData() {
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    console.log(new Date().toLocaleString() + ': Connected to MongoDB');

    const db = client.db(dbName);

    // Criar o BD se não existir
    const adminDb = client.db('admin').admin();
    const databases = await adminDb.listDatabases();
    if (!databases.databases.find((dbInfo) => dbInfo.name === dbName)) {
      console.log(`DB '${dbName}' not found. Creating...`);
      await db.createCollection('dummy');
      await adminDb.command({
        renameCollection: `${dbName}.dummy`,
        to: `${dbName}.${collectionName}`,
      });
      console.log(`DB '${dbName}' Created.`);
    }

    const collection = db.collection(collectionName);

    // Criar a collection se não existir
    const collections = await db.listCollections().toArray();
    if (
      !collections.find(
        (collectionInfo) => collectionInfo.name === collectionName
      )
    ) {
      console.log(`Collection '${collectionName}' not found. Creating...`);
      await db.createCollection(collectionName);
      console.log(`Collection '${collectionName}' created.`);
    }

    const date = new Date();

    const dataToImport = jsonData.map((item) => ({
      ticket: item.ticket,
      description: item.description,
      bd: item.bd,
      sync: item.sync,
      created: new Date(date.getTime()),
    }));

    // Inserir dados na collection
    const result = await collection.insertMany(dataToImport);
    console.log(`${result.insertedCount} documents added.`);
  } finally {
    await client.close();
    console.log(new Date().toLocaleString() + ': MongoDB connection Closed');
  }
}

importData();
