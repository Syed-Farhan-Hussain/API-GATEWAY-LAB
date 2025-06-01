import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = 'cloudinary_uploads'; // You can change this to your preferred database name

async function connectDatabase() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  return client.db(MONGODB_DB);
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'Image URL is required.' });
    }

    try {
      const db = await connectDatabase();
      const collection = db.collection('uploaded_images');
      const result = await collection.insertOne({ 
        url, 
        uploadedAt: new Date() 
      });
      
      console.log('Image URL saved:', result);
      res.status(200).json({ 
        message: 'Image URL saved to database successfully!',
        id: result.insertedId
      });
    } catch (error) {
      console.error('Error saving image URL:', error);
      res.status(500).json({ 
        message: 'Failed to save image URL to database.',
        error: error.message
      });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
