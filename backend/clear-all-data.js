// Unified Database Clearing Script for GnosisLens
// Clears ALL data from ALL databases - users, purchases, market prices, everything

import 'dotenv/config';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

async function clearAllData() {
  let client;
  
  try {
    console.log('🔧 Connecting to MongoDB...');
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    // List all databases
    const adminDb = client.db().admin();
    const databases = await adminDb.listDatabases();
    
    console.log('\n🗑️  Clearing ALL data from ALL databases...');
    
    let totalDeleted = 0;
    
    for (const dbInfo of databases.databases) {
      // Skip system databases
      if (['admin', 'local', 'config'].includes(dbInfo.name)) {
        continue;
      }
      
      console.log(`\n📂 Database: ${dbInfo.name}`);
      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      
      for (const collection of collections) {
        const count = await db.collection(collection.name).countDocuments();
        if (count > 0) {
          const result = await db.collection(collection.name).deleteMany({});
          console.log(`  ✅ Cleared ${collection.name}: ${result.deletedCount} documents`);
          totalDeleted += result.deletedCount;
        } else {
          console.log(`  ⚪ ${collection.name}: already empty`);
        }
      }
    }
    
    console.log(`\n🎉 Database clearing complete!`);
    console.log(`📊 Total documents deleted: ${totalDeleted}`);
    console.log('✨ All user accounts, purchase history, and market data have been cleared');
    console.log('🚀 Ready for fresh start!');
    
  } catch (error) {
    console.error('❌ Error clearing databases:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('🔒 MongoDB connection closed');
    }
  }
}

// Run the script
clearAllData();
