// MongoDB Setup Script for GnosisLens
// Run this script to set up MongoDB locally for development

import 'dotenv/config';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'gnosislens';

async function setupMongoDB() {
  let client;
  
  try {
    console.log('🔧 Setting up MongoDB for GnosisLens...');
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Create collections with indexes
    const collections = [
      'user_purchases',
      'market_prices', 
      'user_analytics'
    ];
    
    for (const collectionName of collections) {
      const collection = db.collection(collectionName);
      
      // Create collection if it doesn't exist
      try {
        await collection.createIndexes([
          // User purchases indexes
          { key: { userId: 1, timestamp: -1 } },
          { key: { country: 1, itemName: 1 } },
          { key: { timestamp: -1 } },
          
          // Market prices indexes
          { key: { country: 1, itemName: 1 }, unique: true },
          { key: { lastUpdated: -1 } },
          
          // User analytics indexes
          { key: { userId: 1 } }
        ]);
      } catch (indexError) {
        // Ignore index conflicts - they already exist
        console.log(`⚠️ Indexes may already exist for ${collectionName}`);
      }
      
      console.log(`✅ Created collection: ${collectionName}`);
    }
    
    // Insert sample data for demo
    console.log('📊 Inserting sample data...');
    
    // Sample user purchases
    const samplePurchases = [
      {
        userId: 'demo_user_1',
        itemName: 'bottle of water',
        pricePaid: 50,
        currency: 'EGP',
        country: 'Egypt',
        city: 'Cairo',
        scamScore: 90,
        goddess: 'NEMESIS',
        fairPriceMin: 5,
        fairPriceMax: 15,
        markupPercentage: 233,
        currencyConversion: {
          originalAmount: 50,
          originalCurrency: 'EGP',
          convertedAmount: 1.04,
          convertedCurrency: 'USD',
          exchangeRate: 0.0208
        },
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        location: null
      },
      {
        userId: 'demo_user_1',
        itemName: 'pizza',
        pricePaid: 15,
        currency: 'EUR',
        country: 'Italy',
        city: 'Rome',
        scamScore: 20,
        goddess: 'DIKE',
        fairPriceMin: 10,
        fairPriceMax: 16,
        markupPercentage: 15,
        currencyConversion: {
          originalAmount: 15,
          originalCurrency: 'EUR',
          convertedAmount: 16.28,
          convertedCurrency: 'USD',
          exchangeRate: 1.085
        },
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
        location: null
      },
      {
        userId: 'demo_user_2',
        itemName: 'taxi ride',
        pricePaid: 200,
        currency: 'THB',
        country: 'Thailand',
        city: 'Bangkok',
        scamScore: 75,
        goddess: 'NEMESIS',
        fairPriceMin: 50,
        fairPriceMax: 100,
        markupPercentage: 100,
        currencyConversion: {
          originalAmount: 200,
          originalCurrency: 'THB',
          convertedAmount: 5.52,
          convertedCurrency: 'USD',
          exchangeRate: 0.0276
        },
        timestamp: new Date(Date.now() - 259200000), // 3 days ago
        location: null
      }
    ];
    
    await db.collection('user_purchases').insertMany(samplePurchases);
    console.log('✅ Inserted sample purchase data');
    
    // Sample market prices
    const samplePrices = [
      {
        country: 'Egypt',
        itemName: 'bottle of water',
        currency: 'EGP',
        fairPriceMin: 5,
        fairPriceMax: 15,
        lastUpdated: new Date(),
        dataSource: 'user_reports',
        reportCount: 15,
        priceReports: [
          { price: 10, scamScore: 15, timestamp: new Date(), userId: 'demo_user_1' },
          { price: 50, scamScore: 90, timestamp: new Date(), userId: 'demo_user_1' },
          { price: 8, scamScore: 25, timestamp: new Date(), userId: 'demo_user_2' }
        ]
      },
      {
        country: 'Italy',
        itemName: 'pizza',
        currency: 'EUR',
        fairPriceMin: 10,
        fairPriceMax: 16,
        lastUpdated: new Date(),
        dataSource: 'user_reports',
        reportCount: 8,
        priceReports: [
          { price: 15, scamScore: 20, timestamp: new Date(), userId: 'demo_user_1' },
          { price: 12, scamScore: 10, timestamp: new Date(), userId: 'demo_user_2' }
        ]
      }
    ];
    
    await db.collection('market_prices').insertMany(samplePrices);
    console.log('✅ Inserted sample market price data');
    
    console.log('\n🎉 MongoDB setup complete!');
    console.log('📊 Database:', DB_NAME);
    console.log('📁 Collections created:', collections.join(', '));
    console.log('🔍 Sample data inserted for demo');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('🔒 MongoDB connection closed');
    }
  }
}

// Run setup
setupMongoDB();
