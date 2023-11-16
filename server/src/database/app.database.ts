import { Client, Databases, Storage } from 'node-appwrite';

let client: Client = null;
let db: Databases = null;
let storage: Storage = null;
const DB_ID = 'DEV';

function InitAppWriteClient(): void {
  client = new Client();

  client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  db = new Databases(client);
  storage = new Storage(client);
}

export { db, storage, InitAppWriteClient, DB_ID };
