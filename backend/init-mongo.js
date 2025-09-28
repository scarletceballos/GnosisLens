// MongoDB initialization script
db = db.getSiblingDB('gnosislens');

// Create collections
db.createCollection('users');
db.createCollection('user_purchases');
db.createCollection('market_prices');
db.createCollection('user_analytics');

// Create indexes for better performance
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });
db.user_purchases.createIndex({ "userId": 1 });
db.user_purchases.createIndex({ "timestamp": -1 });
db.market_prices.createIndex({ "country": 1, "itemName": 1 });
db.user_analytics.createIndex({ "userId": 1 });

print('MongoDB initialization completed for GnosisLens');

