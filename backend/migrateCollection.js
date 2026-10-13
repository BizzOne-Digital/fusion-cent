const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product');

dotenv.config();

const run = async () => {
  await connectDB();
  const result = await Product.updateMany(
    { tags: 'decant' },
    { $set: { catalogType: 'decant' } }
  );
  const fix = await Product.updateMany(
    { $or: [{ collection: { $exists: true } }] },
    { $unset: { collection: '' } }
  );
  console.log(`Updated ${result.modifiedCount} designer decant products to catalogType: 'decant'`);
  console.log(`Cleaned up ${fix.modifiedCount} stray 'collection' field(s) from the earlier mistake`);
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });
