import { MongoClient, Db } from 'mongodb';

const mongoUrl = process.env.MONGODB_URI;
const dbName = process.env.MONGO_DATABASE;
const dbConn: { connected: Boolean } = { connected: false };

let cachedClient: MongoClient;
let cachedDb: Db;

export async function connectToDatabase() {
    if (cachedClient && dbConn.connected && cachedDb) {
        return { client: cachedClient, db: cachedDb };
      }
    
      const client = new MongoClient(String(mongoUrl));
    
      try {
        await client.connect();
        console.log('Connected to MongoDB');
      } catch (error) {
        console.error('Error connecting MongoDB:', error);
        throw error;
      }
    
      const db = client.db(dbName);

      cachedClient = client;
      cachedDb = db;

      client.on('serverOpening', ()=>{ dbConn.connected=true, console.log(new Date().toLocaleString()+': DB connected.') })
      client.on('topologyClosed', ()=>{ dbConn.connected=false, console.log(new Date().toLocaleString()+': DB disconnected.') })
    
      return { client, db };
};