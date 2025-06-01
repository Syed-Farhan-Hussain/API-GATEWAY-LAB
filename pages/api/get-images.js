import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = 'cloudinary_uploads';

async function connectDatabase() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  return client.db(MONGODB_DB);
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const db = await connectDatabase();
      const collection = db.collection('uploaded_images');
      
      // Get the most recent uploads first
      const images = await collection
        .find({})
        .sort({ uploadedAt: -1 })
        .limit(20) // Limit to 20 most recent images
        .toArray();
      
      res.status(200).json({ images });
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).json({ 
        message: 'Failed to fetch images from database.',
        error: error.message
      });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
