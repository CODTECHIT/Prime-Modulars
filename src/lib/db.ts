import { MongoClient, type Db } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;
let connecting: Promise<Db> | null = null;

function getConfig() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;
  if (!uri || !dbName) {
    throw new Error(
      "MongoDB configuration missing. Set MONGODB_URI and MONGODB_DB_NAME environment variables.",
    );
  }
  return { uri, dbName };
}

function onConnectionClosed() {
  client = null;
  db = null;
  connecting = null;
}

export async function getDb(): Promise<Db> {
  if (db && client) return db;

  if (connecting) return connecting;

  const { uri, dbName } = getConfig();

  connecting = (async () => {
    try {
      const newClient = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5_000,
        connectTimeoutMS: 10_000,
        retryWrites: true,
      });

      newClient.on("connectionClosed", onConnectionClosed);
      newClient.on("close", onConnectionClosed);

      await newClient.connect();
      client = newClient;
      db = newClient.db(dbName);
      return db;
    } catch (error) {
      connecting = null;
      client = null;
      db = null;
      throw error;
    }
  })();

  return connecting;
}

export async function closeDb(): Promise<void> {
  connecting = null;
  if (client) {
    const c = client;
    client = null;
    db = null;
    try {
      await c.close();
    } catch {
      // ignore close errors
    }
  }
}
