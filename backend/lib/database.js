// MongoDB Database Service for GnosisLens
import { MongoClient } from 'mongodb';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'gnosislens';

let client;
let db;

// Connect to MongoDB
export async function connectToDatabase() {
  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 15000, // Keep trying to send operations for 15 seconds
        connectTimeoutMS: 15000, // Give up initial connection after 15 seconds
        socketTimeoutMS: 30000, // Close sockets after 30 seconds of inactivity
        maxPoolSize: 1, // Maintain 1 socket connection
        retryWrites: false, // Disable retry writes
        retryReads: false, // Disable retry reads
      });
      await client.connect();
      console.log('✅ Connected to MongoDB');
    }
    
    if (!db) {
      db = client.db(DB_NAME);
    }
    
    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('⚠️ Running in fallback mode - data will not be persisted');
    // Don't throw error, just log it and continue without DB
    return { client: null, db: null };
  }
}

// Get database instance
export async function getDatabase() {
  const { db } = await connectToDatabase();
  return db;
}

// Collections
export const COLLECTIONS = {
  USER_PURCHASES: 'user_purchases',
  MARKET_PRICES: 'market_prices',
  USER_ANALYTICS: 'user_analytics'
};

// ==================== USER PURCHASE HISTORY ====================

// Save user purchase
export async function saveUserPurchase(purchaseData) {
  try {
    const db = await getDatabase();
    if (!db) {
      console.log('⚠️ MongoDB not available - skipping purchase save');
      return null;
    }
    
    const collection = db.collection(COLLECTIONS.USER_PURCHASES);
    
    const purchase = {
      userId: purchaseData.userId || 'anonymous',
      itemName: purchaseData.itemName,
      pricePaid: purchaseData.pricePaid,
      currency: purchaseData.currency,
      country: purchaseData.country,
      city: purchaseData.city || 'unknown',
      scamScore: purchaseData.scamScore,
      goddess: purchaseData.goddess,
      fairPriceMin: purchaseData.fairPriceMin,
      fairPriceMax: purchaseData.fairPriceMax,
      markupPercentage: purchaseData.markupPercentage,
      currencyConversion: purchaseData.currencyConversion,
      timestamp: new Date(),
      location: purchaseData.location || null
    };
    
    const result = await collection.insertOne(purchase);
    console.log('📝 Saved user purchase:', result.insertedId);
    return result;
  } catch (error) {
    console.error('❌ Error saving purchase:', error);
    throw error;
  }
}

// Get user purchase history
export async function getUserPurchaseHistory(userId, limit = 10) {
  try {
    const db = await getDatabase();
    if (!db) {
      console.log('⚠️ MongoDB not available - returning empty history');
      return [];
    }
    
    const collection = db.collection(COLLECTIONS.USER_PURCHASES);
    
    const purchases = await collection
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
    
    return purchases;
  } catch (error) {
    console.error('❌ Error fetching purchase history:', error);
    throw error;
  }
}

// Get user analytics
export async function getUserAnalytics(userId) {
  try {
    const db = await getDatabase();
    const collection = db.collection(COLLECTIONS.USER_PURCHASES);
    
    // Aggregation pipeline for analytics
    const pipeline = [
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalPurchases: { $sum: 1 },
          totalSpent: { 
            $sum: { 
              $multiply: ['$pricePaid', '$currencyConversion.exchangeRate'] 
            } 
          },
          averageScamScore: { $avg: '$scamScore' },
          highestScamScore: { $max: '$scamScore' },
          lowestScamScore: { $min: '$scamScore' },
          countries: { $addToSet: '$country' },
          goddesses: { $addToSet: '$goddess' },
          totalScammed: {
            $sum: { $cond: [{ $gt: ['$scamScore', 30] }, 1, 0] }
          },
          totalFairDeals: {
            $sum: { $cond: [{ $lt: ['$scamScore', 30] }, 1, 0] }
          }
        }
      }
    ];
    
    const result = await collection.aggregate(pipeline).toArray();
    return result[0] || null;
  } catch (error) {
    console.error('❌ Error calculating user analytics:', error);
    throw error;
  }
}

// ==================== REAL-TIME PRICE DATABASE ====================

// Update market price
export async function updateMarketPrice(priceData) {
  try {
    const db = await getDatabase();
    const collection = db.collection(COLLECTIONS.MARKET_PRICES);
    
    const filter = {
      country: priceData.country,
      itemName: priceData.itemName
    };
    
    const update = {
      $set: {
        country: priceData.country,
        itemName: priceData.itemName,
        currency: priceData.currency,
        fairPriceMin: priceData.fairPriceMin,
        fairPriceMax: priceData.fairPriceMax,
        lastUpdated: new Date(),
        dataSource: 'user_reports'
      },
      $inc: { reportCount: 1 },
      $push: {
        priceReports: {
          price: priceData.pricePaid,
          scamScore: priceData.scamScore,
          timestamp: new Date(),
          userId: priceData.userId || 'anonymous'
        }
      }
    };
    
    const options = { upsert: true };
    const result = await collection.updateOne(filter, update, options);
    
    console.log('📊 Updated market price for:', priceData.itemName, 'in', priceData.country);
    return result;
  } catch (error) {
    console.error('❌ Error updating market price:', error);
    throw error;
  }
}

// Get market prices for country
export async function getMarketPrices(country, itemName = null) {
  try {
    const db = await getDatabase();
    const collection = db.collection(COLLECTIONS.MARKET_PRICES);
    
    const filter = { country };
    if (itemName) {
      filter.itemName = itemName;
    }
    
    const prices = await collection.find(filter).toArray();
    return prices;
  } catch (error) {
    console.error('❌ Error fetching market prices:', error);
    throw error;
  }
}

// Get price statistics
export async function getPriceStatistics(country, itemName) {
  try {
    const db = await getDatabase();
    const collection = db.collection(COLLECTIONS.MARKET_PRICES);
    
    const pipeline = [
      { $match: { country, itemName } },
      { $unwind: '$priceReports' },
      {
        $group: {
          _id: null,
          averagePrice: { $avg: '$priceReports.price' },
          minPrice: { $min: '$priceReports.price' },
          maxPrice: { $max: '$priceReports.price' },
          totalReports: { $sum: 1 },
          averageScamScore: { $avg: '$priceReports.scamScore' },
          recentReports: {
            $push: {
              price: '$priceReports.price',
              scamScore: '$priceReports.scamScore',
              timestamp: '$priceReports.timestamp'
            }
          }
        }
      }
    ];
    
    const result = await collection.aggregate(pipeline).toArray();
    return result[0] || null;
  } catch (error) {
    console.error('❌ Error calculating price statistics:', error);
    throw error;
  }
}

// ==================== GLOBAL ANALYTICS ====================

// Get global scam statistics
export async function getGlobalScamStatistics() {
  try {
    const db = await getDatabase();
    const collection = db.collection(COLLECTIONS.USER_PURCHASES);
    
    const pipeline = [
      {
        $group: {
          _id: null,
          totalPurchases: { $sum: 1 },
          averageScamScore: { $avg: '$scamScore' },
          countries: { $addToSet: '$country' },
          mostScammedCountry: {
            $push: {
              country: '$country',
              scamScore: '$scamScore'
            }
          },
          goddessUsage: {
            $push: '$goddess'
          }
        }
      }
    ];
    
    const result = await collection.aggregate(pipeline).toArray();
    return result[0] || null;
  } catch (error) {
    console.error('❌ Error calculating global statistics:', error);
    throw error;
  }
}

// Close database connection
export async function closeDatabase() {
  if (client) {
    await client.close();
    console.log('🔒 MongoDB connection closed');
  }
}
